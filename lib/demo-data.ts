import type {
  AppState,
  ScrapeRun,
  DriftAlert,
  Battlecard,
  AuditReport,
  Provider,
  TaggedPrompt,
} from "@/components/dashboard/types";

/*
 * Demo dataset.
 *
 * The tracked brand is a fictional luxury skincare house ("Maison Lumière")
 * with fictional competitors. This keeps the demo neutral and avoids implying
 * anything about real companies.
 */

/* ─────────────────────────  Deterministic helpers ───────────────────────── */
/**
 * Fixed dates — never call argument-less new Date(). SSR and client produce
 * identical output. Eight weekly batches so the trend chart shows real movement.
 */
const BATCH_DATES = [
  "2026-01-03T10:00:00.000Z",
  "2026-01-10T10:00:00.000Z",
  "2026-01-17T10:00:00.000Z",
  "2026-01-24T10:00:00.000Z",
  "2026-01-31T10:00:00.000Z",
  "2026-02-07T10:00:00.000Z",
  "2026-02-11T14:30:00.000Z",
  "2026-02-14T09:00:00.000Z",
];
const NUM_BATCHES = BATCH_DATES.length;

/** Simple seeded hash replacing Math.random() — deterministic across SSR & client */
function seedScore(
  base: number,
  providerIdx: number,
  promptIdx: number,
  batch: number,
): number {
  const h =
    ((base + providerIdx * 17 + promptIdx * 31 + batch * 53) * 2654435761) >>>
    0;
  return h % 100;
}

/* ─────────────────────────  Brand + prompts ───────────────────────── */
const BRAND_NAME = "Maison Lumière";

const PROMPTS: TaggedPrompt[] = [
  {
    text: "What are the best luxury moisturizers for sensitive skin in 2026?",
    tags: ["discover", "sensitive-skin"],
  },
  {
    text: "Is luxury skincare worth the price compared to dermatologist brands?",
    tags: ["consider", "price"],
  },
  {
    text: "Compare the top luxury serums for fine lines and dull skin.",
    tags: ["compare", "anti-aging"],
  },
  {
    text: "What should I look for when buying a luxury skincare gift?",
    tags: ["discover", "gifting"],
  },
  {
    text: "Which luxury skincare brands are the most sustainable and refillable?",
    tags: ["compare", "sustainability"],
  },
];

const PROVIDERS: Provider[] = [
  "chatgpt",
  "perplexity",
  "gemini",
  "google_ai",
];

const SAMPLE_SOURCES: Record<string, string[]> = {
  "chatgpt-0": [
    "https://www.luxebeautyreview.com/best-luxury-moisturizers",
    "https://www.skinjournal-sample.com/sensitive-skin-guide",
    "https://maisonlumiere.com/cream",
    "https://velora.com/barrier-cream",
  ],
  "perplexity-0": [
    "https://www.luxebeautyreview.com/best-luxury-moisturizers",
    "https://maisonlumiere.com/",
    "https://www.reddit.com/r/SkincareAddiction/",
  ],
  "gemini-0": [
    "https://www.skinjournal-sample.com/sensitive-skin-guide",
    "https://maisonlumiere.com/cream",
    "https://velora.com/barrier-cream",
  ],
  "chatgpt-1": [
    "https://www.skinjournal-sample.com/luxury-vs-derm",
    "https://maisonlumiere.com/ingredients",
    "https://dewlab.com/science",
  ],
  "perplexity-1": [
    "https://www.skinjournal-sample.com/luxury-vs-derm",
    "https://dewlab.com/science",
    "https://www.reddit.com/r/SkincareAddiction/",
  ],
  "chatgpt-2": [
    "https://www.luxebeautyreview.com/best-serums",
    "https://maisonlumiere.com/serum",
    "https://ateliernoir.com/elixir",
    "https://velora.com/serum",
  ],
  "perplexity-2": [
    "https://www.luxebeautyreview.com/best-serums",
    "https://maisonlumiere.com/serum",
    "https://ateliernoir.com/elixir",
  ],
  "chatgpt-3": [
    "https://www.giftguide-sample.com/luxury-beauty-gifts",
    "https://maisonlumiere.com/gift-sets",
  ],
  "chatgpt-4": [
    "https://maisonlumiere.com/refills",
    "https://velora.com/sustainability",
    "https://www.luxebeautyreview.com/sustainable-luxury-skincare",
  ],
  "perplexity-4": [
    "https://maisonlumiere.com/refills",
    "https://velora.com/sustainability",
  ],
  "google_ai-4": [
    "https://maisonlumiere.com/refills",
    "https://velora.com/sustainability",
    "https://ateliernoir.com/",
  ],
};

