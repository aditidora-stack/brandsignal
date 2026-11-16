import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORY_PACKS } from "./category-packs";

test("every pack has a brand, 7 competitors and 12 tagged questions", () => {
  for (const pack of CATEGORY_PACKS) {
    assert.ok(pack.brand.brandName);
    assert.equal(pack.competitors.length, 7, pack.id);
    assert.equal(pack.prompts.length, 12, pack.id);
    for (const p of pack.prompts) {
      assert.ok(["discover", "compare", "buy"].includes(p.tags[0]), p.text);
    }
  }
});

test("questions never name a tracked brand (fair comparison)", () => {
  for (const pack of CATEGORY_PACKS) {
    const names = [pack.brand.brandName, ...pack.competitors.map((c) => c.name)];
    for (const p of pack.prompts) {
      for (const n of names) {
        assert.ok(!p.text.toLowerCase().includes(n.toLowerCase()), `${pack.id}: "${p.text}" names ${n}`);
      }
    }
  }
});
