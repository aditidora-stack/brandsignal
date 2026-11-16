import type { BrandConfig, Competitor, TaggedPrompt } from "@/components/dashboard/types";

/**
 * BrandSignal category packs: one click fills brand settings, competitors and a
 * set of unbranded shopping questions tagged by buyer stage
 * (discover → compare → buy) and by shopper need.
 *
 * Most questions never name a brand, so every brand competes on equal terms.
 * Questions that do name one ("stores like zara…") carry the "branded" tag so
 * results can be split into fair (unbranded) and branded views.
 */
export type CategoryPack = {
  id: string;
  label: string;
  blurb: string;
  brand: BrandConfig;
  competitors: Competitor[];
  prompts: TaggedPrompt[];
};

const c = (name: string, domain: string, aliases: string[] = []): Competitor => ({
  name,
  aliases: [name, ...aliases],
  websites: [`https://${domain}`],
});

export const CATEGORY_PACKS: CategoryPack[] = [
  {
    id: "high-street-fashion",
    label: "High-street fashion",
    blurb: "Zara vs. 18 brands: H&M, Aritzia, Lulus, Princess Polly, Edikted…",
    brand: {
      brandName: "Zara",
      brandAliases: "Zara Woman, Zara Man, Inditex Zara",
      websites: ["https://www.zara.com"],
      industry: "Fashion / high-street apparel",
      keywords:
        "trendy clothes, affordable fashion, work outfits, wardrobe basics, fashion trends",
      description:
        "High-street fashion retailer. Tracked here as the reference brand in a high-street fashion benchmark.",
    },
    competitors: [
      c("H&M", "hm.com", ["H and M", "Hennes & Mauritz"]),
      c("Mango", "mango.com"),
      c("Uniqlo", "uniqlo.com"),
      c("COS", "cos.com", ["COS Stores"]),
      c("Aritzia", "aritzia.com"),
      c("Reformation", "thereformation.com", ["The Reformation"]),
      c("Abercrombie & Fitch", "abercrombie.com", ["Abercrombie", "Abercrombie and Fitch"]),
      c("Urban Outfitters", "urbanoutfitters.com"),
      c("American Eagle", "ae.com", ["American Eagle Outfitters"]),
      c("Free People", "freepeople.com"),
      c("Aerie", "aerie.com"),
      c("For Love & Lemons", "forloveandlemons.com", ["For Love and Lemons"]),
      c("Princess Polly", "princesspolly.com"),
      c("Paloma Wool", "palomawool.com"),
      c("Edikted", "edikted.com"),
      c("Brandy Melville", "brandymelville.com", ["Brandy"]),
      c("Garage", "garageclothing.com", ["Garage Clothing"]),
      c("Lulus", "lulus.com", ["Lulu's"]),
    ],
    prompts: [
      { text: "stores like zara but better quality", tags: ["compare", "branded", "quality"] },
      { text: "is zara fast fashion", tags: ["compare", "branded", "sustainability"] },
      { text: "zara vs h&m vs mango which is better", tags: ["compare", "branded"] },
      { text: "where to buy cute going out tops", tags: ["buy", "going-out"] },
      { text: "stores like princess polly but better quality", tags: ["compare", "branded", "quality"] },
      { text: "best place to buy jeans that actually fit", tags: ["buy", "clothing-type"] },
      { text: "aritzia worth it?", tags: ["compare", "branded", "value"] },
      { text: "where to buy wedding guest dress under 100", tags: ["buy", "event"] },
      { text: "affordable stores that look expensive", tags: ["discover", "value"] },
      { text: "what clothing brands are trending with gen z right now", tags: ["discover", "trend"] },
      { text: "brandy melville alternatives", tags: ["discover", "branded"] },
      { text: "most sustainable cheap clothing brands", tags: ["discover", "sustainability"] },
      { text: "where to buy a cute birthday dress", tags: ["buy", "event"] },
      { text: "21st birthday dress ideas where to buy", tags: ["buy", "event"] },
      { text: "where to buy white graduation dress under 100", tags: ["buy", "event"] },
      { text: "concert outfit ideas where to shop", tags: ["buy", "event"] },
      { text: "vacation outfits affordable stores", tags: ["buy", "event"] },
      { text: "date night outfit where to buy", tags: ["buy", "event"] },
      { text: "what colours are trending in fashion right now", tags: ["discover", "colour", "trend"] },
      { text: "where to buy chocolate brown dress", tags: ["buy", "colour"] },
      { text: "turquoise outfits where to buy", tags: ["buy", "colour"] },
      { text: "where to buy a satin slip dress", tags: ["buy", "clothing-type"] },
      { text: "best corset tops affordable", tags: ["buy", "clothing-type"] },
      { text: "linen pants where to buy", tags: ["buy", "clothing-type"] },
    ],
  },
  {
    id: "luxury-skincare",
    label: "Luxury skincare",
    blurb: "La Mer vs. Augustinus Bader, Sisley, Tatcha and more",
    brand: {
      brandName: "La Mer",
      brandAliases: "Crème de la Mer, Creme de la Mer, Lamer",
      websites: ["https://www.lamer.com"],
      industry: "Luxury skincare",
      keywords:
        "luxury moisturizer, luxury face cream, anti-aging serum, sensitive skin, skincare gift",
      description:
        "Luxury skincare brand known for its signature moisturizing cream. Tracked here as the reference brand in a luxury skincare benchmark.",
    },
    competitors: [
      c("Augustinus Bader", "augustinusbader.com", ["The Rich Cream"]),
      c("Sisley", "sisley-paris.com", ["Sisley Paris"]),
      c("Estée Lauder", "esteelauder.com", ["Estee Lauder"]),
      c("Tatcha", "tatcha.com"),
      c("SK-II", "sk-ii.com", ["SKII"]),
      c("Drunk Elephant", "drunkelephant.com"),
      c("Dior", "dior.com", ["Dior Beauty", "Dior Prestige"]),
    ],
    prompts: [
      { text: "What are the best luxury face moisturizers right now?", tags: ["discover", "moisturizer"] },
      { text: "Which luxury skincare brands are worth the money?", tags: ["discover", "value"] },
      { text: "What is the best luxury moisturizer for sensitive skin?", tags: ["discover", "sensitive-skin"] },
      { text: "What is the best high-end anti-aging serum for fine lines?", tags: ["discover", "anti-aging"] },
      { text: "Is expensive luxury skincare better than dermatologist brands?", tags: ["compare", "value"] },
      { text: "Compare the most popular luxury face creams and who each one is for.", tags: ["compare", "moisturizer"] },
      { text: "Which luxury skincare brand has the best results for dry, mature skin?", tags: ["compare", "anti-aging"] },
      { text: "Which luxury skincare brands use clean or sustainable ingredients and packaging?", tags: ["compare", "sustainability"] },
      { text: "What is the best luxury skincare gift for my mom under $300?", tags: ["buy", "gifting"] },
      { text: "I want to buy my first luxury skincare product. Which one should I start with?", tags: ["buy", "first-purchase"] },
      { text: "Which luxury face cream is the best splurge for glowing skin before a wedding?", tags: ["buy", "occasion"] },
      { text: "Where can I buy luxury skincare online and get samples or a good deal?", tags: ["buy", "retail"] },
    ],
  },
  {
    id: "accessible-luxury-handbags",
    label: "Accessible luxury handbags",
    blurb: "Coach vs. Michael Kors, Kate Spade, Tory Burch, Polène and more",
    brand: {
      brandName: "Coach",
      brandAliases: "Coach New York, Coachtopia",
      websites: ["https://www.coach.com"],
      industry: "Fashion / accessible luxury handbags",
      keywords:
        "designer handbag, work tote, leather crossbody bag, first designer bag, handbag gift",
      description:
        "American leather goods brand. Tracked here as the reference brand in an accessible-luxury handbag benchmark.",
    },
    competitors: [
      c("Michael Kors", "michaelkors.com", ["MK"]),
      c("Kate Spade", "katespade.com", ["Kate Spade New York"]),
      c("Tory Burch", "toryburch.com"),
      c("Longchamp", "longchamp.com", ["Le Pliage"]),
      c("Polène", "polene-paris.com", ["Polene"]),
      c("Mulberry", "mulberry.com"),
      c("Marc Jacobs", "marcjacobs.com", ["The Tote Bag"]),
    ],
    prompts: [
      { text: "What are the best designer handbag brands under $500?", tags: ["discover", "price"] },
      { text: "What is a good first designer bag to buy?", tags: ["discover", "first-purchase"] },
      { text: "Which handbag brands are considered good quality for the price?", tags: ["discover", "quality"] },
      { text: "What is the best leather tote bag for work that fits a laptop?", tags: ["discover", "work"] },
      { text: "Compare the most popular mid-range designer handbag brands for quality and style.", tags: ["compare", "quality"] },
      { text: "Which mid-range handbag brands hold their value or look the most expensive?", tags: ["compare", "value"] },
      { text: "Which affordable luxury bag brands are trending right now?", tags: ["compare", "trend"] },
      { text: "Which handbag brands use sustainable or recycled leather?", tags: ["compare", "sustainability"] },
      { text: "What is the best designer handbag gift for my girlfriend under $400?", tags: ["buy", "gifting"] },
      { text: "Which crossbody bag brand should I buy for everyday use and travel?", tags: ["buy", "everyday"] },
      { text: "I want a minimalist quiet-luxury bag that isn't too expensive. What should I buy?", tags: ["buy", "trend"] },
      { text: "Where can I buy designer handbags on sale or at outlet prices safely?", tags: ["buy", "retail"] },
    ],
  },
  {
    id: "prestige-makeup",
    label: "Prestige makeup",
    blurb: "Rare Beauty vs. Fenty, Charlotte Tilbury, Glossier, Rhode and more",
    brand: {
      brandName: "Rare Beauty",
      brandAliases: "Rare Beauty by Selena Gomez",
      websites: ["https://www.rarebeauty.com"],
      industry: "Prestige makeup",
      keywords: "liquid blush, foundation, lip product, makeup gift, everyday makeup",
      description:
        "Prestige makeup brand known for its liquid blush. Tracked here as the reference brand in a prestige makeup benchmark.",
    },
    competitors: [
      c("Fenty Beauty", "fentybeauty.com", ["Fenty"]),
      c("Charlotte Tilbury", "charlottetilbury.com"),
      c("Glossier", "glossier.com"),
      c("Rhode", "rhodeskin.com", ["rhode"]),
      c("Huda Beauty", "hudabeauty.com"),
      c("MAC", "maccosmetics.com", ["MAC Cosmetics", "M·A·C"]),
      c("NARS", "narscosmetics.com"),
    ],
    prompts: [
      { text: "What are the best makeup brands right now for everyday natural makeup?", tags: ["discover", "everyday"] },
      { text: "What is the best liquid blush?", tags: ["discover", "blush"] },
      { text: "What is the best foundation for a natural, skin-like finish?", tags: ["discover", "foundation"] },
      { text: "Which makeup brands have the best shade range for all skin tones?", tags: ["discover", "inclusivity"] },
      { text: "Which celebrity makeup brands are actually worth buying?", tags: ["compare", "value"] },
      { text: "Compare the most popular prestige lip products and who each one is for.", tags: ["compare", "lip"] },
      { text: "Which makeup brands are best for sensitive skin?", tags: ["compare", "sensitive-skin"] },
      { text: "Which makeup brands are cruelty-free and clean?", tags: ["compare", "sustainability"] },
      { text: "What is the best makeup gift set for a teenager or college student?", tags: ["buy", "gifting"] },
      { text: "I'm new to makeup. Which products should I buy first?", tags: ["buy", "first-purchase"] },
      { text: "What makeup should I buy for my wedding day that lasts all day?", tags: ["buy", "occasion"] },
      { text: "Where is the best place to buy prestige makeup online with good rewards?", tags: ["buy", "retail"] },
    ],
  },
];