const ANSWER_TEMPLATES: Record<string, string> = {
  "chatgpt-0": `Here are some of the best luxury moisturizers for sensitive skin in 2026:

**1. Maison Lumière Barrier Cream** — Fragrance-free, ceramide-rich formula with a refillable glass jar. Often praised for calming redness without feeling heavy.

**2. Velora Barrier Cream** — Clean-beauty positioning with a short ingredient list. Good for very reactive skin.

**3. Dewlab Repair Moisturizer** — Dermatologist-developed and far cheaper, a strong value alternative.

**4. Atelier Noir La Crème** — Ultra-rich and indulgent, but contains fragrance, so patch-test first.

Key things to weigh: fragrance-free formulas, barrier ingredients (ceramides, niacinamide), and texture.`,

  "perplexity-0": `Based on recent reviews, top luxury moisturizers for sensitive skin include:

1. **Maison Lumière Barrier Cream** — Fragrance-free with ceramides; reviewers note fast relief for redness.
2. **Velora Barrier Cream** — Minimal "clean" formula.
3. **Dewlab Repair Moisturizer** — A lower-priced, dermatologist-backed pick.

Reddit's skincare communities often recommend patch-testing even fragrance-free products.`,

  "gemini-0": `Luxury moisturizers that suit sensitive skin this year:

• **Maison Lumière Barrier Cream** — Fragrance-free, ceramide-based, refillable
• **Velora Barrier Cream** — Short, clean ingredient list
• **Dewlab Repair Moisturizer** — Strong value, dermatologist-developed

Look for fragrance-free labels and barrier-repair ingredients.`,

  "chatgpt-1": `Whether luxury skincare is worth it depends on what you're paying for:

**Formula** — Many key actives (retinoids, niacinamide, ceramides) work the same at any price. Dermatologist brands like Dewlab often match luxury formulas on results.

**Experience** — Luxury brands such as Maison Lumière charge more for texture, packaging, scent-free elegance and refill programs.

**Where luxury can win** — Elegant textures people actually use daily, and refillable packaging that lowers long-term waste.

Bottom line: buy dermatologist brands for actives, and luxury for the routine you'll stick to.`,

  "chatgpt-2": `Here's how leading luxury serums compare for fine lines and dullness:

| Serum | Best for | Key active | Price |
|-------|----------|------------|-------|
| Maison Lumière Renewal Serum | Fine lines + glow | Encapsulated retinal | $$$ |
| Velora Bright Serum | Dullness | Vitamin C | $$ |
| Atelier Noir Elixir | Indulgence | Peptides + botanical oils | $$$$ |
| Dewlab Retinal 0.1% | Value | Retinal | $ |

**Maison Lumière** is the strongest all-rounder for both concerns. **Dewlab** gives similar results at a lower price.`,

  "chatgpt-4": `The luxury skincare brands with the strongest sustainability and refill programs include:

1. **Maison Lumière** — Refill pods for its cream and serum, plus recyclable glass jars.
2. **Velora** — Clean formulas and a take-back program for empties.
3. **Atelier Noir** — Beautiful packaging, but limited refill options.

Refill programs only reduce waste if you actually use them, so check whether refills ship in your country.`,
};

// US-heavy spread so the "Visibility by country" panel is populated in demo mode.
const DEMO_COUNTRIES = ["US", "US", "US", "GB", "DE", "CA"];

function buildRunBase(prompt: string, provider: Provider, batch: number) {
  const country =
    DEMO_COUNTRIES[
      (PROVIDERS.indexOf(provider) + batch) % DEMO_COUNTRIES.length
    ];
  return { provider, prompt, createdAt: BATCH_DATES[batch], country };
}

/** Answers used when the brand is NOT present — competitors are cited instead. */
const COMPETITOR_ANSWERS: string[] = [
  `The most-recommended luxury skincare names right now are Velora, Atelier Noir and Dewlab. Velora leads on clean formulas, Atelier Noir on indulgent textures, and Dewlab is the value pick that many reviewers compare against luxury brands.`,
  `For sensitive or reactive skin, Velora and Dewlab come up most often — Velora for short ingredient lists and Dewlab for dermatologist-developed formulas. Atelier Noir is the choice for shoppers who want a luxury ritual.`,
  `Among premium skincare brands, Velora, Atelier Noir and Dewlab are frequently recommended. Shoppers weigh ingredients, fragrance, price per ounce and packaging, with beauty editors and Reddit communities as common references.`,
];

