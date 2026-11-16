import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORY_PACKS } from "./category-packs";

test("every pack has a brand, at least 7 competitors and 12+ tagged questions", () => {
  for (const pack of CATEGORY_PACKS) {
    assert.ok(pack.brand.brandName);
    assert.ok(pack.competitors.length >= 7, pack.id);
    assert.ok(pack.prompts.length >= 12, pack.id);
    for (const p of pack.prompts) {
      assert.ok(["discover", "compare", "buy"].includes(p.tags[0]), p.text);
    }
  }
});

test("only questions tagged branded may name a tracked brand", () => {
  for (const pack of CATEGORY_PACKS) {
    const names = [pack.brand.brandName, ...pack.competitors.map((c) => c.name)];
    for (const p of pack.prompts.filter((q) => !q.tags.includes("branded"))) {
      for (const n of names) {
        assert.ok(!p.text.toLowerCase().includes(n.toLowerCase()), `${pack.id}: "${p.text}" names ${n}`);
      }
    }
  }
});
