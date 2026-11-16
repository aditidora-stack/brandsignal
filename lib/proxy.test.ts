import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { OWNER_COOKIE, ownerToken } from "./shared/owner-lock";

const req = (
  path: string,
  accept = "text/html",
  headers: Record<string, string> = { "x-forwarded-for": "9.9.9.9" },
) => new NextRequest(`http://localhost:3000${path}`, { headers: { accept, ...headers } });

test("page paths never rate limit, in demo or private mode", async () => {
  for (const demo of ["true", "false"]) {
    process.env.NEXT_PUBLIC_DEMO_ONLY = demo;
    for (const path of ["/", "/demo"]) {
      for (let i = 0; i < 200; i++) {
        assert.notEqual((await proxy(req(path))).status, 429);
      }
    }
  }
});

test("private mode: pages pass through with no discovery headers", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  const res = await proxy(req("/", "text/markdown"));
  assert.equal(res.headers.get("link"), null);
  assert.equal(res.headers.get("x-middleware-rewrite"), null);
});

test("demo mode: / gets Link header, markdown Accept rewrites to /index.md", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "true";
  assert.ok((await proxy(req("/"))).headers.get("link")?.includes('rel="llms-txt"'));
  assert.match(
    (await proxy(req("/", "text/markdown"))).headers.get("x-middleware-rewrite") ?? "",
    /\/index\.md$/,
  );
});

test("api paths still rate limit (owner unlocked)", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  process.env.BRANDSIGNAL_OWNER_PASSWORD = "rose";
  const cookie = `${OWNER_COOKIE}=${await ownerToken("rose")}`;
  const statuses: number[] = [];
  for (let i = 0; i < 31; i++) {
    statuses.push((await proxy(req("/api/serp", "text/html", { "x-forwarded-for": "9.9.9.9", cookie }))).status);
  }
  assert.equal(statuses[29], 200);
  assert.equal(statuses[30], 429);
});

test("demo deploy: every /api path is 403 before rate limiting", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "true";
  for (const path of ["/api/analyze", "/api/serp", "/api/unlocker"]) {
    for (let i = 0; i < 40; i++) {
      const res = await proxy(req(path));
      assert.equal(res.status, 403);
      assert.deepEqual(await res.json(), {
        error: "Live API calls are disabled on this demo.",
      });
    }
  }
});

test("spoofed x-forwarded-for entries do not bypass the limit", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  // Real proxy appends 7.7.7.7; the client rotates the first entry.
  const statuses: number[] = [];
  for (let i = 0; i < 31; i++) {
    statuses.push((await proxy(req("/api/spoof", "text/html", { "x-forwarded-for": `1.1.1.${i}, 7.7.7.7` }))).status);
  }
  assert.equal(statuses[29], 200);
  assert.equal(statuses[30], 429);
});

test("x-vercel-forwarded-for wins over a spoofed x-forwarded-for", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  const statuses: number[] = [];
  for (let i = 0; i < 31; i++) {
    statuses.push(
      (await proxy(
        req("/api/vercel-ip", "text/html", {
          "x-vercel-forwarded-for": "5.5.5.5",
          "x-forwarded-for": `2.2.2.${i}`,
        }),
      )).status,
    );
  }
  assert.equal(statuses[30], 429);
});

test("owner lock: paid routes need the owner cookie", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  process.env.BRANDSIGNAL_OWNER_PASSWORD = "rose";
  const anon = await proxy(req("/api/scrape", "text/html", { "x-forwarded-for": "3.3.3.3" }));
  assert.equal(anon.status, 401);
  const wrong = await proxy(req("/api/scrape", "text/html", { "x-forwarded-for": "3.3.3.3", cookie: `${OWNER_COOKIE}=nope` }));
  assert.equal(wrong.status, 401);
  const owner = await proxy(req("/api/scrape", "text/html", { "x-forwarded-for": "3.3.3.3", cookie: `${OWNER_COOKIE}=${await ownerToken("rose")}` }));
  assert.equal(owner.status, 200);
  // The free audit stays open to everyone.
  const audit = await proxy(req("/api/audit", "text/html", { "x-forwarded-for": "3.3.3.3" }));
  assert.equal(audit.status, 200);
});

test("owner lock: with no password set, paid routes stay closed", async () => {
  process.env.NEXT_PUBLIC_DEMO_ONLY = "false";
  delete process.env.BRANDSIGNAL_OWNER_PASSWORD;
  const res = await proxy(req("/api/scrape", "text/html", { "x-forwarded-for": "4.4.4.4", cookie: `${OWNER_COOKIE}=x` }));
  assert.equal(res.status, 401);
});