const COMPETITOR_SOURCES: string[] = [
  "https://www.luxebeautyreview.com/best-luxury-moisturizers",
  "https://www.skinjournal-sample.com/sensitive-skin-guide",
  "https://velora.com/barrier-cream",
  "https://dewlab.com/science",
  "https://ateliernoir.com/",
];

/**
 * Deterministic brand-presence gate. Visibility improves over time, so later
 * batches mention the brand more often — this produces a realistic upward trend
 * and leaves earlier runs where competitors are cited but we're absent.
 */
function brandIsMentioned(
  pIdx: number,
  promptIdx: number,
  batch: number,
): boolean {
  const roll = seedScore(7, pIdx, promptIdx, batch) % 100;
  const threshold = 26 + batch * 9; // batch 0 ≈ 26% → final batch ≈ 89%
  return roll < threshold;
}

function buildRun(
  prompt: string,
  provider: Provider,
  promptIdx: number,
  batch: number,
): ScrapeRun {
  const key = `${provider}-${promptIdx}`;
  const pIdx = PROVIDERS.indexOf(provider);
  const jitter = seedScore(42, pIdx, promptIdx, batch) % 30;
  const base = buildRunBase(prompt, provider, batch);

  if (!brandIsMentioned(pIdx, promptIdx, batch)) {
    // Brand absent — competitors cited. Drives the Citation Opportunities tab.
    const answer =
      COMPETITOR_ANSWERS[
        (pIdx + promptIdx + batch) % COMPETITOR_ANSWERS.length
      ];
    const sources = COMPETITOR_SOURCES.slice(0, 2 + ((pIdx + batch) % 3));
    return {
      ...base,
      answer,
      sources,
      visibilityScore: Math.min(40, 5 + (jitter % 25)),
      sentiment: "not-mentioned",
      brandMentions: [],
      competitorMentions: ["Velora", "Dewlab", "Atelier Noir"],
    };
  }

  // Brand mentioned — use a rich template when available, else a default.
  const sources = SAMPLE_SOURCES[key] ?? [
    "https://www.luxebeautyreview.com/best-luxury-moisturizers",
    "https://maisonlumiere.com/",
    "https://velora.com/barrier-cream",
  ];
  const answer =
    ANSWER_TEMPLATES[key] ??
    `For "${prompt}", beauty editors point to a mix of brands. ${BRAND_NAME} stands out for fragrance-free, barrier-friendly formulas and refillable packaging, while Velora and Dewlab are common alternatives. Ingredients, texture, fragrance and price per ounce are what shoppers compare most.`;

  const score = Math.min(100, 58 + jitter + batch * 2);
  const isNegative = seedScore(13, pIdx, promptIdx, batch) % 100 < 9;
  const hasCompetitor = /velora|dewlab|atelier noir/i.test(answer);

  return {
    ...base,
    answer,
    sources,
    visibilityScore: isNegative ? Math.max(34, score - 26) : score,
    sentiment: isNegative ? "negative" : score > 64 ? "positive" : "neutral",
    brandMentions: [BRAND_NAME],
    competitorMentions: hasCompetitor
      ? [
          ...(/velora/i.test(answer) ? ["Velora"] : []),
          ...(/dewlab/i.test(answer) ? ["Dewlab"] : []),
          ...(/atelier noir/i.test(answer) ? ["Atelier Noir"] : []),
        ]
      : [],
  };
}

