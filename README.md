# BrandSignal

**How do AI assistants recommend beauty, fashion and luxury brands?**

BrandSignal asks ChatGPT, Perplexity, Gemini and Google AI Mode real shopping questions
("best luxury moisturizer for sensitive skin?", "is luxury skincare worth it?") and shows:

- which brands get mentioned, and how high up
- which websites the AI cites as proof
- where a brand is missing and competitors win instead
- whether a brand's website is easy for AI to read (free AI-readiness audit)

Built by **Aditi Dora** for consumer-insights, marketing and product work in beauty, fashion and luxury.

## Status

- Live site with **sample data** (a fictional brand, "Maison Lumière"), so nothing in the sample is a claim about a real company.
- Live tracking of real brands turns on when a `BRIGHT_DATA_KEY` is added in Vercel.

## Credit

BrandSignal is built on the open-source [GEO/AEO Tracker](https://github.com/danishashko/geo-aeo-tracker)
by Daniel Shashko (MIT license, see `LICENSE`). The original README is kept in
[`docs/geo-aeo-tracker-README.md`](docs/geo-aeo-tracker-README.md).

My changes: beauty/fashion/luxury focus, new brand and visual design, luxury sample dataset,
and (in progress) a beauty benchmark with real AI answers.

## Run it

Deploys to Vercel with no settings. Locally: `npm install && npm run dev`.
