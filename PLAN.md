# Regulatory Monitor Integration Plan

## Overview
Upgrade the existing "Recent Developments" section into a full Regulatory Monitor with severity scoring, audience-segmented buyer impact analysis, source attribution, and filtering — while preserving the current card-based UX pattern.

## What Changes

### 1. Upgrade NEWS data model
Migrate the 4 existing NEWS entries to the new richer data model. Each entry gains:
- `id` — unique string identifier
- `source` — originating body (e.g., "Treasury / IRS", "Congress")
- `severity` — "high" | "medium" | "low" (market materiality)
- `keyChanges` — array of bulleted facts (replaces the single `what` paragraph)
- `buyerImpact` — object with `enterprise`, `midMarket`, `sellers` keys
- `relatedLinks` — array of `{ label, url }` source references

Fields we keep as-is: `date`, `h` (headline), `cr` (credit tags)
Fields absorbed/replaced: `tag` → derived from `source`, `who` → replaced by `buyerImpact`, `what` → split into `summary` + `keyChanges`, `next` → folded into impact analysis

### 2. Add severity styling constants
Add a `SEVERITY` object alongside the existing `STATUS` and `RISKCOLOR` patterns:
```
high:   { c: "#BF360C", bg: "#FBE9E7", l: "HIGH" }      — red (matches sunsetting)
medium: { c: "#E65100", bg: "#FFF3E0", l: "MEDIUM" }     — orange (matches modified)
low:    { c: "#37474F", bg: "#ECEFF1", l: "LOW" }         — blue-grey (matches active)
```

### 3. Rewrite NewsCard component
The card keeps the same expand/collapse interaction but the expanded view changes:

**Collapsed view (visible always):**
- Date (mono font, grey) — unchanged
- Source badge (new — "Treasury / IRS", etc.)
- Severity badge (new — color-coded pill: HIGH/MEDIUM/LOW)
- Credit type tags — make clickable (navigate to deep dive via `nav` prop)
- Headline — unchanged
- 1-2 sentence summary (new — visible in collapsed state for quick scanning)
- "Read more +" toggle — unchanged

**Expanded view (new layout):**
- **Key Changes** — bulleted list with gold left-border label
- **Buyer Impact** — 3 side-by-side cards:
  - Enterprise (Fortune 500)
  - Mid-Market ($2B–$10B)
  - Sellers (developers/manufacturers)
  - Each card: colored header, impact text paragraph
- **Source Links** — small linked references at the bottom

### 4. Add filter bar to the Home component
Above the news cards list, add a horizontal filter bar with:
- **Severity filter**: "All" | "High" | "Medium" | "Low" — pill-style toggle buttons
- **Credit type filter**: dynamic pills for each unique credit section across all NEWS entries
- **Source filter**: dynamic pills for each unique source

Filter state lives in the Home component. NEWS array is filtered before mapping to NewsCard. Active filters shown with filled background; inactive with outline. "All" resets.

### 5. Pass `nav` to NewsCard
NewsCard currently doesn't receive `nav`, so credit tags aren't clickable. Pass `nav` through so credit tags like "§45X" can navigate to deep dives (only for credits that have `C[key]` entries).

## Files Changed
- `src/App.jsx` — all changes in this single file:
  - NEWS array: upgrade all 4 entries to new data model
  - SEVERITY constant: add near STATUS/RISKCOLOR
  - NewsCard component: rewrite expanded view, add severity/source badges
  - Home component: add filter state + filter bar UI + pass nav to NewsCard

## Design Principles
- Match existing CreditPulse visual language (gold accents, IBM Plex Mono for data, DM Sans body, muted palette)
- Buyer impact cards use a 3-column grid on desktop, stack on narrow sidebar
- Severity badges follow the same size/weight as existing credit status badges
- No new dependencies needed — pure React + inline styles
- Keep the section header "Regulatory Monitor" (upgrade from "Recent Developments")