function generateRuns(): ScrapeRun[] {
  const runs: ScrapeRun[] = [];

  for (let batch = 0; batch < NUM_BATCHES; batch++) {
    PROMPTS.forEach((prompt, pIdx) => {
      const subset = PROVIDERS.filter((_, i) => (i + pIdx + batch) % 3 !== 2);
      subset.forEach((provider) => {
        runs.push(buildRun(prompt.text, provider, pIdx, batch));
      });
    });
  }

  return runs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/* ─────────────────────────  Battlecards ───────────────────────── */
const demoBattlecards: Battlecard[] = [
  {
    competitor: "Velora",
    sentiment: "neutral",
    summary:
      "Clean-beauty skincare brand with short ingredient lists and strong sustainability messaging. Loved by sensitive-skin shoppers; less of a luxury experience than Maison Lumière.",
    sections: [
      {
        heading: "Strengths",
        points: [
          "Short, clean ingredient lists",
          "Trusted by sensitive-skin shoppers",
          "Strong sustainability story",
          "Good beauty-editor coverage",
        ],
      },
      {
        heading: "Weaknesses",
        points: [
          "Fewer hero products",
          "Less luxurious textures",
          "Limited anti-aging range",
          "No refill pods",
        ],
      },
      {
        heading: "AI Visibility",
        points: [
          "Frequently cited for 'clean skincare' queries",
          "Strong on sensitive-skin prompts",
          "Wins Gemini citations via its ingredient glossary",
        ],
      },
    ],
  },
  {
    competitor: "Dewlab",
    sentiment: "neutral",
    summary:
      "Dermatologist-developed skincare at drugstore prices. Competes on value and clinical claims; little luxury appeal compared with Maison Lumière.",
    sections: [
      {
        heading: "Strengths",
        points: [
          "Lowest price per ounce",
          "Dermatologist-developed",
          "Clinically tested actives",
          "Sold everywhere",
        ],
      },
      {
        heading: "Weaknesses",
        points: [
          "Plain packaging",
          "No gifting appeal",
          "More plastic packaging",
          "Weak on luxury prompts",
        ],
      },
      {
        heading: "AI Visibility",
        points: [
          "Cited for 'is luxury skincare worth it' queries",
          "Active on Reddit threads",
          "Rarely surfaced for gifting prompts",
        ],
      },
    ],
  },
  {
    competitor: "Atelier Noir",
    sentiment: "neutral",
    summary:
      "Ultra-luxury skincare house built on indulgent textures and iconic packaging. Highest price point; fragrance makes it a weak fit for the sensitive-skin shopper Maison Lumière targets.",
    sections: [
      {
        heading: "Strengths",
        points: [
          "Iconic packaging",
          "Rich, indulgent textures",
          "Strong gifting appeal",
          "Loyal luxury audience",
        ],
      },
      {
        heading: "Weaknesses",
        points: [
          "Contains fragrance",
          "Highest price point",
          "No refill program",
          "Niche appeal",
        ],
      },
      {
        heading: "AI Visibility",
        points: [
          "Cited for 'luxury gift' queries",
          "Mentioned in luxury roundups",
          "Rarely surfaced for 'sensitive skin' or 'value' prompts",
        ],
      },
    ],
  },
];

/* ─────────────────────────  Audit Report ───────────────────────── */
const demoAuditReport: AuditReport = {
  url: "https://maisonlumiere.com",
  score: 78,
  checks: [
    {
      id: "llms-txt",
      label: "llms.txt present",
      category: "discovery",
      pass: true,
      value: "Found",
      detail: "/llms.txt returns 200 with valid directives",
    },
    {
      id: "robots-txt",
      label: "robots.txt configured",
      category: "discovery",
      pass: true,
      value: "Found",
      detail: "robots.txt allows major AI crawlers",
    },
    {
      id: "schema-org",
      label: "Schema.org markup",
      category: "structure",
      pass: true,
      value: "5 types",
      detail:
        "Organization, WebSite, FAQPage, Product, Review schemas detected",
    },
    {
      id: "faq-schema",
      label: "FAQ schema",
      category: "structure",
      pass: true,
      value: "Present",
      detail: "FAQPage schema with 8 questions found",
    },
    {
      id: "bluf-style",
      label: "BLUF-style content",
      category: "content",
      pass: true,
      value: "Strong",
      detail: "Key pages lead with conclusions before detail",
    },
    {
      id: "heading-structure",
      label: "Heading hierarchy",
      category: "content",
      pass: true,
      value: "Clean",
      detail: "Proper H1→H2→H3 nesting throughout",
    },
    {
      id: "meta-descriptions",
      label: "Meta descriptions",
      category: "content",
      pass: false,
      value: "Missing on 2 pages",
      detail: "/refills and /gift-sets lack meta descriptions",
    },
    {
      id: "page-speed",
      label: "Page speed",
      category: "technical",
      pass: true,
      value: "92/100",
      detail: "LCP: 1.2s, FID: 45ms, CLS: 0.02",
    },
    {
      id: "https",
      label: "HTTPS enabled",
      category: "technical",
      pass: true,
      value: "Active",
      detail: "Valid SSL certificate, HSTS enabled",
    },
    {
      id: "render-test",
      label: "JS rendering",
      category: "rendering",
      pass: true,
      value: "Works",
      detail: "Content accessible without JavaScript",
    },
    {
      id: "canonical-tags",
      label: "Canonical tags",
      category: "technical",
      pass: true,
      value: "Present",
      detail: "All pages have self-referencing canonicals",
    },
    {
      id: "sitemap",
      label: "XML Sitemap",
      category: "discovery",
      pass: true,
      value: "Found",
      detail: "sitemap.xml with 24 URLs, all returning 200",
    },
  ],
  llmsTxtPresent: true,
  schemaMentions: 5,
  blufDensity: 0.85,
  pass: { llmsTxt: true, schema: true, bluf: true },
};

/* ─────────────────────────  Drift Alerts ───────────────────────── */
const demoDriftAlerts: DriftAlert[] = [
  {
    id: "drift-demo-1",
    prompt:
      "What are the best luxury moisturizers for sensitive skin in 2026?",
    provider: "chatgpt",
    oldScore: 62,
    newScore: 81,
    delta: 19,
    createdAt: "2026-02-13T08:00:00.000Z",
    dismissed: false,
  },
  {
    id: "drift-demo-2",
    prompt:
      "Compare the top luxury serums for fine lines and dull skin.",
    provider: "perplexity",
    oldScore: 45,
    newScore: 31,
    delta: -14,
    createdAt: "2026-02-12T16:00:00.000Z",
    dismissed: false,
  },
];

/* ─────────────────────────  Full State ───────────────────────── */
export const DEMO_STATE: AppState = {
  brand: {
    brandName: "Maison Lumière",
    brandAliases: "Maison Lumiere, Lumière",
    websites: ["https://maisonlumiere.com"],
    industry: "Luxury skincare (sample brand)",
    keywords:
      "luxury moisturizer, sensitive skin, anti-aging serum, refillable skincare, skincare gifts",
    description:
      "A fictional luxury skincare house used as sample data: fragrance-free, barrier-friendly formulas in refillable packaging.",
  },
  provider: "chatgpt",
  activeProviders: [
    "chatgpt",
    "perplexity",
    "gemini",
    "google_ai",
  ],
  country: "US",
  prompt:
    "What are the best luxury moisturizers for sensitive skin in 2026?",
  customPrompts: PROMPTS,
  personas:
    "Sensitive-Skin Shopper\nLuxury Gift Buyer\nSkintellectual\nClean-Beauty Fan\nFirst-Time Luxury Buyer",
  fanoutPrompts: [
    "[Sensitive-Skin Shopper] Which luxury moisturizer won't irritate my rosacea-prone skin?",
    "[Luxury Gift Buyer] What is the best luxury skincare gift set under $200?",
    "[Skintellectual] Which luxury serum has the most proven active ingredients?",
    "[Clean-Beauty Fan] Which luxury skincare brands are clean and refillable?",
    "[First-Time Luxury Buyer] Which luxury skincare product is worth buying first?",
  ],
  niche: "luxury skincare for sensitive skin",
  nicheQueries: [
    "best luxury moisturizer for sensitive skin",
    "is luxury skincare worth it",
    "refillable luxury skincare brands",
    "best luxury serum for fine lines",
    "luxury skincare gift sets",
  ],
  cronExpr: "0 */6 * * *",
  githubWorkflow:
    "name: brandsignal-visibility\non:\n  schedule:\n    - cron: '0 */6 * * *'\njobs:\n  track:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run test:scraper",
  competitors: [
    {
      name: "velora.com",
      aliases: ["Velora"],
      websites: ["https://velora.com"],
    },
    {
      name: "dewlab.com",
      aliases: ["Dewlab"],
      websites: ["https://dewlab.com"],
    },
    {
      name: "ateliernoir.com",
      aliases: ["Atelier Noir"],
      websites: ["https://ateliernoir.com"],
    },
  ],
  battlecards: demoBattlecards,
  runs: generateRuns(),
  auditUrl: "https://maisonlumiere.com",
  auditReport: demoAuditReport,
  scheduleEnabled: true,
  scheduleIntervalMs: 21600000,
  lastScheduledRun: "2026-02-14T06:00:00.000Z",
  driftAlerts: demoDriftAlerts,
};
