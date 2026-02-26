import { useState, useRef, useEffect } from "react";

/*
  CREDITPULSE — Redesign Prototype (Phase 2)
  Design Direction: Bloomberg authority × Stripe clarity × McKinsey confidence
  
  This prototype demonstrates:
  1. New design system (typography, color, spacing, components)
  2. Restructured Market Overview (home screen)
  3. Tabbed Deep Dive (replaces accordion dumps)
  4. Visual risk, pricing, and timeline components
  5. Progressive disclosure patterns
*/

// ═══════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════

// Color System — light, warm-neutral palette
const COLOR = {
  // Surfaces
  bg: "#FAFAF8",
  bgSubtle: "#F9F8F5",
  card: "#FFFFFF",
  cardHover: "#FAFAF8",
  cardElevated: "#FFFFFF",

  // Borders
  border: "#e8e6e1",
  borderSubtle: "#f0ede8",
  borderHover: "#d5d0c8",

  // Text
  text: "#1a1a1a",
  textSecondary: "#5a5650",
  textTertiary: "#9a958e",
  textMuted: "#b5b0a8",

  // Accent
  gold: "#D4872C",
  goldDim: "#B8741F",
  goldBg: "rgba(212,135,44,0.06)",
  goldBorder: "rgba(212,135,44,0.18)",

  // Status
  green: "#047857",
  greenBg: "#ECFDF5",
  greenBorder: "rgba(4,120,87,0.20)",
  amber: "#D97706",
  amberBg: "#FFF7ED",
  amberBorder: "rgba(217,119,6,0.20)",
  red: "#DC2626",
  redBg: "rgba(220,38,38,0.06)",
  redBorder: "rgba(220,38,38,0.18)",
  blue: "#2563EB",
  blueBg: "rgba(37,99,235,0.06)",

  // Sunsetting tag
  sunsetBg: "#FFF7ED",
  sunsetText: "#C2410C",
  // Active/positive tag
  activeBg: "#ECFDF5",
  activeText: "#047857",

  // Interactive
  hover: "rgba(0,0,0,0.02)",
  active: "rgba(0,0,0,0.04)",
};

// Typography
const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'DM Sans', -apple-system, sans-serif",
};

// Spacing scale
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

// ═══════════════════════════════════════════════════════════
// DATA (real, from current App.jsx)
// ═══════════════════════════════════════════════════════════

const LAST_UPDATED = "February 2026";

const STATUS_MAP = {
  expanded: { color: COLOR.activeText, bg: COLOR.activeBg, border: COLOR.greenBorder, label: "EXPANDED" },
  active: { color: COLOR.textSecondary, bg: COLOR.active, border: COLOR.borderHover, label: "ACTIVE" },
  modified: { color: COLOR.amber, bg: COLOR.amberBg, border: COLOR.amberBorder, label: "MODIFIED" },
  sunsetting: { color: COLOR.sunsetText, bg: COLOR.sunsetBg, border: "rgba(194,65,12,0.20)", label: "SUNSETTING" },
};

const RISK_MAP = {
  Low: { color: COLOR.green, level: 1, label: "LOW" },
  Moderate: { color: COLOR.amber, level: 2, label: "MODERATE" },
  Elevated: { color: COLOR.red, level: 3, label: "ELEVATED" },
};

// ═══════════════════════════════════════════════════════════
// PERSONA SEGMENTATION
// ═══════════════════════════════════════════════════════════

const PERSONAS = {
  buyer: {
    label: "Buyer",
    shortLabel: "Buyer",
    headerLabel: "Buyer",
    desc: "Corporations, tax departments, CFOs",
    question: "I'm looking to purchase tax credits to reduce my federal tax liability",
  },
  "seller-developer": {
    label: "Seller — Project Developer",
    shortLabel: "Seller — Developer",
    headerLabel: "Developer",
    desc: "Solar, wind, biogas, SAF, renewable energy developers",
    question: "I generate credits through clean energy projects and want to monetize them",
  },
  "seller-manufacturer": {
    label: "Seller — Manufacturer",
    shortLabel: "Seller — Manufacturer",
    headerLabel: "Manufacturer",
    desc: "45X production credits, battery, solar component, critical mineral producers",
    question: "I earn credits through domestic clean energy manufacturing",
  },
  advisor: {
    label: "Advisor / Intermediary",
    shortLabel: "Advisor",
    headerLabel: "Advisor",
    desc: "Tax equity firms, brokers, law firms, CPAs, consultants",
    question: "I help clients navigate tax credit transactions",
  },
};

const FEOC_CTA_TEXT = {
  buyer: {
    title: "Check FEOC compliance before you buy",
    desc: "Foreign entity rules can disqualify credits entirely. Verify before you transact.",
  },
  "seller-developer": {
    title: "Prove your project credits are FEOC-compliant",
    desc: "Buyers are requiring supply chain verification. Demonstrate compliance to protect your project\u2019s credit value.",
  },
  "seller-manufacturer": {
    title: "Check your supply chain against FEOC thresholds",
    desc: "MACR thresholds are tightening annually. Verify your component supply chain now.",
  },
  advisor: {
    title: "FEOC compliance decision tree",
    desc: "Walk your clients through foreign entity restrictions. Step-by-step guidance for each credit.",
  },
};

const BRIDGE_CTA = {
  buyer: {
    pretext: "Ready to reduce your tax bill?",
    cta: "See how much you could save",
    secondaryCta: "Talk to a marketplace specialist",
    desc: "Explore credits on Crux \u2014 compare pricing, connect with verified sellers, and reduce your federal tax liability.",
  },
  "seller-developer": {
    pretext: "Ready to monetize your credits?",
    cta: "List your credits",
    secondaryCta: "Get a valuation",
    desc: "Reach qualified corporate buyers, set your price, and close faster on the Crux marketplace.",
  },
  "seller-manufacturer": {
    pretext: "Ready to sell your production credits?",
    cta: "List your credits",
    secondaryCta: "Understand your credit value",
    desc: "Connect directly with corporate buyers for your \u00A745X manufacturing credits on the Crux marketplace.",
  },
  advisor: {
    pretext: "Need deal-ready intelligence for your clients?",
    cta: "Request partnership information",
    secondaryCta: "Access full market report",
    desc: "Access real-time pricing, compliance data, and transaction support through the Crux platform.",
  },
  generic: {
    pretext: "CreditPulse is powered by Crux Climate data.",
    cta: "Learn about the Crux platform",
    desc: "The marketplace where clean energy tax credits are bought and sold.",
  },
};

const STAT_ORDER = {
  buyer:                [0, 2, 1],  // Pricing, Timeline, Mkt Share
  "seller-developer":   [1, 0, 2],  // Mkt Share, Pricing, Timeline
  "seller-manufacturer": [0, 1, 2], // Pricing, Mkt Share, Timeline
  advisor:              [2, 0, 1],  // Timeline, Pricing, Mkt Share
};

// ═══════════════════════════════════════════════════════════
// LAYER 1 — "THE ANSWER" (hero data per persona)
// Replaces PERSONA_EDITORIAL + PERSONA_BRIEFING with a single
// opinionated block answering each persona's #1 question.
// ═══════════════════════════════════════════════════════════

const PERSONA_HERO = {
  buyer: {
    personaLabel: "BUYER MARKET SNAPSHOT",
    headline: "TTC pricing at 12-month lows \u2014 your savings window is open",
    body: "Transfer credits are at their cheapest in a year as OBBBA thinned the buyer pool \u2014 but a 2026 rebound is forecast.",
    statCards: [
      { creditLabel: "\u00A745X MANUFACTURING", price: "93\u201396\u00A2", subtitle: "per dollar \u00B7 IG pricing", tag: "\u2193 4\u20137% discount to par", tagColor: "green" },
      { creditLabel: "\u00A748E CLEAN ELECTRICITY", price: "~89\u00A2", subtitle: "per dollar \u00B7 tech-neutral ITC", tag: "SUNSETTING \u00B7 deadline Jul 4", tagColor: "orange" },
    ],
  },
  "seller-developer": {
    personaLabel: "DEVELOPER MARKET SNAPSHOT",
    headline: "Your credits are in demand \u2014 here\u2019s what buyers are paying",
    body: "The transfer market grew 48% YoY to ~$42B, and the Jul 4, 2026 construction deadline is reshaping which credits reach market.",
    statCards: [
      { creditLabel: "\u00A748E CLEAN ELECTRICITY", price: "~89\u00A2", subtitle: "per dollar \u00B7 tech-neutral ITC", tag: "SUNSETTING \u00B7 deadline Jul 4", tagColor: "orange" },
      { creditLabel: "\u00A745Z CLEAN FUEL", price: "Varies", subtitle: "CI-based \u00B7 new market", tag: "48% YoY market growth", tagColor: "green" },
    ],
  },
  "seller-manufacturer": {
    personaLabel: "MANUFACTURER MARKET SNAPSHOT",
    headline: "\u00A745X is the most actively traded credit \u2014 your monetization window",
    body: "Manufacturing production credits command top-of-market pricing at 93\u201396\u00A2, with 30% of listings receiving bids on day one.",
    statCards: [
      { creditLabel: "\u00A745X MANUFACTURING", price: "93\u201396\u00A2", subtitle: "per dollar (IG) \u00B7 top of market", tag: "30% of listings get bids day one", tagColor: "green" },
      { creditLabel: "MARKET SHARE", price: "27%", subtitle: "of transfer market volume", tag: "Most actively traded PTC", tagColor: "green" },
    ],
  },
  advisor: {
    personaLabel: "ADVISOR MARKET SNAPSHOT",
    headline: "Market at $63B and 12-month pricing lows \u2014 significant inventory in play",
    body: "Total tax credit monetization reached $63B in 2025 (+27% YoY). Transfer market ~$42B (+48%), with $8\u201310B in unsold 2025-vintage credits still available.",
    statCards: [
      { creditLabel: "\u00A745X MANUFACTURING", price: "93\u201396\u00A2", subtitle: "per dollar \u00B7 IG PTC", tag: "\u2193 4\u20137% discount to par", tagColor: "green" },
      { creditLabel: "\u00A748E CLEAN ELECTRICITY", price: "~89\u00A2", subtitle: "per dollar \u00B7 tech-neutral ITC", tag: "SUNSETTING \u00B7 deadline Jul 4", tagColor: "orange" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// LAYER 2 — "YOUR NEXT MOVE" (curated credit cards per persona)
// ═══════════════════════════════════════════════════════════

const PERSONA_NEXT_MOVE = {
  buyer: { credits: ["45X", "48E"], layout: "grid-2" },
  "seller-developer": { credits: ["48E", "45Z", "45Q"], layout: "grid-3" },
  "seller-manufacturer": { credits: ["45X"], extraCards: ["48C"], layout: "featured" },
  advisor: { credits: ["48E", "45X", "45Z", "45Q"], showOther: true, showTerminated: true, layout: "grid-full" },
};

const CREDITS = {
  "45X": {
    sec: "§45X", name: "Advanced Manufacturing Production", type: "PTC",
    status: "modified",
    tagline: "Per-unit payment to U.S. clean energy manufacturers",
    personaTaglines: {
      buyer: "Most actively traded credit \u2014 30% of listings get bids on day one.",
      "seller-developer": "Strong buyer demand if you\u2019re transferring credits from project partnerships.",
      "seller-manufacturer": "This is your core credit. 27% of the transfer market, fastest execution.",
      advisor: "Supply chain compliance (FEOC) is the dominant diligence issue.",
    },
    pricing: "93.5\u201396\u00A2", pricingCtx: "per $1",
    pricingDetail: {
      type: "ig_split",
      ig: { low: 93, high: 96, label: "93\u201396\u00A2" },
      nonIg: { low: 90, high: 93, label: "90\u201393\u00A2" },
      spread: "~3\u00A2",
      source: "Crux 2025 market data",
      note: "Most actively traded credit. 30% of listings get bids on day one."
    },
    share: "27%", shareCtx: "of transfer market",
    timeline: "8\u201316 wks", timelineCtx: "listing \u2192 close",
    risk: "Low",
    keyDate: "12/31/2029", keyDateLabel: "Full credit expires",
    nextDate: { date: "Late 2026", label: "Final FEOC rules expected", urgent: false },
    obbbaWinners: "Core credit preserved. Metallurgical coal added.",
    obbbaLosers: "Wind components cut after 2027. New FEOC rules.",
    sum: "If you make solar panels, batteries, inverters, or mine critical minerals in the U.S., this credit pays you a fixed dollar amount for each unit you produce and sell. It's the single most-traded credit in the market.",
    howItWorks: {
      eligible: [
        "Solar components — wafers, cells, modules, polysilicon",
        "Battery components — electrode materials, cells, modules, packs",
        "Inverters — residential through utility-scale",
        "Critical minerals — lithium, nickel, cobalt processed in U.S.",
        "Wind components — blades, nacelles, towers (through 2027 only)",
        "Metallurgical coal (newly added, through 2029)"
      ],
      valueTable: [
        ["Solar modules", "$0.07/W(dc)"], ["Solar cells", "$0.04/W(dc)"],
        ["PV wafers", "$12/m²"], ["Polysilicon", "$3/kg"],
        ["Battery cells", "$35/kWh"], ["Battery modules", "$10/kWh"],
        ["Critical minerals", "10% of costs"], ["Inverters", "$0.02–$0.11/W(ac)"],
      ],
      transfer: "One-time transfer under §6418. Straightforward — not tied to project performance.",
      duration: "Full value 2023–2029, then phasedown: 75% → 50% → 25% → 0 by 2033.",
    },
    risks: {
      summary: "No recapture risk (rare). Primary exposure is FEOC supply chain compliance. Buyers face minimal counterparty risk — credits tied to verified production.",
      underwriting: [
        { text: "FEOC supply chain — materials tracing to China/Russia/DPRK/Iran beyond thresholds disqualify the entire credit.", severity: "high" },
        { text: "Unit counting & classification — IRS can challenge whether your product qualifies.", severity: "medium" }
      ],
      mitigable: [
        { text: "Detailed production logs and supply chain records from day one.", action: "Documentation" },
        { text: "Third-party supply chain mapping — independent verification reduces buyer discount.", action: "Verification" }
      ],
      uncertain: [
        "Will the government actually crack down on companies with complex overseas supply chains, or just the obvious ones?",
        "Could the current safe harbors get stricter when final rules come out — disqualifying supply chains that pass today?"
      ]
    },
    guidance: {
      status: "Detailed rules finalized Nov 2024. Interim FEOC guidance Feb 2026. Final FEOC pending.",
      open: [
        "How aggressively will the government enforce supply chain rules?",
        "Will newer types of clean energy products qualify for this credit?",
        "How much homework do buyers need to do on a manufacturer's supply chain before purchasing credits?"
      ]
    },
    feoc: "PFE/SFE & FIE prohibitions: effective for taxable years beginning after July 4, 2025 (Jan 1, 2026 for calendar-year). Material assistance (MACR): effective Jan 1, 2026. MACR thresholds by component (year sold): Solar 50% (2026) to 85% (2030+); Wind 85%/90% then N/A (terminated after 2027); Inverters 50% to 70%; Battery 60% to 85%; Critical minerals 0% through 2029, then 25% (2030), 30% (2031), 40% (2032), 50%+ (after). Notice 2026-15 provides Tier 1 supplier certification framework.",
    dates: [
      { d: "12/31/2027", e: "Wind component credits end", urgent: true },
      { d: "12/31/2029", e: "Full credit expires for most components" },
      { d: "2030–2032", e: "Phasedown: 75% → 50% → 25%" },
      { d: "After 2032", e: "Credit ends entirely" }
    ],
    bl: [
      "Most actively traded credit — strong demand, fast execution, clear economics.",
      "Valuable for solar, battery, inverter, and critical mineral manufacturers through 2029.",
      "Foreign supply chain rules are the #1 diligence issue.",
      "Wind components face earlier deadline — credits end after 2027.",
      "Both transferable and eligible for direct government payment."
    ],
    mkt: {
      share: "Most actively traded PTC. IG PTC sellers (wind, §45U, §45X) averaged ~94¢ in 2H2025 (down from 95¢ in 1H). Non-IG: ~93¢ (down from 94¢).",
      price: "IG: ~94¢. Non-IG: ~93¢. Crux forecasts §45X among strongest pricing recovery in 2026, driven by buyer competition for finite credit pool. Wind components terminated after 2027 under OBBBA."
    },
    stats: [
      { label: "Pricing", value: "IG PTC: ~94¢ | Non-IG: ~93¢" },
      { label: "OBBBA", value: "Wind terminated after 2027" }
    ]
  },
  "48E": {
    sec: "§48E", name: "Clean Electricity Investment", type: "ITC",
    status: "sunsetting",
    tagline: "Up to 30%+ of clean power & storage project costs",
    personaTaglines: {
      buyer: "Largest credit segment \u2014 $42B transfer market. Trading at a discount to legacy credits.",
      "seller-developer": "Energy storage nearly tripled market share. Wind/solar deadline is July 4, 2026.",
      "seller-manufacturer": "ITC credits from projects using your manufactured components. Drives demand for your \u00A745X credits.",
      advisor: "Recapture risk, PWA compliance, and FEOC are the three key advisory issues.",
    },
    pricing: "~89\u00A2", pricingCtx: "per $1",
    pricingDetail: {
      type: "ig_split",
      ig: { low: 90, high: 93, label: "90–93¢" },
      nonIg: { low: 86, high: 89, label: "86–89¢" },
      spread: "~3–4¢",
      source: "Crux Q3 2025 pricing update",
      note: "ITC pricing fell post-OBBBA as buyer tax capacity thinned. IG sellers maintained a consistent premium."
    },
    share: "26%", shareCtx: "of credits sold (H1 '25)",
    timeline: "8–14 wks", timelineCtx: "listing → close",
    risk: "Moderate",
    keyDate: "7/4/2026", keyDateLabel: "Wind/solar construction deadline",
    nextDate: { date: "Jul 4, 2026", label: "Begin construction for wind/solar", urgent: true },
    obbbaWinners: "Energy storage preserved through 2034. Fuel cells get better terms.",
    obbbaLosers: "Wind/solar dead unless construction starts by Jul 4, 2026.",
    sum: "Covers 30%+ of the cost of building clean power plants and energy storage. Technology-neutral — any zero-emission source qualifies.",
    howItWorks: {
      eligible: [
        "New zero-emission power plants (any qualifying technology)",
        "Energy storage systems (standalone battery storage preserved)",
        "Grid-enhancing equipment tied to eligible projects",
        "Fuel cell systems (expanded — 30% regardless of emissions)"
      ],
      valueTable: [
        ["Base rate", "6% of investment"],
        ["With PWA", "30% of investment"],
        ["+ Domestic content", "Up to +10%"],
        ["+ Energy community", "Up to +10%"],
        ["+ Low-income", "+10% or +20% (under 5 MW)"],
        ["Maximum possible", "~70% of investment"]
      ],
      transfer: "One-time transfer. OBBBA restricts transfers to foreign-linked entities.",
      duration: "Claimed once at project start. 5-year recapture period (decreasing 20%/year)."
    },
    risks: {
      summary: "Recapture is the headline risk — well-understood and insurable. Bigger concern: developer compliance paperwork (PWA, domestic content, FEOC) must be airtight.",
      underwriting: [
        { text: "Recapture — IRS claws back if project sold or stops qualifying within 5 years.", severity: "high" },
        { text: "Basis risk — inflated or misallocated costs reduce the credit.", severity: "medium" }
      ],
      mitigable: [
        { text: "Recapture insurance — standard in deals above $10M.", action: "Insurance" },
        { text: "Independent cost appraisal before closing.", action: "Verification" },
        { text: "Verify developer's PWA records before transacting.", action: "Documentation" }
      ],
      uncertain: [
        "If you started building before the deadline, does that protect you from all the new rules — or just some of them?",
        "If a project combines solar, storage, and other equipment at one site, how does the government calculate the credit?",
        "Can you meet the 'buy American' rules and the foreign entity rules at the same time, or do they conflict?"
      ]
    },
    guidance: {
      status: "Core rules finalized Jan 2025. Low-income bonus active. FEOC interim guidance Feb 2026.",
      open: [
        "How are combination projects (solar + storage at one site) valued?",
        "Do the 'buy American' and foreign entity rules conflict with each other?",
        "Do the construction-start safe harbors protect you from all rule changes, or just some?"
      ]
    },
    feoc: "PFE/SFE & FIE prohibitions: effective for taxable years beginning after July 4, 2025 (Jan 1, 2026 for calendar-year taxpayers). Material assistance (MACR): effective Jan 1, 2026. MACR thresholds: Qualified facilities 40% (2026) rising to 60% (2030+); Energy storage 55% (2026) rising to 75% (2030+). Notice 2026-15 (Feb 2026): first MACR calculation guidance — domestic content safe harbor tables are exclusive and exhaustive for solar, wind, battery. 90%+ of developers already initiated supply chain mapping. 80% report no SFE/FIE exposure.",
    dates: [
      { d: "7/4/2026", e: "Deadline to start construction for wind/solar", urgent: true },
      { d: "12/31/2027", e: "Wind/solar must be operational" },
      { d: "12/31/2033", e: "Other clean tech begins phasing down" },
      { d: "12/31/2035", e: "Credit ends for remaining technologies" }
    ],
    bl: [
      "The go-to credit for new clean power and storage — worth 30%+ of investment.",
      "Critical split: wind/solar must start by Jul 4, 2026. Storage has years more runway.",
      "Energy storage is the growth story — market share nearly tripled in a year.",
      "Fuel cells got better OBBBA terms — 30% with fewer strings.",
      "Buyers: focus on recapture protection and developer PWA compliance."
    ],
    mkt: {
      share: "Largest credit segment. Transfer market reached ~$42B in 2025. Tech-neutral §48E entering market but trading at $0.01–0.02 discount to legacy §48 credits. ~25% of Fortune 1000 now active as tax credit buyers.",
      price: "IG ITC: 93.1¢ in 2H2025 (down from 94.0¢ in 1H). Non-IG ITC: 90.1¢ (down from 91.0¢). IG PTC: 94.0¢ (down from 95.0¢). Only ~10% of TE investors actively pursuing tech-neutral credits. Crux forecasts solar ITC pricing rebound in 2026."
    },
    stats: [
      { label: "Market size", value: "$63B total monetization" },
      { label: "Pricing", value: "IG ITC: 93.1¢ | Non-IG: 90.1¢" },
      { label: "Pipeline", value: "170 GW safe-harbored" }
    ]
  },
  "45Z": {
    sec: "§45Z", name: "Clean Fuel Production", type: "PTC",
    status: "expanded",
    tagline: "The only credit OBBBA expanded \u2014 pays per gallon by cleanliness",
    personaTaglines: {
      buyer: "New to the transfer market \u2014 trading at a discount as the market develops.",
      "seller-developer": "Extended through 2029. Corn ethanol and soy biodiesel benefit from ILUC exclusion.",
      "seller-manufacturer": "Production credit for clean fuels. Rules still in proposed form \u2014 CI scoring determines credit value.",
      advisor: "Carbon intensity scoring is still in proposed form \u2014 final rules will shift credit values.",
    },
    pricing: "Discount", pricingCtx: "to established credits",
    pricingDetail: {
      type: "early_stage",
      label: "Early-stage market",
      note: "§45Z credits began transacting in 2025. Pricing is at a modest discount to established PTC categories as the market develops. Carbon intensity scoring methodology is still in proposed form — final rules will significantly affect credit values. First-time producers face more buyer skepticism than established players.",
      source: "Crux market observations"
    },
    share: "Growing", shareCtx: "early-stage market",
    timeline: "12–20 wks", timelineCtx: "first-time producers",
    risk: "Elevated",
    keyDate: "12/31/2029", keyDateLabel: "Credit expires",
    nextDate: { date: "May 28, 2026", label: "Public hearing on proposed rules", urgent: false },
    obbbaWinners: "Extended through 2029. ILUC exclusion benefits corn ethanol & soy biodiesel.",
    obbbaLosers: "SAF premium cut from $1.75 to $1.00/gal after 2025.",
    sum: "Pays fuel producers based on how clean their fuel is. Replaced older biofuel incentives with one unified, performance-based framework.",
    howItWorks: {
      eligible: [
        "Sustainable aviation fuel (SAF)",
        "Clean transportation fuels — highway, rail, off-road",
        "Lifecycle emissions below 50 kg CO₂e/mmBTU",
        "Produced in U.S. and sold to unrelated buyer"
      ],
      valueTable: [
        ["Non-SAF fuel (with PWA)", "Up to $1.00/gal"],
        ["Non-SAF fuel (without PWA)", "Up to $0.20/gal"],
        ["SAF (after 12/31/2025)", "$1.00/gal max"],
        ["Scaling", "Cleaner fuel = higher % of max"]
      ],
      transfer: "One-time transfer based on verified production volumes.",
      duration: "Jan 1, 2025 through Dec 31, 2029. No phasedown — credit simply ends."
    },
    risks: {
      summary: "No recapture risk. Dominant risk: getting the carbon math wrong. Credit is uniquely sensitive to emissions modeling. Rules still being written.",
      underwriting: [
        { text: "Carbon intensity scoring — IRS challenge to methodology could reduce credit to zero.", severity: "high" },
        { text: "Regulatory uncertainty — rules still in proposed form.", severity: "high" }
      ],
      mitigable: [
        { text: "Use the designated 45ZCF-GREET tool and document every input.", action: "Methodology" },
        { text: "Third-party CI score review before marketing credits.", action: "Verification" },
        { text: "Use published pathway data for established fuel types.", action: "Documentation" }
      ],
      uncertain: [
        "Will the government require independent auditors to verify your fuel's carbon score — and if so, what will that cost?",
        "How do you calculate emissions for newer fuel types that aren't in the official modeling tool yet?",
        "How will USDA crop data factor into the carbon math — and could it change which fuels qualify?"
      ]
    },
    guidance: {
      status: "45ZCF-GREET designated early 2025. Proposed regs Feb 2026. Public hearing May 28, 2026.",
      open: [
        "How do you score emissions for newer fuels not yet in the official tool?",
        "What kind of third-party verification will be required?",
        "Can you sell credits through a middleman, or only directly?",
        "How will USDA farming data affect which fuels qualify?"
      ]
    },
    feoc: "PFE/SFE prohibition: effective for taxable years beginning after July 4, 2025 (Jan 1, 2026 for calendar-year). FIE prohibition: later phase-in — effective for taxable years beginning after July 4, 2027 (Jan 1, 2028 for calendar-year). No MACR/material assistance test for §45Z.",
    dates: [
      { d: "1/1/2025", e: "Credit begins" },
      { d: "12/31/2025", e: "SAF premium expires; technical changes take effect" },
      { d: "5/28/2026", e: "Public hearing on proposed regulations" },
      { d: "12/31/2029", e: "Credit expires", urgent: true }
    ],
    bl: [
      "The only credit OBBBA extended — significant political signal.",
      "Performance-based: credit value depends on fuel cleanliness.",
      "SAF rate cut, but eligibility broadened. Corn ethanol/soy biodiesel win.",
      "Early-stage market but high interest. Structures evolving quickly.",
      "5-year window (2025–2029). Ramp-up timing matters."
    ],
    mkt: {
      share: "New entrant to transfer market in 2H2025. Transacted in larger volumes in the second half of the year as the market gained familiarity with the credit type.",
      price: "85¢–93¢ per dollar — materially below other PTC categories. Consistent with Crux's pattern: new credit types trade at a discount until market familiarity grows. Extended to 12/31/2029 under OBBBA (was 12/31/2027)."
    },
    stats: [
      { label: "Pricing", value: "85¢–93¢ (below other PTCs)" },
      { label: "Duration", value: "Extended to 12/31/2029" }
    ]
  },
  "45Q": {
    sec: "§45Q", name: "Carbon Dioxide Sequestration", type: "PTC",
    status: "expanded",
    tagline: "Per-ton payment for capturing and permanently storing CO\u2082",
    personaTaglines: {
      buyer: "Larger discount than power-sector credits \u2014 reflects technology risk and 12-year commitment.",
      "seller-developer": "Up to $180/ton for DAC. OBBBA left \u00A745Q intact \u2014 strong political durability signal.",
      "seller-manufacturer": "Not directly a manufacturing credit, but CCS equipment manufacturers benefit from project demand.",
      advisor: "MRV compliance is the dominant diligence issue. IRS safe harbor available for 2025 reporting.",
    },
    pricing: "85\u201390\u00A2", pricingCtx: "per $1 (larger discount)",
    pricingDetail: {
      type: "range_only",
      low: 85, high: 90, label: "85–90¢",
      note: "Larger discount than power-sector credits due to technology risk, regulatory complexity, and long-dated MRV commitments. Buyers apply larger discounts to reflect the 12-year operational commitment and evolving measurement standards.",
      source: "Crux market observations"
    },
    share: "Growing", shareCtx: "scaling with CCS/DAC",
    timeline: "12–20 wks", timelineCtx: "complex diligence",
    risk: "Elevated",
    keyDate: "1/1/2033", keyDateLabel: "Construction start deadline",
    nextDate: { date: "2026", label: "Treasury MRV regulation revisions expected", urgent: false },
    obbbaWinners: "Left intact — strong signal for carbon capture durability.",
    obbbaLosers: "Stricter reporting expectations. MRV framework still evolving.",
    sum: "Pays facilities per metric ton of CO₂ captured and permanently stored or used. The government's primary tool for incentivizing carbon capture and direct air capture.",
    howItWorks: {
      eligible: [
        "Carbon capture from industrial facilities",
        "Direct air capture (DAC) facilities",
        "Secure geological storage",
        "Enhanced oil recovery with verified storage",
        "Qualifying CO₂ utilization"
      ],
      valueTable: [
        ["Geological storage (with PWA)", "$85/ton"],
        ["Geological storage (no PWA)", "$17/ton"],
        ["DAC + storage (with PWA)", "$180/ton"],
        ["DAC + storage (no PWA)", "$36/ton"],
        ["EOR/utilization (with PWA)", "$60/ton"],
        ["EOR/utilization (no PWA)", "$12/ton"]
      ],
      transfer: "Transferable under §6418. Both tax-equity partnerships and direct transfers used.",
      duration: "12 years from placed-in-service date. Credits claimed annually on verified volumes."
    },
    risks: {
      summary: "No recapture in traditional sense, but credits depend on ongoing verified storage — a long-dated operational commitment. MRV is the dominant diligence issue.",
      underwriting: [
        { text: "Storage integrity — CO₂ must stay underground permanently. Leakage triggers credit loss.", severity: "high" },
        { text: "MRV compliance — stringent measurement/reporting/verification requirements still evolving.", severity: "high" }
      ],
      mitigable: [
        { text: "Notice 2026-01 safe harbor for backup reporting during EPA transitions.", action: "Safe Harbor" },
        { text: "Structured indemnities and insurance for long-term storage liability.", action: "Insurance" },
        { text: "Third-party MRV verification of injection and storage.", action: "Verification" }
      ],
      uncertain: [
        "What exactly will the government require to prove your CO₂ is staying underground — and how often do you have to prove it?",
        "If CO₂ leaks 20 years from now, who's responsible — the company that stored it, or someone else?",
        "If the EPA's reporting system goes down again, will the IRS still honor your credits?"
      ]
    },
    guidance: {
      status: "Existing regs in place. Notice 2026-01 safe harbor for 2025. Treasury preparing revisions.",
      open: [
        "What will the final measurement and verification rules look like?",
        "Who's on the hook if stored CO₂ leaks decades from now?",
        "Will foreign entity rules eventually apply to carbon capture projects?",
        "Will the government issue more backup plans if reporting systems fail again?"
      ]
    },
    feoc: "PFE/SFE & FIE prohibitions: all effective for taxable years beginning after July 4, 2025 (Jan 1, 2026 for calendar-year). No MACR/material assistance test for §45Q. No changes under OBBBA.",
    dates: [
      { d: "1/1/2023", e: "Enhanced IRA rates took effect" },
      { d: "1/1/2033", e: "Construction must begin for enhanced rates", urgent: true },
      { d: "2025–2044", e: "12-year credit windows for qualifying projects" },
      { d: "Feb 2026", e: "Notice 2026-01 safe harbor issued" }
    ],
    bl: [
      "Up to $180/ton for DAC with secure storage — substantial value but demands robust MRV.",
      "12-year credit window provides long-term revenue certainty.",
      "Transferability opens to broader buyers, but perceived risk keeps discounts higher.",
      "New IRS safe harbor signals government commitment.",
      "OBBBA left §45Q intact while cutting other credits — strong political durability signal."
    ],
    mkt: {
      share: "Active but smaller segment. All FEOC restrictions (PFE/SFE/FIE) effective for taxable years beginning after July 4, 2025 (Jan 1, 2026 for calendar-year taxpayers).",
      price: "No change from IRA under OBBBA. Facilities must begin construction by end of 2032. Manufacturing and fuels segments had limited project finance debt access in 2025; balance sheet capital common."
    }
  }
};

// ═══════════════════════════════════════════════════════════
// FEOC DECISION TREE DATA
// ═══════════════════════════════════════════════════════════

const FEOC_SEVERITY = {
  safe:     { color: COLOR.green, bg: COLOR.greenBg, border: COLOR.greenBorder, icon: "\u2713", label: "COMPLIANT PATH" },
  moderate: { color: COLOR.amber, bg: COLOR.amberBg, border: COLOR.amberBorder, icon: "!", label: "PARTIAL RESTRICTIONS" },
  critical: { color: COLOR.red,   bg: COLOR.redBg,   border: COLOR.redBorder,   icon: "\u2715", label: "DISQUALIFIED" },
  info:     { color: COLOR.blue,  bg: COLOR.blueBg,   border: "rgba(96,165,250,0.25)", icon: "i", label: "INFORMATIONAL" },
};

const MACR_THRESHOLDS = {
  "45X": {
    label: "\u00A745X Manufacturing",
    rows: [
      { component: "Solar", thresholds: [["2026", "50%"], ["2027", "55%"], ["2028", "65%"], ["2029", "75%"], ["2030+", "85%"]] },
      { component: "Wind", thresholds: [["2026", "85%"], ["2027", "90%"], ["After 2027", "N/A"]] },
      { component: "Inverters", thresholds: [["2026", "50%"], ["2027", "55%"], ["2028", "60%"], ["2029", "65%"], ["2030+", "70%"]] },
      { component: "Battery", thresholds: [["2026", "60%"], ["2027", "65%"], ["2028", "70%"], ["2029", "75%"], ["2030+", "85%"]] },
      { component: "Critical minerals", thresholds: [["2026\u20132029", "0%"], ["2030", "25%"], ["2031", "30%"], ["2032", "40%"], ["After 2032", "50%+"]] },
    ],
  },
  "48E": {
    label: "\u00A748E Investment",
    rows: [
      { component: "Qualified facilities", thresholds: [["2026", "40%"], ["2027", "45%"], ["2028", "50%"], ["2029", "55%"], ["2030+", "60%"]] },
      { component: "Energy storage", thresholds: [["2026", "55%"], ["2027", "60%"], ["2028", "65%"], ["2029", "70%"], ["2030+", "75%"]] },
    ],
  },
};

const FEOC_TREE = {
  "construction-date": {
    type: "question",
    step: 1,
    label: "Construction Date",
    question: "When did construction begin on your project or facility?",
    description: "The new foreign entity rules only apply to projects that started construction in 2026 or later. If your project broke ground before then, these rules generally don't affect you.",
    options: [
      {
        id: "pre-2026",
        label: "Before 2026",
        sublabel: "Construction started before January 1, 2026",
        next: "outcome-not-applicable",
      },
      {
        id: "2026-or-later",
        label: "2026 or later",
        sublabel: "Construction started (or will start) on or after January 1, 2026",
        next: "pfe-check",
      },
    ],
  },

  "pfe-check": {
    type: "question",
    step: 2,
    label: "Foreign Entity Check",
    question: "Is your company owned or controlled by China, Russia, Iran, or North Korea?",
    description: "The government calls this being a \"Prohibited Foreign Entity\" (PFE). It includes companies that are subsidiaries of, or subject to effective control by, entities in these four countries. If any of these apply, the credit is completely unavailable.",
    options: [
      {
        id: "yes-pfe",
        label: "Yes, or not sure",
        sublabel: "Owned, controlled, or subject to jurisdiction of one of these countries",
        severity: "high",
        next: "outcome-fully-disqualified",
      },
      {
        id: "no-pfe",
        label: "No",
        sublabel: "Not owned or controlled by any of these countries",
        severity: "safe",
        next: "credit-selection",
      },
    ],
  },

  "credit-selection": {
    type: "question",
    step: 3,
    label: "Credit Type",
    question: "Which credit are you evaluating?",
    description: "The compliance requirements depend on the credit. Manufacturing (\u00A745X) and investment (\u00A748E) credits require a detailed supply chain analysis. Fuel (\u00A745Z) and carbon capture (\u00A745Q) credits only require an entity-level check \u2014 no component testing.",
    options: [
      {
        id: "45X",
        label: "\u00A745X",
        sublabel: "Advanced Manufacturing Production Credit",
        creditKey: "45X",
        next: "safe-harbor-check",
      },
      {
        id: "48E",
        label: "\u00A748E",
        sublabel: "Clean Electricity Investment Credit",
        creditKey: "48E",
        next: "safe-harbor-check",
      },
      {
        id: "45Z",
        label: "\u00A745Z",
        sublabel: "Clean Fuel Production Credit",
        creditKey: "45Z",
        next: "outcome-entity-only-45Z",
      },
      {
        id: "45Q",
        label: "\u00A745Q",
        sublabel: "Carbon Dioxide Sequestration",
        creditKey: "45Q",
        next: "outcome-entity-only-45Q",
      },
    ],
  },

  "safe-harbor-check": {
    type: "question",
    step: 4,
    label: "Safe Harbor Tables",
    question: "Is your technology listed in the IRS safe harbor tables?",
    description: "The IRS published tables that cover common clean energy technologies. If your technology is listed, you follow a simpler compliance path that uses pre-set cost weights instead of tracking every dollar yourself.",
    examples: [
      { label: "Listed technologies", items: ["Utility-scale solar", "Rooftop solar", "Onshore and offshore wind", "Battery storage", "\u00A745X solar and battery modules"] },
      { label: "Not yet listed", items: ["Geothermal", "Nuclear", "Fuel cells", "Other emerging technologies"] },
    ],
    options: [
      {
        id: "in-tables",
        label: "Yes \u2014 listed in safe harbor tables",
        sublabel: "Solar, wind, battery storage, or \u00A745X solar/battery modules",
        next: "outcome-streamlined-path",
      },
      {
        id: "not-in-tables",
        label: "No \u2014 not listed yet",
        sublabel: "Geothermal, nuclear, fuel cells, or other technologies",
        next: "outcome-full-cost-path",
      },
    ],
  },

  // ── OUTCOMES ──

  "outcome-not-applicable": {
    type: "outcome",
    severity: "info",
    title: "These rules likely don't apply to you",
    headline: "Pre-2026 construction",
    summary: "Because your project started construction before 2026, the new foreign entity restrictions generally do not apply. For \u00A745X manufacturers, the supply chain content rules don't kick in until tax year 2028.",
    details: [
      "The PFE and SFE prohibitions take effect for tax years beginning after July 4, 2025 (January 1, 2026 for calendar-year taxpayers).",
      "\u00A745X material assistance (MACR) rules become effective January 1, 2026 for new production.",
      "If you have a binding contract signed before June 16, 2025, those components may be excluded from any future FEOC calculation.",
    ],
    caveats: [
      "Make sure your construction start date is properly documented \u2014 the IRS has specific requirements for what counts.",
      "Talk to your tax advisor about whether safe harbor protections cover your particular situation.",
    ],
    relatedCredits: ["45X", "48E", "45Z", "45Q"],
  },

  "outcome-fully-disqualified": {
    type: "outcome",
    severity: "critical",
    title: "Credit fully disqualified",
    headline: "Prohibited Foreign Entity status blocks all credits",
    summary: "If your company is a Prohibited Foreign Entity \u2014 meaning it's owned by, controlled by, or subject to the jurisdiction of China, Russia, Iran, or North Korea \u2014 the credit is completely unavailable. There's no partial credit and no workaround.",
    details: [
      "This applies to all four credits tracked here: \u00A745X, \u00A748E, \u00A745Z, and \u00A745Q.",
      "The prohibition extends to subsidiaries and entities under effective control at any level in the corporate chain.",
      "Separate restrictions (SFE and FIE rules) also apply with their own effective dates and may affect additional entities.",
    ],
    caveats: [
      "If your PFE status is borderline, consult a tax attorney \u2014 the ownership and control tests have specific thresholds (e.g., 25% voting interest, board representation).",
      "Corporate restructuring may change PFE status, but it must be done for legitimate business reasons.",
    ],
    relatedCredits: [],
  },

  "outcome-entity-only-45Z": {
    type: "outcome",
    severity: "moderate",
    title: "Entity-level restrictions only",
    headline: "\u00A745Z \u2014 No supply chain testing required",
    summary: "Good news: \u00A745Z doesn't require the detailed component-by-component supply chain analysis that manufacturing and investment credits do. You've passed the PFE check. The remaining restrictions are about who you are as an entity, not what's in your supply chain.",
    details: [
      "PFE/SFE prohibition is already in effect (January 1, 2026 for calendar-year taxpayers).",
      "FIE (Foreign-Influenced Entity) prohibition has a later phase-in \u2014 effective for tax years beginning after July 4, 2027 (January 1, 2028 for calendar-year taxpayers).",
      "No MACR (Material Assistance Cost Ratio) test is required for \u00A745Z.",
      "Credit is active through December 31, 2029.",
    ],
    nextSteps: [
      "Confirm your entity is not a Specified Foreign Entity (SFE).",
      "Plan ahead for FIE compliance \u2014 the 2028 deadline will arrive quickly.",
      "Focus your diligence on carbon intensity scoring using the 45ZCF-GREET tool.",
    ],
    relatedCredits: ["45Z"],
    linkedCredit: "45Z",
  },

  "outcome-entity-only-45Q": {
    type: "outcome",
    severity: "moderate",
    title: "Entity-level restrictions only",
    headline: "\u00A745Q \u2014 No supply chain testing required",
    summary: "\u00A745Q has entity-level restrictions (PFE, SFE, and FIE), but doesn't require any supply chain component analysis. You've passed the PFE check. The OBBBA made no changes to \u00A745Q's FEOC framework.",
    details: [
      "All entity-level prohibitions (PFE, SFE, and FIE) are already in effect for tax years beginning after July 4, 2025 (January 1, 2026 for calendar-year taxpayers).",
      "No MACR test is required for \u00A745Q.",
      "OBBBA left \u00A745Q's FEOC rules unchanged \u2014 a signal of policy durability.",
      "Construction must begin by end of 2032 to qualify for enhanced IRA rates.",
    ],
    nextSteps: [
      "Confirm your entity is not an SFE or FIE.",
      "Focus your compliance efforts on MRV (measurement, reporting, and verification).",
      "The IRS safe harbor from Notice 2026-01 is available for 2025 reporting.",
    ],
    relatedCredits: ["45Q"],
    linkedCredit: "45Q",
  },

  "outcome-streamlined-path": {
    type: "outcome",
    severity: "safe",
    title: "Streamlined compliance path",
    headline: "Your technology is in the safe harbor tables",
    summary: "Because your technology is covered by the IRS safe harbor tables, you can use pre-set cost weights instead of tracking actual costs for every component. This is significantly easier than the alternative. The tables define which parts to check and how to weigh them.",
    steps: [
      {
        label: "A",
        title: "Look up your threshold",
        description: "Find the minimum percentage of non-foreign-entity content required for your technology type and construction year. These thresholds increase over time.",
        data: "thresholds",
      },
      {
        label: "B",
        title: "Identify which components to check",
        description: "Use the IRS tables to determine which parts need FEOC review. Only table-listed components count \u2014 most steel and iron products drop out of the calculation entirely.",
      },
      {
        label: "C.1",
        title: "Use table cost weights (not actual costs)",
        description: "Each component has a pre-assigned percentage of total cost in the safe harbor tables. Use these weights instead of your actual procurement costs. If the table weights work against you, you can opt to use actual costs instead.",
      },
      {
        label: "C.2",
        title: "Get certifications from your direct suppliers",
        description: "Each direct (Tier 1) supplier must certify they are not a PFE. You only need to go one level deep \u2014 no tracing further up the supply chain. Notice 2026-15 established three certification pathways.",
      },
      {
        label: "D",
        title: "Calculate your ratio and compare",
        description: "The formula is: (Total cost \u2212 PFE cost) \u00F7 Total cost. If your ratio meets or exceeds the threshold, you get the full credit. If it falls short, you get nothing \u2014 this is all-or-nothing.",
        formula: true,
      },
      {
        label: "E",
        title: "Document everything and keep records for 6 years",
        description: "Attach supplier certifications to your tax return. The IRS has a 6-year audit window, so your records need to last at least that long.",
      },
    ],
    contractException: "Components under a binding contract signed before June 16, 2025 can be excluded from the PFE calculation.",
    relatedCredits: ["45X", "48E"],
  },

  "outcome-full-cost-path": {
    type: "outcome",
    severity: "info",
    title: "Full-cost calculation path",
    headline: "Your technology is not yet in the safe harbor tables",
    summary: "Without safe harbor tables for your technology, you'll need to build the analysis from scratch using actual costs for every component. This is more work than the streamlined path, but the same formula and threshold logic apply. Updated tables are expected by end of 2026 \u2014 your technology may qualify for the simpler path once they're published.",
    steps: [
      {
        label: "A",
        title: "Look up your threshold",
        description: "Same process as the streamlined path \u2014 find the minimum non-foreign-entity content percentage for your technology type and construction year.",
        data: "thresholds",
      },
      {
        label: "B",
        title: "Build a complete component inventory",
        description: "Without tables to tell you what counts, you need to map every manufactured input. Work with your engineering and procurement teams to identify all components.",
      },
      {
        label: "C",
        title: "Track actual dollar costs for each component",
        description: "No table-based cost weights are available. You need real procurement data and cost allocation for every input \u2014 this is the main difference from the streamlined path.",
      },
      {
        label: "D",
        title: "Get certifications from your direct suppliers",
        description: "Same as the streamlined path \u2014 direct suppliers only, no cascading up the supply chain.",
      },
      {
        label: "E",
        title: "Calculate your ratio and compare",
        description: "Same formula: (Total cost \u2212 PFE cost) \u00F7 Total cost. Same all-or-nothing outcome. The difference is you're using your actual tracked costs rather than table weights.",
        formula: true,
      },
      {
        label: "F",
        title: "Document everything and keep records for 6 years",
        description: "Even more important here \u2014 since the entire calculation rests on your own cost tracking, your documentation needs to be airtight.",
      },
    ],
    contractException: "Components under a binding contract signed before June 16, 2025 can be excluded from the PFE calculation.",
    pendingNote: "Updated safe harbor tables are expected by end of 2026. Once published, your technology may move to the streamlined path.",
    relatedCredits: ["45X", "48E"],
  },
};

const TIMELINE = [
  { d: "Jul 4, 2025", e: "OBBBA signed into law", past: true, feedType: "deadline" },
  { d: "Sep 30, 2025", e: "EV credits terminated", past: true, feedType: "deadline" },
  { d: "Dec 31, 2025", e: "Home energy credits ended; FEOC rules took effect", past: true, feedType: "deadline" },
  { d: "Feb 2026", e: "Interim FEOC guidance & proposed §45Z rules", past: true, type: "guidance", feedType: "guidance" },
  { d: "May 28, 2026", e: "Public hearing on §45Z regulations", type: "guidance", feedType: "guidance", credits: ["45Z"], personaRelevance: { buyer: "low", "seller-developer": "medium", "seller-manufacturer": "low", advisor: "high" } },
  { d: "Jun 30, 2026", e: "§30C, §45L, §179D terminate", feedType: "deadline", next: true, personaRelevance: { buyer: "low", "seller-developer": "low", "seller-manufacturer": "low", advisor: "medium" } },
  { d: "Jul 4, 2026", e: "Hard deadline: begin construction for wind/solar", feedType: "deadline", urgent: true, credits: ["48E"], personaRelevance: { buyer: "high", "seller-developer": "high", "seller-manufacturer": "medium", advisor: "high" } },
  { d: "Late 2026", e: "Final FEOC rules expected", type: "guidance", feedType: "guidance", credits: ["45X", "48E"], personaRelevance: { buyer: "high", "seller-developer": "high", "seller-manufacturer": "high", advisor: "high" } },
  { d: "Dec 31, 2026", e: "Domestic content requirement rises to 55%", feedType: "regulatory", credits: ["48E"], personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "high", advisor: "high" } },
  { d: "Dec 31, 2027", e: "Wind/solar operational deadline; §45X wind credits end", feedType: "deadline", credits: ["48E", "45X"], personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "high", advisor: "medium" } },
  { d: "Dec 31, 2029", e: "§45Z and §45X full-value credits expire", feedType: "deadline", credits: ["45Z", "45X"], personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "high", advisor: "medium" } },
];

const NEWS = [
  {
    date: "Feb 2026", source: "Crux Climate", severity: "high", credits: ["48E", "45X", "45Z", "45Q"],
    title: "Crux: $63B in tax credit monetization in 2025, but market bifurcated",
    summary: "Total monetization across tax equity, transfers, and preferred equity reached $63B (+27% YoY). But the market split: H1 was strong, H2 saw softer pricing and smaller deal sizes as buyers digested OBBBA. $8–10B in 2025-vintage credits remain unsold.",
    keyChanges: [
      "Total tax credit monetization reached $63B (+27% YoY)",
      "Market bifurcated: strong H1, softer H2 pricing and deal sizes",
      "$8–10B in 2025-vintage credits remain unsold entering 2026",
      "Crux forecasts pricing rebound in 2026 as large corporate buyers return"
    ],
    buyerImpact: {
      enterprise: "Crux forecasts a pricing rebound in 2026 as large corporate buyers return and compete for a finite credit pool. Solar ITC and §45X credits expected to see strongest recovery.",
      midMarket: "The $8–10B in unsold 2025-vintage credits may present buying opportunities at favorable pricing before the expected rebound.",
      sellers: "H2 softness reflects OBBBA digestion, not demand destruction. Position for 2026 recovery."
    },
    personaRelevance: { buyer: "high", "seller-developer": "high", "seller-manufacturer": "high", advisor: "medium" }
  },
  {
    date: "Feb 2026", source: "Treasury / IRS", severity: "high", credits: ["48E", "45X"],
    title: "Treasury issues first FEOC guidance on MACR calculation (Notice 2026-15)",
    summary: "Notice 2026-15 (Feb 12, 2026) provides first substantive guidance on Material Assistance Cost Ratio. For solar, wind, and battery storage, domestic content safe harbor tables are the exclusive list for MACR calculation. Establishes three supplier certification pathways and Tier 1 accountability framework.",
    keyChanges: [
      "Domestic content safe harbor tables are exclusive and exhaustive for MACR calculation",
      "Three supplier certification pathways established",
      "Tier 1 accountability framework for supply chain compliance",
      "90%+ of developers already proactively mapping supply chains"
    ],
    buyerImpact: {
      enterprise: "Key open questions: constructive ownership rules, debt threshold testing for foreign-influenced entity status, safe harbor tables for nuclear/fuel cells/geothermal.",
      midMarket: "90%+ of developers already initiated supply chain mapping. Start now if you haven't.",
      sellers: "80% report no SFE/FIE exposure. Demonstrate compliance to maintain credit value."
    },
    personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "high", advisor: "high" }
  },
  {
    date: "Feb 2026", source: "Treasury / IRS", severity: "high", credits: ["48E"],
    title: "5% BOC safe harbor eliminated for large solar and all wind",
    summary: "Post-OBBBA guidance eliminated the 5% beginning-of-construction safe harbor for solar >1.5 MW and all wind. Projects that started construction before Sept 2, 2025 are grandfathered. 4-year continuity safe harbor retained.",
    keyChanges: [
      "5% BOC safe harbor eliminated for solar >1.5 MW and all wind",
      "Projects started before Sept 2, 2025 are grandfathered",
      "4-year continuity safe harbor retained",
      "July 4, 2026 is the hard deadline to begin construction"
    ],
    buyerImpact: {
      enterprise: "Crux estimates 170 GW already safe-harbored (147 GW solar + 23 GW wind) — sufficient pipeline for several years.",
      midMarket: "Verify safe harbor status of any project credits you're evaluating. Pre-Sept 2025 construction start is key.",
      sellers: "July 4, 2026 hard deadline. Ensure construction documentation is airtight."
    },
    personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "medium", advisor: "high" }
  },
  {
    date: "Feb 2026", source: "Crux Climate", severity: "medium", credits: ["48E"],
    title: "Tech-neutral §48E/§45Y credits trading at 1–2¢ discount to legacy",
    summary: "Only ~10% of tax equity investors actively pursuing tech-neutral credits; 90% would only consider under certain circumstances. FEOC qualification risk is the primary constraint. Legacy credits still available because eligibility is based on construction start date, not placed-in-service.",
    keyChanges: [
      "Tech-neutral credits trading at $0.01–0.02 discount to legacy",
      "Only ~10% of TE investors actively pursuing tech-neutral credits",
      "FEOC qualification risk is the primary constraint",
      "Legacy credits still available based on construction start date"
    ],
    buyerImpact: {
      enterprise: "Crux expects gradual shift toward tech-neutral credits beyond 2026 as safe-harbored legacy pipeline reaches commercial operation. FEOC clarity is the key unlock.",
      midMarket: "Legacy credits offer less FEOC risk. Consider the discount on tech-neutral credits against your risk tolerance.",
      sellers: "Demonstrate FEOC compliance to close the pricing gap on tech-neutral credits."
    },
    personaRelevance: { buyer: "high", "seller-developer": "medium", "seller-manufacturer": "medium", advisor: "medium" }
  },
  {
    date: "Feb 2026", source: "Crux Climate", severity: "medium", credits: ["48E"],
    title: "Utility-scale storage hits 19 GW, battery costs fall to $108/kWh",
    summary: "Storage deployment surged 72% YoY to 19 GW. Battery pack prices fell 8% to $108/kWh (BloombergNEF). Broad lender participation, though contracted projects get best terms. Under OBBBA, storage phaseout doesn't begin until 2034.",
    keyChanges: [
      "Storage deployment surged 72% YoY to 19 GW",
      "Battery pack prices fell 8% to $108/kWh",
      "Broad lender participation for contracted projects",
      "Storage phaseout doesn't begin until 2034 under OBBBA"
    ],
    buyerImpact: {
      enterprise: "FEOC material assistance thresholds for energy storage start at 55% in 2026, rising to 75% by 2030+. Falling costs and grid volatility position storage as central to new capacity.",
      midMarket: "Storage credits offer long runway through 2034. Battery cost declines improve project economics.",
      sellers: "Contracted projects get best financing terms. Focus on offtake agreements."
    },
    personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "medium", advisor: "low" }
  },
  {
    date: "Feb 2026", source: "Crux Climate", severity: "high", credits: ["48E", "45X", "45Z"],
    title: "Hybrid tax equity structures now 68% of all TE commitments",
    summary: "Total tax equity exceeded $36.6B in 2025 (+22% YoY). Hybrid structures grew from 58% to 68% of commitments. $15B+ in credits transferred out of hybrid TE partnerships. TE market now nearly 2x its pre-IRA size.",
    keyChanges: [
      "Total tax equity exceeded $36.6B in 2025 (+22% YoY)",
      "Hybrid structures grew from 58% to 68% of commitments",
      "$15B+ in credits transferred out of hybrid TE partnerships",
      "TE market now nearly 2x its pre-IRA size"
    ],
    buyerImpact: {
      enterprise: "Transfer market increasingly functions as complement to tax equity. Integrated capital stacks are the new norm for project finance.",
      midMarket: "Hybrid structures offer flexible entry points for credit buyers at various scales.",
      sellers: "Integrated capital stacks are the new norm. Structure deals to accommodate both TE and transfer buyers."
    },
    personaRelevance: { buyer: "high", "seller-developer": "high", "seller-manufacturer": "medium", advisor: "medium" }
  },
  {
    date: "Feb 18, 2026", source: "Treasury / IRS", severity: "medium", credits: ["45Q"],
    title: "§45Q — IRS issues safe harbor for 2025 reporting",
    summary: "Treasury issued Notice 2026-01, establishing a backup reporting method for 2025 carbon capture volumes. Protects credit eligibility while EPA transitions its Subpart RR electronic reporting system.",
    keyChanges: [
      "Backup reporting method established for 2025 capture volumes",
      "Safe harbor covers facilities that filed timely with EPA but experienced system disruptions",
      "Applies only to 2025 reporting year — future years depend on EPA system readiness",
      "Facilities must still maintain independent MRV documentation"
    ],
    buyerImpact: {
      enterprise: "Positive signal — the IRS is actively protecting §45Q credit eligibility during reporting transitions. If you're evaluating CCS/DAC credit purchases, this reduces near-term regulatory risk.",
      midMarket: "Helpful for due diligence. Companies considering first-time §45Q credit purchases can point to this safe harbor as evidence of regulatory commitment to keeping the credit functional.",
      sellers: "Good news. Developers and facility operators won't lose 2025 credits due to EPA reporting system issues. Maintain your independent MRV documentation as backup."
    },
    personaRelevance: { buyer: "low", "seller-developer": "medium", "seller-manufacturer": "low", advisor: "high" }
  },
  {
    date: "Feb 12, 2026", source: "Treasury / IRS", severity: "high", credits: ["45X", "48E"],
    title: "Interim FEOC guidance — 25% content threshold with safe harbors",
    summary: "Treasury published interim guidance establishing a 25% foreign entity content threshold for manufacturing and investment credits. Temporary safe harbors allow companies time to map supply chains.",
    keyChanges: [
      "25% FEOC content threshold — credits at risk if foreign entity content exceeds this level",
      "Temporary safe harbor for companies actively mapping supply chains (good faith effort)",
      "Applies to §45X manufacturing credits and §48E investment credits",
      "Final rules expected late 2026 — threshold could tighten"
    ],
    buyerImpact: {
      enterprise: "Action required. Map your supply chains now. The safe harbor protects you temporarily, but final rules could tighten the 25% threshold. Companies that wait risk losing credit eligibility.",
      midMarket: "Start supply chain mapping immediately even if you're not currently claiming credits. The FEOC framework will be the defining compliance issue for manufacturing and investment credits going forward.",
      sellers: "Critical. Manufacturers must demonstrate supply chain compliance to maintain credit value. Third-party supply chain verification is becoming a standard buyer requirement."
    },
    personaRelevance: { buyer: "high", "seller-developer": "high", "seller-manufacturer": "high", advisor: "high" }
  },
  {
    date: "Feb 5, 2026", source: "Treasury / IRS", severity: "high", credits: ["45Z"],
    title: "§45Z clean fuel rules — proposed regulations published",
    summary: "Proposed regulations establish carbon intensity scoring methodology, producer registration requirements, and third-party verification frameworks for clean fuel production credits.",
    keyChanges: [
      "45ZCF-GREET model confirmed as sole carbon intensity calculation methodology",
      "Producer registration required before credits can be generated — 90-day lead time",
      "Third-party verification required for all CI scores below 25 kgCO2e/mmBTU",
      "Public hearing scheduled May 28, 2026 — written comments due 60 days before"
    ],
    buyerImpact: {
      enterprise: "Watch closely. §45Z is the only credit OBBBA extended through 2029. The CI scoring methodology will determine which fuels qualify and at what credit value. Model your exposure now.",
      midMarket: "Don't wait for final rules. Start CI modeling immediately using 45ZCF-GREET. The 90-day registration lead time means companies that delay could miss entire quarters of credit generation.",
      sellers: "Critical. Producers must begin registration and third-party verification engagement now. The proposed CI benchmarks will directly determine your credit value per gallon."
    },
    personaRelevance: { buyer: "medium", "seller-developer": "high", "seller-manufacturer": "medium", advisor: "high" }
  },
  {
    date: "Jan 22, 2026", source: "DOE", severity: "low", credits: ["48E"],
    title: "Updated prevailing wage compliance for energy communities",
    summary: "DOE published updated maps and census-tract data for energy community designations, along with clarified prevailing wage requirements for projects seeking the 10% bonus credit.",
    keyChanges: [
      "Updated energy community census tracts reflecting 2025 unemployment data",
      "12 new metropolitan statistical areas now qualify as energy communities",
      "Prevailing wage safe harbor extended to cover subcontractor labor for projects under 5MW",
      "Apprenticeship percentage requirements unchanged at 15% of total labor hours"
    ],
    buyerImpact: {
      enterprise: "Minor update. If you're buying credits from projects in newly-designated energy communities, the 10% bonus may apply. Update your internal qualifying project maps.",
      midMarket: "Useful for evaluating specific project deals. New census tracts could make previously-borderline projects eligible for bonus credit amounts.",
      sellers: "Developers in or near the 12 new MSAs should reassess project eligibility for the energy community bonus."
    },
    personaRelevance: { buyer: "low", "seller-developer": "medium", "seller-manufacturer": "low", advisor: "medium" }
  },
  {
    date: "Jan 15, 2026", source: "Congress", severity: "medium", credits: ["45X", "48E", "45Z", "45Q"],
    title: "Senate Finance requests GAO review of credit transfer market",
    summary: "The Senate Finance Committee formally requested a GAO study of the §6418 credit transfer market, examining pricing transparency, intermediary fees, and buyer protections.",
    keyChanges: [
      "GAO directed to assess pricing transparency and market efficiency",
      "Study scope includes intermediary/broker fee structures and potential conflicts",
      "Committee interested in whether a centralized exchange or reporting framework is needed",
      "Report to include comparison with international carbon credit market structures"
    ],
    buyerImpact: {
      enterprise: "Low immediate impact, but signals future regulatory direction. Document your pricing methodology and broker selection processes now.",
      midMarket: "Net positive. More transparency generally benefits mid-market buyers who lack deal volume to command premium pricing.",
      sellers: "Minimal near-term effect. Watch the GAO report's recommendations — mandatory pricing disclosure could compress margins."
    },
    personaRelevance: { buyer: "medium", "seller-developer": "low", "seller-manufacturer": "low", advisor: "high" }
  },
];

const OTHER_CREDITS = [
  { sec: "§45U", name: "Zero-Emission Nuclear Power", type: "PTC", note: "Supporting existing nuclear plants — demand growing with AI data centers", status: "active" },
  { sec: "§48C", name: "Advanced Energy Manufacturing", type: "ITC", note: "Funds clean energy factory investments — popular with buyers", status: "active" },
  { sec: "§45V", name: "Clean Hydrogen Production", type: "PTC", note: "Credit active but rules contentious — FEOC restrictions apply", status: "modified" },
  { sec: "§48", name: "Legacy Energy Investment Credit", type: "ITC", note: "For projects started before 2025 — unchanged by OBBBA", status: "active" },
  { sec: "§45", name: "Legacy Clean Energy Production", type: "PTC", note: "For projects started before 2025 — unchanged by OBBBA", status: "active" },
];

const TERMINATED = [
  { sec: "§30D", name: "Clean Vehicle Credit", date: "Sep 2025" },
  { sec: "§45W", name: "Commercial Clean Vehicles", date: "Sep 2025" },
  { sec: "§25C", name: "Energy Efficient Home Improvement", date: "Dec 2025" },
  { sec: "§25D", name: "Residential Clean Energy", date: "Dec 2025" },
  { sec: "§30C", name: "Alt Fuel Vehicle Refueling", date: "Jun 2026" },
  { sec: "§45L", name: "New Energy Efficient Home", date: "Jun 2026" },
  { sec: "§179D", name: "Energy Efficient Commercial Buildings", date: "Jun 2026" },
];

function TerminatedSection() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: COLOR.card, border: `1px solid ${COLOR.border}`,
      borderRadius: 10, overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px", background: "transparent",
          border: "none", cursor: "pointer", fontFamily: FONT.body,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, color: COLOR.textTertiary,
            letterSpacing: "0.08em",
          }}>
            TERMINATED CREDITS
          </span>
          <span style={{ fontSize: 11, color: COLOR.textMuted }}>
            {TERMINATED.length} credits
          </span>
        </div>
        <span style={{
          color: COLOR.textTertiary, fontSize: 14,
          transform: open ? "rotate(0)" : "rotate(-90deg)",
          transition: "transform 0.2s",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${COLOR.borderSubtle}` }}>
          {TERMINATED.map((cr, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "70px 1fr auto",
              alignItems: "center", gap: 14,
              padding: "10px 20px", opacity: 0.55,
              borderBottom: i < TERMINATED.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
            }}>
              <span style={{
                fontFamily: FONT.mono, fontSize: 12, fontWeight: 600,
                color: COLOR.textTertiary, textDecoration: "line-through",
              }}>
                {cr.sec}
              </span>
              <span style={{ fontSize: 13, color: COLOR.textTertiary }}>{cr.name}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, color: COLOR.textMuted,
                fontFamily: FONT.mono,
              }}>
                {cr.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PERSONA SORT UTILITIES
// ═══════════════════════════════════════════════════════════

// Regulatory detail modal — rendered at top level, outside all grids/transforms
function RegModal({ item, onClose, onNavigate, persona }) {
  const isSeller = persona === "seller-developer" || persona === "seller-manufacturer";
  const defaultTab = isSeller ? "sellers" : "enterprise";
  const [impactTab, setImpactTab] = useState(defaultTab);
  useEffect(() => { setImpactTab(isSeller ? "sellers" : "enterprise"); }, [persona]);

  const IMPACT_LABELS = {
    enterprise: { label: "Enterprise", desc: "Fortune 500 / large-cap" },
    midMarket: { label: "Mid-Market", desc: "$2B–$10B companies" },
    sellers: { label: "Sellers", desc: "Developers & manufacturers" }
  };

  const sevColors = { high: COLOR.red, medium: COLOR.amber, low: COLOR.textTertiary };

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        className="cp-modal-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLOR.card, border: `1px solid ${COLOR.borderHover}`,
          borderRadius: 16, width: "100%", maxWidth: 720,
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header — sticky */}
        <div className="cp-modal-header" style={{
          padding: "24px 32px 20px",
          borderBottom: `1px solid ${COLOR.borderSubtle}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          position: "sticky", top: 0, background: COLOR.card,
          borderRadius: "16px 16px 0 0", zIndex: 1,
        }}>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 12, padding: "3px 10px", borderRadius: 4,
                background: (sevColors[item.severity] || COLOR.textTertiary) + "18",
                color: sevColors[item.severity] || COLOR.textTertiary,
                fontWeight: 700, letterSpacing: "0.05em",
                border: `1px solid ${(sevColors[item.severity] || COLOR.textTertiary)}30`,
              }}>
                {item.severity.toUpperCase()}
              </span>
              <span style={{ fontSize: 13, color: COLOR.textSecondary }}>{item.source}</span>
              <span style={{ fontSize: 13, color: COLOR.textMuted }}>·</span>
              <span style={{ fontSize: 13, color: COLOR.textSecondary, fontFamily: FONT.mono }}>{item.date}</span>
            </div>
            <h3 style={{
              fontFamily: FONT.display, fontSize: 26, fontWeight: 400,
              color: COLOR.text, margin: 0, lineHeight: 1.35,
            }}>
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: COLOR.bgSubtle, border: `1px solid ${COLOR.border}`,
              borderRadius: 8, width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 20, color: COLOR.textTertiary,
              flexShrink: 0, transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.active; e.currentTarget.style.color = COLOR.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.bgSubtle; e.currentTarget.style.color = COLOR.textTertiary; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cp-modal-body" style={{ padding: "28px 32px 32px" }}>
          <p style={{
            fontSize: 16, color: COLOR.textSecondary, lineHeight: 1.7,
            margin: "0 0 24px",
          }}>
            {item.summary}
          </p>

          {/* Affected credits */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {item.credits.map((cr, j) => {
              const hasDeep = !!CREDITS[cr];
              return (
                <span
                  key={j}
                  onClick={hasDeep ? () => { onClose(); onNavigate(cr); } : undefined}
                  style={{
                    fontSize: 13, padding: "5px 12px", borderRadius: 6,
                    fontFamily: FONT.mono, fontWeight: 700,
                    background: hasDeep ? COLOR.goldBg : COLOR.active,
                    color: hasDeep ? COLOR.gold : COLOR.textTertiary,
                    border: `1px solid ${hasDeep ? COLOR.goldBorder : COLOR.border}`,
                    cursor: hasDeep ? "pointer" : "default",
                    transition: "all 0.15s",
                  }}
                >
                  §{cr}{hasDeep ? " →" : ""}
                </span>
              );
            })}
          </div>

          {/* Key Changes */}
          <div style={{
            padding: "22px 24px", marginBottom: 20,
            background: COLOR.bgSubtle, borderRadius: 12,
            border: `1px solid ${COLOR.borderSubtle}`,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLOR.gold,
              letterSpacing: "0.08em", marginBottom: 14,
            }}>
              KEY CHANGES
            </div>
            {item.keyChanges.map((kc, j) => (
              <div key={j} style={{
                display: "flex", gap: 10,
                marginBottom: j < item.keyChanges.length - 1 ? 10 : 0,
              }}>
                <span style={{ color: COLOR.gold, flexShrink: 0, marginTop: 2, fontSize: 13 }}>·</span>
                <span style={{ fontSize: 15, color: COLOR.textSecondary, lineHeight: 1.6 }}>{kc}</span>
              </div>
            ))}
          </div>

          {/* Buyer Impact */}
          <div style={{
            padding: "22px 24px",
            background: COLOR.bgSubtle, borderRadius: 12,
            border: `1px solid ${COLOR.borderSubtle}`,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLOR.gold,
              letterSpacing: "0.08em", marginBottom: 16,
            }}>
              WHAT THIS MEANS FOR YOU
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {["enterprise", "midMarket", "sellers"].map((seg) => {
                const active = impactTab === seg;
                return (
                  <button
                    key={seg}
                    onClick={() => setImpactTab(seg)}
                    style={{
                      fontSize: 13, padding: "8px 18px", borderRadius: 7,
                      background: active ? COLOR.gold : "transparent",
                      color: active ? COLOR.bg : COLOR.textTertiary,
                      border: `1px solid ${active ? COLOR.gold : COLOR.border}`,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer", fontFamily: FONT.body,
                      transition: "all 0.15s",
                    }}
                  >
                    {IMPACT_LABELS[seg].label}
                  </button>
                );
              })}
            </div>
            <div style={{
              padding: "18px 20px",
              background: COLOR.card, borderRadius: 10,
              border: `1px solid ${COLOR.borderSubtle}`,
            }}>
              <div style={{ fontSize: 12, color: COLOR.textMuted, marginBottom: 8 }}>
                {IMPACT_LABELS[impactTab].desc}
              </div>
              <p style={{ fontSize: 16, color: COLOR.text, lineHeight: 1.7, margin: 0 }}>
                {item.buyerImpact[impactTab]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════
function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      ...style
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTENT GATING — "Free the what, gate the how much"
// ═══════════════════════════════════════════════════════════
// PMM rationale: CreditPulse gives away the full market narrative (credit names,
// deadlines, qualitative trends, intelligence headlines) for free. Specific
// pricing, market share figures, and transaction data — the numbers a buyer,
// seller, or advisor needs to make a deal — are gated behind a single email
// field. This creates a clear value exchange: urgency and context are free,
// decision-grade data converts to a lead.

// PMM rationale: Blur (not a hard block) signals that real data exists behind
// the gate. Users can see the *shape* of numbers, charts, and columns — creating
// desire rather than frustration. A hard "locked" icon grid feels like a paywall;
// a frosted-glass blur feels like a preview.
function GatedContent({ isUnlocked, onRequestUnlock, children, style = {} }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const wrapperRef = useRef(null);

  if (isUnlocked) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", ...style }}
      onClick={(e) => {
        e.stopPropagation();
        setShowOverlay(true);
      }}
    >
      <div style={{
        filter: "blur(6px)",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {children}
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(250, 250, 248, 0.25)",
        borderRadius: 8,
        cursor: "pointer",
      }} />
      {showOverlay && (
        <EmailCaptureOverlay
          anchorRef={wrapperRef}
          onSubmit={(email) => {
            onRequestUnlock(email);
            setShowOverlay(false);
          }}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}

// PMM rationale: Single email field, contextual (not a centered modal), minimal
// friction. Every additional form field (name, company, phone) reduces conversion
// rate. The overlay appears anchored to the gated content the user clicked —
// reinforcing the value exchange at the moment of highest intent.
function EmailCaptureOverlay({ anchorRef, onSubmit, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 200,
        background: "#FFFFFF",
        borderRadius: 14,
        padding: "28px 28px 22px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        border: `1px solid ${COLOR.border}`,
        width: "min(360px, 90%)",
        animation: "gateOverlayIn 0.2s ease",
      }}
    >
      <h3 style={{
        fontFamily: FONT.display, fontSize: 22, fontWeight: 400,
        color: COLOR.text, margin: "0 0 8px", lineHeight: 1.3,
      }}>
        Unlock full market intelligence
      </h3>
      <p style={{
        fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.5,
        margin: "0 0 18px",
      }}>
        Enter your email to access pricing data, market trends, and transaction insights.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="you@company.com"
          autoFocus
          style={{
            flex: 1, padding: "10px 14px",
            fontFamily: FONT.body, fontSize: 14,
            border: `1px solid ${error ? COLOR.red : COLOR.border}`,
            borderRadius: 8, outline: "none",
            transition: "border-color 0.15s",
            color: COLOR.text,
            background: "#FFFFFF",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = error ? COLOR.red : COLOR.goldBorder; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? COLOR.red : COLOR.border; }}
        />
        <button type="submit" style={{
          background: COLOR.gold, color: "#fff",
          border: "none", borderRadius: 8,
          padding: "10px 20px", fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: FONT.body,
          whiteSpace: "nowrap", transition: "background 0.15s",
          flexShrink: 0,
        }}>
          Unlock
        </button>
      </form>
      {error && (
        <div style={{ fontSize: 12, color: COLOR.red, marginTop: 6 }}>{error}</div>
      )}
      <p style={{
        fontSize: 11, color: COLOR.textMuted, margin: "14px 0 0",
        textAlign: "center",
      }}>
        Join 2,000+ clean energy professionals
      </p>
    </div>
  );
}

// Status pill
function StatusBadge({ status }) {
  const s = STATUS_MAP[status];
  if (!s) return null;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      padding: "3px 8px", borderRadius: 4,
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  );
}

// Risk gauge — visual bar instead of text
function RiskGauge({ level, compact = false }) {
  const r = RISK_MAP[level];
  if (!r) return null;
  const segments = 3;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 6 : 8 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} style={{
            width: compact ? 12 : 16, height: compact ? 4 : 5, borderRadius: 2,
            background: i < r.level ? r.color : COLOR.border,
            opacity: i < r.level ? 1 : 0.4,
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <span style={{
        fontSize: compact ? 10 : 11, fontWeight: 700, color: r.color,
        letterSpacing: "0.05em",
      }}>
        {r.label}
      </span>
    </div>
  );
}

// Pricing chart — adapts to data type: IG/non-IG bars, range-only, or early-stage
function PricingChart({ detail }) {
  if (!detail) return null;

  const SCALE_MIN = 80;
  const SCALE_MAX = 100;
  const range = SCALE_MAX - SCALE_MIN;
  const toPercent = (val) => ((val - SCALE_MIN) / range) * 100;

  if (detail.type === "ig_split") {
    return (
      <div>
        {/* IG bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: COLOR.text, fontWeight: 600 }}>Investment Grade</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 700, color: COLOR.green }}>{detail.ig.label}</span>
          </div>
          <div style={{ position: "relative", height: 20, background: COLOR.bgSubtle, borderRadius: 4, border: `1px solid ${COLOR.borderSubtle}` }}>
            <div style={{
              position: "absolute", top: 2, bottom: 2, borderRadius: 3,
              left: `${toPercent(detail.ig.low)}%`,
              width: `${toPercent(detail.ig.high) - toPercent(detail.ig.low)}%`,
              background: `linear-gradient(90deg, ${COLOR.green}90, ${COLOR.green})`,
              transition: "all 0.8s ease",
            }} />
            {/* Par line */}
            <div style={{
              position: "absolute", top: -2, bottom: -2, right: 0, width: 1,
              background: COLOR.textMuted, opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Non-IG bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: COLOR.text, fontWeight: 600 }}>Non–Investment Grade</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 700, color: COLOR.amber }}>{detail.nonIg.label}</span>
          </div>
          <div style={{ position: "relative", height: 20, background: COLOR.bgSubtle, borderRadius: 4, border: `1px solid ${COLOR.borderSubtle}` }}>
            <div style={{
              position: "absolute", top: 2, bottom: 2, borderRadius: 3,
              left: `${toPercent(detail.nonIg.low)}%`,
              width: `${toPercent(detail.nonIg.high) - toPercent(detail.nonIg.low)}%`,
              background: `linear-gradient(90deg, ${COLOR.amber}90, ${COLOR.amber})`,
              transition: "all 0.8s ease",
            }} />
            <div style={{
              position: "absolute", top: -2, bottom: -2, right: 0, width: 1,
              background: COLOR.textMuted, opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Scale labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>80¢</span>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>90¢</span>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>$1.00 (par)</span>
        </div>

        {/* Spread callout */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", background: COLOR.bgSubtle, borderRadius: 8,
          border: `1px solid ${COLOR.borderSubtle}`, marginBottom: 10,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLOR.gold }}>IG PREMIUM</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: COLOR.text }}>{detail.spread}</span>
          <span style={{ fontSize: 12, color: COLOR.textTertiary }}>per $1 of credit</span>
        </div>

        {/* Note */}
        <p style={{ fontSize: 13, color: COLOR.textTertiary, lineHeight: 1.55, margin: 0 }}>
          {detail.note}
        </p>
        <p style={{ fontSize: 11, color: COLOR.textMuted, marginTop: 8, margin: "8px 0 0" }}>
          Source: {detail.source}
        </p>
      </div>
    );
  }

  if (detail.type === "range_only") {
    return (
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: COLOR.text, fontWeight: 600 }}>Market Range</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 700, color: COLOR.text }}>{detail.label}</span>
          </div>
          <div style={{ position: "relative", height: 20, background: COLOR.bgSubtle, borderRadius: 4, border: `1px solid ${COLOR.borderSubtle}` }}>
            <div style={{
              position: "absolute", top: 2, bottom: 2, borderRadius: 3,
              left: `${toPercent(detail.low)}%`,
              width: `${toPercent(detail.high) - toPercent(detail.low)}%`,
              background: `linear-gradient(90deg, ${COLOR.gold}90, ${COLOR.gold})`,
              transition: "all 0.8s ease",
            }} />
            <div style={{
              position: "absolute", top: -2, bottom: -2, right: 0, width: 1,
              background: COLOR.textMuted, opacity: 0.5,
            }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>80¢</span>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>90¢</span>
          <span style={{ fontSize: 10, color: COLOR.textMuted, fontFamily: FONT.mono }}>$1.00 (par)</span>
        </div>
        <p style={{ fontSize: 13, color: COLOR.textTertiary, lineHeight: 1.55, margin: 0 }}>{detail.note}</p>
        <p style={{ fontSize: 11, color: COLOR.textMuted, margin: "8px 0 0" }}>Source: {detail.source}</p>
      </div>
    );
  }

  if (detail.type === "early_stage") {
    return (
      <div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 18px", background: COLOR.amberBg, borderRadius: 8,
          border: `1px solid ${COLOR.amberBorder}`, marginBottom: 14,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.amber }}>{detail.label}</span>
          <span style={{ fontSize: 13, color: COLOR.textSecondary }}>— limited pricing data available</span>
        </div>
        <p style={{ fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6, margin: 0 }}>{detail.note}</p>
        <p style={{ fontSize: 11, color: COLOR.textMuted, margin: "8px 0 0" }}>Source: {detail.source}</p>
      </div>
    );
  }

  return null;
}

// Metric card used in hero strip and deep dives
function MetricCard({ label, value, sublabel, style = {}, isUnlocked, onRequestUnlock }) {
  const valueContent = (
    <>
      <div style={{
        fontFamily: FONT.mono, fontSize: 24, fontWeight: 700,
        color: COLOR.text, marginBottom: 3,
      }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: 12, color: COLOR.textTertiary, lineHeight: 1.3 }}>
          {sublabel}
        </div>
      )}
    </>
  );

  return (
    <div style={{
      padding: "20px 18px",
      background: COLOR.card,
      textAlign: "center",
      ...style,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: COLOR.textTertiary,
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6,
      }}>
        {label}
      </div>
      {isUnlocked !== undefined ? (
        <GatedContent isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock}>
          {valueContent}
        </GatedContent>
      ) : valueContent}
    </div>
  );
}

// Credit card — clean, scannable, no jargon
function CreditCard({ credit, onClick, delay = 0, persona, isUnlocked, onRequestUnlock }) {
  const [hov, setHov] = useState(false);
  const c = credit;
  const tagline = (persona && c.personaTaglines?.[persona]) || c.tagline;

  // Determine if sunsetting deserves a visible warning
  const isSunsetting = c.status === "sunsetting";

  return (
    <FadeIn delay={delay} style={{ height: "100%" }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? COLOR.cardHover : COLOR.card,
          border: `1px solid ${hov ? COLOR.borderHover : COLOR.border}`,
          borderRadius: 12, padding: "22px 24px",
          height: "100%", boxSizing: "border-box",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: hov ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top row: section + sunsetting warning only */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontFamily: FONT.mono, fontSize: 14, fontWeight: 700,
            color: COLOR.gold,
          }}>
            {c.sec}
          </span>
          {isSunsetting && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "3px 8px", borderRadius: 4,
              color: COLOR.sunsetText, background: COLOR.sunsetBg,
            }}>
              SUNSETTING
            </span>
          )}
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: FONT.display, fontSize: 22, fontWeight: 400,
          color: COLOR.text, margin: "0 0 7px", lineHeight: 1.3,
        }}>
          {c.name}
        </h3>

        {/* Tagline — persona-aware */}
        <p style={{
          fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.55,
          margin: "0 0 16px",
        }}>
          {tagline}
        </p>

        {/* Mini stats row — reordered by persona */}
        {/* PMM rationale: For Seller — Project Developer, this is the primary gate.
            Developers want to know "what are buyers paying?" The card name and tagline
            (free) hook interest; pricing/share/timeline figures (gated) convert.
            Labels stay visible so users know exactly what's behind the blur. */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1, background: COLOR.borderSubtle, borderRadius: 8, overflow: "hidden",
        }}>
          {(() => {
            const allStats = [
              [c.pricing, "Pricing"],
              [c.share, "Mkt Share"],
              [c.timeline, "Timeline"],
            ];
            const order = (persona && STAT_ORDER[persona]) || [0, 1, 2];
            return order.map(i => allStats[i]);
          })().map(([val, label], i) => (
            <div key={i} style={{
              background: COLOR.bgSubtle, padding: "10px 8px", textAlign: "center",
            }}>
              <GatedContent isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock}>
                <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: COLOR.text }}>
                  {val}
                </div>
              </GatedContent>
              <div style={{ fontSize: 10, color: COLOR.textTertiary, letterSpacing: "0.06em", fontWeight: 600, marginTop: 2 }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Next important date — not expiration, but what's coming next */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 14, padding: "9px 12px",
          background: c.nextDate?.urgent ? COLOR.redBg : COLOR.goldBg,
          border: `1px solid ${c.nextDate?.urgent ? COLOR.redBorder : COLOR.goldBorder}`,
          borderRadius: 6,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            color: c.nextDate?.urgent ? COLOR.red : COLOR.goldDim,
            flexShrink: 0,
          }}>
            NEXT
          </span>
          <span style={{
            fontFamily: FONT.mono, fontSize: 12, fontWeight: 700,
            color: c.nextDate?.urgent ? COLOR.red : COLOR.gold,
            flexShrink: 0,
          }}>
            {c.nextDate?.date}
          </span>
          <span style={{ fontSize: 12, color: COLOR.textSecondary }}>
            {c.nextDate?.label}
          </span>
        </div>
      </div>
    </FadeIn>
  );
}

// Tab component
function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="cp-tabs" style={{
      display: "flex", gap: 2, padding: 3,
      background: COLOR.bgSubtle, borderRadius: 8,
      marginBottom: 20,
    }}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              flex: 1, padding: "10px 14px",
              background: active ? COLOR.card : "transparent",
              border: active ? `1px solid ${COLOR.border}` : "1px solid transparent",
              borderRadius: 6, cursor: "pointer",
              fontFamily: FONT.body, fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? COLOR.text : COLOR.textTertiary,
              transition: "all 0.2s",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEEP DIVE PAGE
// ═══════════════════════════════════════════════════════════

function DeepDive({ creditKey, onBack, onNavigate, isUnlocked, onRequestUnlock }) {
  const c = CREDITS[creditKey];
  const [tab, setTab] = useState("overview");

  if (!c) return null;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "risk", label: "Risk & Regulation" },
    { key: "market", label: "Market Data" },
    { key: "guidance", label: "Guidance & FEOC" },
  ];

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", color: COLOR.gold,
          fontSize: 13, cursor: "pointer", padding: "6px 0", marginBottom: 16,
          fontFamily: FONT.body, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> Market Overview
      </button>

      {/* Header */}
      <FadeIn>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span className="cp-deep-header-sec" style={{
              fontFamily: FONT.mono, fontSize: 36, fontWeight: 700,
              color: COLOR.gold, lineHeight: 1,
            }}>
              {c.sec}
            </span>
          </div>
          <h1 className="cp-deep-header-name" style={{
            fontFamily: FONT.display, fontSize: 32, fontWeight: 400,
            color: COLOR.text, margin: "0 0 10px", lineHeight: 1.3,
          }}>
            {c.name}
          </h1>
          <p style={{
            fontSize: 16, color: COLOR.textSecondary, lineHeight: 1.7,
            maxWidth: 700, margin: 0,
          }}>
            {c.sum}
          </p>
        </div>
      </FadeIn>

      {/* Stats bar */}
      {/* PMM rationale: Deep dive stats bar surfaces the same pricing/share/timeline
          figures gated on credit cards — labels stay visible, only values blur. */}
      <FadeIn delay={80}>
        <div className="cp-metric-strip" style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
          background: COLOR.border, borderRadius: 10, overflow: "hidden", marginBottom: 28,
        }}>
          <MetricCard label="Pricing" value={c.pricing} sublabel={c.pricingCtx} isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock} />
          <MetricCard label="Market Share" value={c.share} sublabel={c.shareCtx} isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock} />
          <MetricCard label="Deal Timeline" value={c.timeline} sublabel={c.timelineCtx} isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock} />
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={160}>
        <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
      </FadeIn>

      {/* Tab content */}
      <FadeIn delay={200} key={tab}>
        {tab === "overview" && (
          <div>
            {/* TL;DR */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: COLOR.gold,
                letterSpacing: "0.08em", marginBottom: 12,
              }}>KEY TAKEAWAYS</div>
              {c.bl.map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, marginBottom: i < c.bl.length - 1 ? 8 : 0,
                }}>
                  <span style={{
                    color: i === 0 ? COLOR.gold : COLOR.textTertiary,
                    flexShrink: 0, marginTop: 1, fontSize: 11,
                  }}>
                    {i === 0 ? "★" : "·"}
                  </span>
                  <span style={{
                    fontSize: 13, lineHeight: 1.55,
                    color: i === 0 ? COLOR.text : COLOR.textSecondary,
                    fontWeight: i === 0 ? 600 : 400,
                  }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* Value table */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: COLOR.gold,
                letterSpacing: "0.08em", marginBottom: 12,
              }}>CREDIT VALUE</div>
              {c.howItWorks.valueTable.map((row, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 0",
                  borderBottom: i < c.howItWorks.valueTable.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
                }}>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary }}>{row[0]}</span>
                  <span style={{
                    fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: COLOR.text,
                  }}>{row[1]}</span>
                </div>
              ))}
            </div>

            {/* Key dates */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: COLOR.gold,
                letterSpacing: "0.08em", marginBottom: 12,
              }}>KEY DATES</div>
              {c.dates.map((d, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, marginBottom: i < c.dates.length - 1 ? 10 : 0,
                  alignItems: "baseline",
                }}>
                  <span style={{
                    fontFamily: FONT.mono, fontSize: 12,
                    color: d.urgent ? COLOR.red : COLOR.textSecondary,
                    minWidth: 100, flexShrink: 0, fontWeight: d.urgent ? 700 : 400,
                  }}>
                    {d.d}
                  </span>
                  <span style={{
                    fontSize: 13, color: d.urgent ? COLOR.text : COLOR.textSecondary, lineHeight: 1.45,
                  }}>
                    {d.e} {d.urgent && "⚠"}
                  </span>
                </div>
              ))}
            </div>

            {/* What qualifies */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: COLOR.gold,
                letterSpacing: "0.08em", marginBottom: 12,
              }}>WHAT QUALIFIES</div>
              {c.howItWorks.eligible.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: COLOR.textTertiary, flexShrink: 0, marginTop: 1 }}>·</span>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{e}</span>
                </div>
              ))}
              <div style={{
                marginTop: 14, padding: "10px 14px",
                background: COLOR.bgSubtle, borderRadius: 6,
                border: `1px solid ${COLOR.borderSubtle}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.textTertiary, marginBottom: 4 }}>TRANSFERABILITY</div>
                <div style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{c.howItWorks.transfer}</div>
              </div>
              <div style={{
                marginTop: 8, padding: "10px 14px",
                background: COLOR.bgSubtle, borderRadius: 6,
                border: `1px solid ${COLOR.borderSubtle}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.textTertiary, marginBottom: 4 }}>DURATION</div>
                <div style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{c.howItWorks.duration}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "risk" && (
          <div>
            {/* Risk summary */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em" }}>
                  RISK PROFILE
                </div>
                <RiskGauge level={c.risk} />
              </div>
              <p style={{ fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.65, margin: 0 }}>
                {c.risks.summary}
              </p>
            </div>

            {/* Underwriting risks */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.red, letterSpacing: "0.08em", marginBottom: 14 }}>
                WHAT YOU'RE UNDERWRITING
              </div>
              {c.risks.underwriting.map((r, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, marginBottom: i < c.risks.underwriting.length - 1 ? 12 : 0,
                  padding: "10px 14px", background: COLOR.bgSubtle, borderRadius: 8,
                  border: `1px solid ${COLOR.borderSubtle}`,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0,
                    background: r.severity === "high" ? COLOR.redBg : COLOR.amberBg,
                    color: r.severity === "high" ? COLOR.red : COLOR.amber,
                    border: `1px solid ${r.severity === "high" ? COLOR.redBorder : COLOR.amberBorder}`,
                    height: "fit-content", marginTop: 2,
                  }}>
                    {r.severity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{r.text}</span>
                </div>
              ))}
            </div>

            {/* Mitigable */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.green, letterSpacing: "0.08em", marginBottom: 14 }}>
                WHAT YOU CAN MITIGATE
              </div>
              {c.risks.mitigable.map((r, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, marginBottom: i < c.risks.mitigable.length - 1 ? 10 : 0,
                  alignItems: "flex-start",
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0,
                    background: COLOR.greenBg, color: COLOR.green, border: `1px solid ${COLOR.greenBorder}`,
                    marginTop: 2,
                  }}>
                    {r.action}
                  </span>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{r.text}</span>
                </div>
              ))}
            </div>

            {/* Uncertain */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.amber, letterSpacing: "0.08em", marginBottom: 14 }}>
                STILL UNCERTAIN
              </div>
              {c.risks.uncertain.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: COLOR.amber, fontWeight: 700, flexShrink: 0 }}>?</span>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "market" && (
          <div>
            {/* Pricing */}
            {/* PMM rationale: The entire pricing chart is gated — it's pure transaction-grade
                data. The section label stays visible so users know what's behind the blur. */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 18 }}>
                CREDIT PRICING
              </div>
              <GatedContent isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock}>
                <PricingChart detail={c.pricingDetail} />
              </GatedContent>
            </div>

            {/* Cross-credit comparison */}
            {/* PMM rationale: For Advisors, the cross-credit comparison is the primary gate.
                Visible column headers + row labels ("§45X", "Pricing", "Risk") signal exactly
                what data lives behind the blur — strong conversion for users who need
                comprehensive, side-by-side figures for client meetings. */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "22px", marginBottom: 16, overflowX: "auto",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 16 }}>
                CROSS-CREDIT COMPARISON
              </div>
              <table className="cp-comparison-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${COLOR.border}`, fontSize: 10, color: COLOR.textTertiary, fontWeight: 600, letterSpacing: "0.06em" }}></th>
                    {Object.keys(CREDITS).map(key => {
                      const isCurrent = key === creditKey;
                      return (
                        <th key={key} style={{
                          textAlign: "left", padding: "8px 10px",
                          borderBottom: `1px solid ${COLOR.border}`,
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                          color: isCurrent ? COLOR.gold : COLOR.textTertiary,
                          background: isCurrent ? COLOR.goldBg : "transparent",
                          borderRadius: isCurrent ? "6px 6px 0 0" : 0,
                        }}>
                          {CREDITS[key].sec}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Pricing", key: "pricing" },
                    { label: "Risk", key: "risk" },
                    { label: "Mkt Share", key: "share" },
                    { label: "Timeline", key: "timeline" },
                  ].map((row, ri) => (
                    <tr key={ri}>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: COLOR.textTertiary, fontWeight: 600, borderBottom: `1px solid ${COLOR.borderSubtle}` }}>
                        {row.label}
                      </td>
                      {Object.keys(CREDITS).map(key => {
                        const isCurrent = key === creditKey;
                        let val = CREDITS[key][row.key];
                        let cellColor = COLOR.textSecondary;
                        if (row.key === "risk") {
                          cellColor = RISK_MAP[val]?.color || COLOR.textSecondary;
                        }
                        return (
                          <td key={key} style={{
                            padding: "8px 10px",
                            fontFamily: FONT.mono, fontSize: 12, fontWeight: isCurrent ? 700 : 400,
                            color: isCurrent ? COLOR.text : cellColor,
                            background: isCurrent ? COLOR.goldBg : "transparent",
                            borderBottom: `1px solid ${COLOR.borderSubtle}`,
                          }}>
                            <GatedContent isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock}>
                              <span>{val}</span>
                            </GatedContent>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Deal structure */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 12 }}>
                DEAL STRUCTURE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: "10px 14px", background: COLOR.bgSubtle, borderRadius: 6, border: `1px solid ${COLOR.borderSubtle}` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: COLOR.textTertiary, marginBottom: 4 }}>MARKET SHARE</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 700, color: COLOR.text }}>{c.share}</div>
                  <div style={{ fontSize: 11, color: COLOR.textTertiary }}>{c.shareCtx}</div>
                </div>
                <div style={{ padding: "10px 14px", background: COLOR.bgSubtle, borderRadius: 6, border: `1px solid ${COLOR.borderSubtle}` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: COLOR.textTertiary, marginBottom: 4 }}>DEAL TIMELINE</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 700, color: COLOR.text }}>{c.timeline}</div>
                  <div style={{ fontSize: 11, color: COLOR.textTertiary }}>{c.timelineCtx}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "guidance" && (
          <div>
            {/* FEOC */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 12 }}>
                FOREIGN ENTITY RESTRICTIONS (FEOC)
              </div>
              <p style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.65, margin: 0 }}>{c.feoc}</p>
            </div>

            {/* FEOC compliance tool CTA */}
            {onNavigate && (
              <div style={{
                background: COLOR.goldBg, border: `1px solid ${COLOR.goldBorder}`,
                borderRadius: 10, padding: "16px 22px", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 12,
              }}>
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: COLOR.gold,
                    letterSpacing: "0.08em", marginBottom: 4,
                  }}>FEOC COMPLIANCE CHECK</div>
                  <div style={{ fontSize: 14, color: COLOR.textSecondary }}>
                    Walk through the foreign entity decision tree for {c.sec}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate("feocCheck:" + creditKey)}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  style={{
                    background: COLOR.gold, color: COLOR.bg, border: "none", borderRadius: 6,
                    padding: "9px 18px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: FONT.body, transition: "opacity 0.15s",
                  }}
                >
                  Check compliance →
                </button>
              </div>
            )}

            {/* Guidance status */}
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "18px 22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 12 }}>
                REGULATORY STATUS
              </div>
              <p style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.65, margin: "0 0 14px" }}>{c.guidance.status}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.amber, letterSpacing: "0.08em", marginBottom: 10 }}>
                UNRESOLVED QUESTIONS
              </div>
              {c.guidance.open.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: COLOR.amber, fontWeight: 700, flexShrink: 0 }}>?</span>
                  <span style={{ fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </FadeIn>

      {/* Disclaimer */}
      <div style={{
        marginTop: 32, padding: "12px 16px",
        background: COLOR.bgSubtle, borderRadius: 8, border: `1px solid ${COLOR.borderSubtle}`,
      }}>
        <p style={{ fontSize: 10, color: COLOR.textMuted, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: COLOR.textTertiary }}>Disclaimer:</strong> CreditPulse is educational only. Not legal, tax, or investment advice. Consult qualified advisors. Data as of {LAST_UPDATED}.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FEOC DECISION TREE
// ═══════════════════════════════════════════════════════════

function FEOCOptionCard({ option, onClick }) {
  const [hov, setHov] = useState(false);
  const sev = option.severity;
  const borderColor = sev === "high" ? COLOR.red : sev === "safe" ? COLOR.green : COLOR.gold;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? COLOR.cardHover : COLOR.card,
        border: `1px solid ${hov ? COLOR.borderHover : COLOR.border}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 10, padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        flex: 1, minWidth: 200,
      }}
    >
      <div style={{
        fontSize: 16, fontWeight: 700, color: COLOR.text,
        fontFamily: FONT.body, marginBottom: 6,
      }}>
        {option.label}
      </div>
      <div style={{
        fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.55,
      }}>
        {option.sublabel}
      </div>
    </div>
  );
}

function FEOCQuestion({ node, onSelect }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
        color: COLOR.gold, fontFamily: FONT.mono, marginBottom: 10,
      }}>
        STEP {node.step} · {node.label.toUpperCase()}
      </div>
      <h2 style={{
        fontFamily: FONT.display, fontSize: 28, fontWeight: 400,
        color: COLOR.text, margin: "0 0 14px", lineHeight: 1.35,
      }}>
        {node.question}
      </h2>
      <p style={{
        fontSize: 15, color: COLOR.textSecondary, lineHeight: 1.65,
        margin: "0 0 28px", maxWidth: 700,
      }}>
        {node.description}
      </p>

      {/* Technology examples for safe harbor check */}
      {node.examples && (
        <div style={{
          display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap",
        }}>
          {node.examples.map((group, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 200, padding: "14px 18px",
              background: COLOR.bgSubtle, borderRadius: 8,
              border: `1px solid ${COLOR.borderSubtle}`,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                color: COLOR.textTertiary, marginBottom: 8,
              }}>
                {group.label.toUpperCase()}
              </div>
              {group.items.map((item, j) => (
                <div key={j} style={{
                  fontSize: 13, color: COLOR.textSecondary, lineHeight: 1.7,
                }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Option cards */}
      <div className="feoc-options" style={{
        display: "flex", gap: 14, flexWrap: "wrap",
      }}>
        {node.options.map((opt) => (
          <FEOCOptionCard
            key={opt.id}
            option={opt}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>
    </div>
  );
}

function MACRThresholdTable({ creditKey }) {
  const data = MACR_THRESHOLDS[creditKey];
  if (!data) return null;

  return (
    <div style={{
      background: COLOR.bgSubtle, borderRadius: 8,
      border: `1px solid ${COLOR.borderSubtle}`,
      overflow: "hidden", marginTop: 12,
    }}>
      <div style={{
        padding: "10px 16px",
        borderBottom: `1px solid ${COLOR.borderSubtle}`,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        color: COLOR.gold, fontFamily: FONT.mono,
      }}>
        {data.label} — MINIMUM NON-PFE CONTENT BY YEAR
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 13, fontFamily: FONT.mono,
        }}>
          <thead>
            <tr>
              <th style={{
                textAlign: "left", padding: "10px 16px",
                color: COLOR.textTertiary, fontWeight: 600, fontSize: 11,
                letterSpacing: "0.05em", borderBottom: `1px solid ${COLOR.borderSubtle}`,
              }}>
                Component
              </th>
              {data.rows[0].thresholds.map(([year], i) => (
                <th key={i} style={{
                  textAlign: "center", padding: "10px 12px",
                  color: COLOR.textTertiary, fontWeight: 600, fontSize: 11,
                  letterSpacing: "0.05em", borderBottom: `1px solid ${COLOR.borderSubtle}`,
                }}>
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i}>
                <td style={{
                  padding: "9px 16px", color: COLOR.textSecondary,
                  fontFamily: FONT.body, fontSize: 13,
                  borderBottom: i < data.rows.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
                }}>
                  {row.component}
                </td>
                {row.thresholds.map(([, val], j) => (
                  <td key={j} style={{
                    textAlign: "center", padding: "9px 12px",
                    color: val === "N/A" ? COLOR.textMuted : COLOR.text,
                    fontWeight: 600,
                    borderBottom: i < data.rows.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
                  }}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FEOCOutcome({ node, selectedCredit, onNavigate, onRestart }) {
  const sev = FEOC_SEVERITY[node.severity] || FEOC_SEVERITY.info;

  return (
    <div>
      {/* Severity banner */}
      <div style={{
        background: sev.bg, border: `1px solid ${sev.border}`,
        borderRadius: 10, padding: "20px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${sev.color}20`, border: `1px solid ${sev.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: sev.color, flexShrink: 0,
        }}>
          {sev.icon}
        </div>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: sev.color, marginBottom: 4,
          }}>
            {sev.label}
          </div>
          <div style={{
            fontFamily: FONT.display, fontSize: 24, fontWeight: 400,
            color: COLOR.text, lineHeight: 1.3,
          }}>
            {node.title}
          </div>
        </div>
      </div>

      {/* Headline + summary */}
      <div style={{
        background: COLOR.card, border: `1px solid ${COLOR.border}`,
        borderRadius: 10, padding: "20px 24px", marginBottom: 20,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          color: COLOR.gold, fontFamily: FONT.mono, marginBottom: 8,
        }}>
          {node.headline.toUpperCase()}
        </div>
        <p style={{
          fontSize: 15, color: COLOR.textSecondary, lineHeight: 1.65, margin: 0,
        }}>
          {node.summary}
        </p>
      </div>

      {/* Details */}
      {node.details && (
        <div style={{
          background: COLOR.card, border: `1px solid ${COLOR.border}`,
          borderRadius: 10, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: COLOR.textTertiary, marginBottom: 14,
          }}>
            KEY DETAILS
          </div>
          {node.details.map((d, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, marginBottom: i < node.details.length - 1 ? 12 : 0,
            }}>
              <span style={{ color: COLOR.gold, fontSize: 14, flexShrink: 0, marginTop: 1 }}>·</span>
              <span style={{ fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6 }}>{d}</span>
            </div>
          ))}
        </div>
      )}

      {/* Compliance steps (for streamlined / full-cost paths) */}
      {node.steps && (
        <div style={{
          background: COLOR.card, border: `1px solid ${COLOR.border}`,
          borderRadius: 10, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: COLOR.textTertiary, marginBottom: 18,
          }}>
            COMPLIANCE STEPS
          </div>
          {node.steps.map((step, i) => (
            <div key={i} style={{
              marginBottom: i < node.steps.length - 1 ? 22 : 0,
              paddingBottom: i < node.steps.length - 1 ? 22 : 0,
              borderBottom: i < node.steps.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
            }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: COLOR.goldBg, border: `1px solid ${COLOR.goldBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.mono, fontSize: 13, fontWeight: 700,
                  color: COLOR.gold, flexShrink: 0,
                }}>
                  {step.label}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: COLOR.text, marginBottom: 4,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6,
                  }}>
                    {step.description}
                  </div>

                  {/* Inline threshold table */}
                  {step.data === "thresholds" && selectedCredit && (
                    <MACRThresholdTable creditKey={selectedCredit} />
                  )}

                  {/* Formula callout */}
                  {step.formula && (
                    <div style={{
                      marginTop: 12, padding: "14px 18px",
                      background: COLOR.bgSubtle, borderRadius: 8,
                      border: `1px solid ${COLOR.goldBorder}`,
                    }}>
                      <div style={{
                        fontFamily: FONT.mono, fontSize: 14, fontWeight: 600,
                        color: COLOR.gold, marginBottom: 6,
                      }}>
                        (Total cost − PFE cost) ÷ Total cost ≥ threshold
                      </div>
                      <div style={{
                        fontSize: 13, color: COLOR.textSecondary,
                      }}>
                        All-or-nothing: meet the threshold and you get 100% of the credit. Fall short and you get 0%.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next steps (for entity-only outcomes) */}
      {node.nextSteps && (
        <div style={{
          background: COLOR.card, border: `1px solid ${COLOR.border}`,
          borderRadius: 10, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: COLOR.textTertiary, marginBottom: 14,
          }}>
            RECOMMENDED NEXT STEPS
          </div>
          {node.nextSteps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, marginBottom: i < node.nextSteps.length - 1 ? 12 : 0,
            }}>
              <span style={{
                fontFamily: FONT.mono, fontSize: 12, fontWeight: 700,
                color: COLOR.gold, flexShrink: 0, marginTop: 2,
              }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Contract exception callout */}
      {node.contractException && (
        <div style={{
          background: COLOR.amberBg, border: `1px solid ${COLOR.amberBorder}`,
          borderRadius: 10, padding: "16px 20px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: COLOR.amber, marginBottom: 6,
          }}>
            EXISTING CONTRACT EXCEPTION
          </div>
          <div style={{
            fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6,
          }}>
            {node.contractException}
          </div>
        </div>
      )}

      {/* Pending note (for full-cost path) */}
      {node.pendingNote && (
        <div style={{
          background: COLOR.blueBg, border: `1px solid rgba(96,165,250,0.25)`,
          borderRadius: 10, padding: "16px 20px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 14, color: COLOR.blue, lineHeight: 1.6,
          }}>
            {node.pendingNote}
          </div>
        </div>
      )}

      {/* Caveats */}
      {node.caveats && (
        <div style={{
          background: COLOR.card, border: `1px solid ${COLOR.border}`,
          borderRadius: 10, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: COLOR.textTertiary, marginBottom: 14,
          }}>
            IMPORTANT TO KNOW
          </div>
          {node.caveats.map((c, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, marginBottom: i < node.caveats.length - 1 ? 12 : 0,
            }}>
              <span style={{ color: COLOR.amber, fontSize: 14, flexShrink: 0, marginTop: 1 }}>!</span>
              <span style={{ fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Related credit links */}
      {node.relatedCredits && node.relatedCredits.length > 0 && (
        <div style={{
          background: COLOR.card, border: `1px solid ${COLOR.border}`,
          borderRadius: 10, padding: "18px 22px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: 13, color: COLOR.textTertiary, fontWeight: 500,
          }}>
            Explore related credits:
          </span>
          {node.relatedCredits.map((cr) => (
            <span
              key={cr}
              onClick={() => onNavigate(cr)}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.goldBorder; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLOR.goldBg; }}
              style={{
                fontSize: 13, padding: "5px 14px", borderRadius: 6,
                fontFamily: FONT.mono, fontWeight: 700,
                background: COLOR.goldBg, color: COLOR.gold,
                border: `1px solid ${COLOR.goldBorder}`,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              §{cr}
            </span>
          ))}
        </div>
      )}

      {/* Start over */}
      <button
        onClick={onRestart}
        onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.active; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        style={{
          background: "transparent", border: `1px solid ${COLOR.border}`,
          borderRadius: 8, padding: "10px 20px",
          fontSize: 14, fontWeight: 600, color: COLOR.textSecondary,
          cursor: "pointer", fontFamily: FONT.body,
          transition: "all 0.15s",
        }}
      >
        Start over
      </button>
    </div>
  );
}

function FEOCDecisionTree({ onBack, onNavigate, preselectedCredit }) {
  const getInitialState = (preselected) => {
    if (!preselected) return { node: "construction-date", history: [], answers: {}, credit: null };
    if (preselected === "45X" || preselected === "48E") {
      return {
        node: "safe-harbor-check",
        history: ["construction-date", "pfe-check", "credit-selection"],
        answers: { "construction-date": "2026-or-later", "pfe-check": "no-pfe", "credit-selection": preselected },
        credit: preselected,
      };
    }
    if (preselected === "45Z") {
      return {
        node: "outcome-entity-only-45Z",
        history: ["construction-date", "pfe-check", "credit-selection"],
        answers: { "construction-date": "2026-or-later", "pfe-check": "no-pfe", "credit-selection": "45Z" },
        credit: "45Z",
      };
    }
    if (preselected === "45Q") {
      return {
        node: "outcome-entity-only-45Q",
        history: ["construction-date", "pfe-check", "credit-selection"],
        answers: { "construction-date": "2026-or-later", "pfe-check": "no-pfe", "credit-selection": "45Q" },
        credit: "45Q",
      };
    }
    return { node: "construction-date", history: [], answers: {}, credit: null };
  };

  const init = getInitialState(preselectedCredit);
  const [currentNodeId, setCurrentNodeId] = useState(init.node);
  const [history, setHistory] = useState(init.history);
  const [answers, setAnswers] = useState(init.answers);
  const [selectedCredit, setSelectedCredit] = useState(init.credit);
  const [animating, setAnimating] = useState(false);

  const currentNode = FEOC_TREE[currentNodeId];
  const isOutcome = currentNode.type === "outcome";

  // Max steps depends on whether you reach step 4
  const totalSteps = 4;
  const progressPct = isOutcome ? 100 : ((currentNode.step - 1) / totalSteps) * 100;

  function handleSelect(option) {
    if (option.creditKey) setSelectedCredit(option.creditKey);
    setAnimating(true);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [currentNodeId]: option.id }));
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(option.next);
      setAnimating(false);
    }, 200);
  }

  function handleBack() {
    if (history.length === 0) {
      onBack();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      const prevHistory = [...history];
      const prevNodeId = prevHistory.pop();
      const newAnswers = { ...answers };
      delete newAnswers[prevNodeId];
      // Reset credit if we're going back past credit selection
      if (prevNodeId === "credit-selection") setSelectedCredit(null);
      setHistory(prevHistory);
      setCurrentNodeId(prevNodeId);
      setAnswers(newAnswers);
      setAnimating(false);
    }, 200);
  }

  function handleRestart() {
    setAnimating(true);
    setTimeout(() => {
      setCurrentNodeId("construction-date");
      setHistory([]);
      setAnswers({});
      setSelectedCredit(null);
      setAnimating(false);
    }, 200);
  }

  // Build breadcrumb trail from history
  const breadcrumbs = history.map((nodeId) => {
    const n = FEOC_TREE[nodeId];
    const answerId = answers[nodeId];
    const answerLabel = n.options?.find(o => o.id === answerId)?.label || answerId;
    return { nodeId, stepLabel: n.label, answer: answerLabel };
  });

  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      {/* Back button */}
      <FadeIn>
        <button
          onClick={handleBack}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textTertiary; }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: COLOR.textTertiary,
            fontFamily: FONT.body, fontWeight: 500,
            marginBottom: 20, padding: 0,
            transition: "color 0.15s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← {history.length === 0 ? "Market Overview" : "Back"}
        </button>

        {/* Title */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: COLOR.goldBg, border: `1px solid ${COLOR.goldBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: COLOR.gold, flexShrink: 0,
          }}>
            ◆
          </div>
          <h1 style={{
            fontFamily: FONT.display, fontSize: 30, fontWeight: 400,
            color: COLOR.text, margin: 0,
          }}>
            FEOC Compliance Check
          </h1>
        </div>
        <p style={{
          fontSize: 14, color: COLOR.textTertiary, margin: "0 0 20px",
        }}>
          Do the new foreign entity rules affect your credit?
        </p>

        {/* Progress bar */}
        <div style={{
          height: 3, background: COLOR.borderSubtle, borderRadius: 2,
          marginBottom: 10, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", background: COLOR.gold, borderRadius: 2,
            width: `${progressPct}%`,
            transition: "width 0.3s ease",
          }} />
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div style={{
            display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20,
            alignItems: "center",
          }}>
            {breadcrumbs.map((bc, i) => (
              <span key={bc.nodeId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  onClick={() => {
                    // Jump back to this step
                    const idx = history.indexOf(bc.nodeId);
                    const newHistory = history.slice(0, idx);
                    const newAnswers = {};
                    newHistory.forEach(h => { if (answers[h]) newAnswers[h] = answers[h]; });
                    if (bc.nodeId === "credit-selection" || !newHistory.includes("credit-selection")) {
                      setSelectedCredit(null);
                    }
                    setHistory(newHistory);
                    setCurrentNodeId(bc.nodeId);
                    setAnswers(newAnswers);
                  }}
                  style={{
                    fontSize: 12, color: COLOR.gold, cursor: "pointer",
                    fontFamily: FONT.mono, fontWeight: 600,
                    padding: "3px 8px", borderRadius: 4,
                    background: COLOR.goldBg, border: `1px solid ${COLOR.goldBorder}`,
                    transition: "all 0.15s",
                  }}
                >
                  {bc.answer}
                </span>
                {i < breadcrumbs.length - 1 && (
                  <span style={{ color: COLOR.textMuted, fontSize: 11 }}>→</span>
                )}
              </span>
            ))}
            {isOutcome && (
              <>
                <span style={{ color: COLOR.textMuted, fontSize: 11 }}>→</span>
                <span style={{
                  fontSize: 12, fontFamily: FONT.mono, fontWeight: 600,
                  color: FEOC_SEVERITY[currentNode.severity]?.color || COLOR.textSecondary,
                  padding: "3px 8px", borderRadius: 4,
                  background: FEOC_SEVERITY[currentNode.severity]?.bg || COLOR.active,
                  border: `1px solid ${FEOC_SEVERITY[currentNode.severity]?.border || COLOR.border}`,
                }}>
                  Result
                </span>
              </>
            )}
          </div>
        )}

        {/* Pre-selected credit info banner */}
        {preselectedCredit && history.length > 0 && currentNodeId !== "construction-date" && (
          <div style={{
            background: COLOR.blueBg, border: `1px solid rgba(96,165,250,0.25)`,
            borderRadius: 8, padding: "10px 16px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 13, color: COLOR.blue }}>
              Pre-selected for §{preselectedCredit}. Assumes: construction 2026+, not a PFE.
            </span>
            <span
              onClick={handleRestart}
              style={{
                fontSize: 13, color: COLOR.blue, cursor: "pointer",
                textDecoration: "underline", fontWeight: 600,
              }}
            >
              Start from beginning
            </span>
          </div>
        )}
      </FadeIn>

      {/* Main content — question or outcome */}
      <div style={{
        opacity: animating ? 0 : 1,
        transition: "opacity 0.2s ease",
      }}>
        {currentNode.type === "question" ? (
          <FadeIn key={currentNodeId}>
            <FEOCQuestion node={currentNode} onSelect={handleSelect} />
          </FadeIn>
        ) : (
          <FadeIn key={currentNodeId}>
            <FEOCOutcome
              node={currentNode}
              selectedCredit={selectedCredit}
              onNavigate={onNavigate}
              onRestart={handleRestart}
            />
          </FadeIn>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 32, padding: "12px 16px",
        background: COLOR.bgSubtle, borderRadius: 8, border: `1px solid ${COLOR.borderSubtle}`,
      }}>
        <p style={{ fontSize: 10, color: COLOR.textMuted, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: COLOR.textTertiary }}>Disclaimer:</strong> This tool is for educational purposes only. It does not constitute legal, tax, or investment advice. Consult qualified advisors for decisions about your specific situation. Based on guidance available as of {LAST_UPDATED}.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PERSONA COMPONENTS
// ═══════════════════════════════════════════════════════════

function PersonaLandingScreen({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      background: COLOR.bg,
    }}>
      <FadeIn>
        <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
          {/* Logo */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, marginBottom: 40,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `linear-gradient(135deg, ${COLOR.gold}, ${COLOR.goldDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
            </div>
            <span style={{
              fontSize: 16, fontWeight: 700, color: COLOR.text,
              letterSpacing: "0.06em",
            }}>
              CREDITPULSE
            </span>
            <span style={{
              fontSize: 12, color: COLOR.textTertiary, fontWeight: 400,
              marginLeft: 4,
            }}>
              Clean energy tax credit intelligence
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: FONT.display, fontSize: 36, fontWeight: 400,
            color: COLOR.text, margin: "0 0 10px", lineHeight: 1.3,
          }}>
            What brings you to CreditPulse?
          </h1>
          <p style={{
            fontSize: 15, color: COLOR.textTertiary, margin: "0 0 36px",
          }}>
            We'll tailor your market view. You can change this anytime.
          </p>

          {/* Persona cards — 2x2 grid */}
          <div className="cp-persona-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
            marginBottom: 24, textAlign: "left",
          }}>
            {Object.entries(PERSONAS).map(([key, p]) => (
              <PersonaLandingCard key={key} persona={p} onClick={() => onSelect(key)} />
            ))}
          </div>

          {/* Skip link */}
          <div
            onClick={() => onSelect("generic")}
            style={{
              fontSize: 13, color: COLOR.textTertiary, cursor: "pointer",
              textAlign: "center", padding: "8px 0",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = COLOR.textSecondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = COLOR.textTertiary; }}
          >
            Skip — show me everything
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function PersonaLandingCard({ persona, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: COLOR.card,
        border: `1px solid ${hov ? COLOR.goldBorder : COLOR.border}`,
        borderRadius: 12, padding: "24px 24px 22px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{
        fontFamily: FONT.display, fontSize: 18, fontWeight: 400,
        color: COLOR.text, marginBottom: 10,
      }}>
        {persona.label}
      </div>
      <div style={{
        fontSize: 14, color: COLOR.gold, fontStyle: "italic",
        lineHeight: 1.55, marginBottom: 12,
      }}>
        {"\u201C"}{persona.question}{"\u201D"}
      </div>
      <div style={{
        fontSize: 12, color: COLOR.textSecondary, lineHeight: 1.5,
      }}>
        {persona.desc}
      </div>
    </div>
  );
}

function PersonaIndicator({ persona, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const p = PERSONAS[persona];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!p) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none",
          padding: "4px 0",
          fontSize: 14, fontWeight: 700, color: COLOR.gold,
          cursor: "pointer", fontFamily: FONT.body,
          transition: "all 0.15s",
        }}
      >
        {p.headerLabel || p.shortLabel}
        <span style={{ fontSize: 10, opacity: 0.7 }}>{"\u25BE"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, paddingTop: 4,
          zIndex: 200,
        }}>
          <div style={{
            background: COLOR.card, border: `1px solid ${COLOR.border}`,
            borderRadius: 8, overflow: "hidden", minWidth: 240,
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          }}>
            {Object.entries(PERSONAS).map(([key, pp]) => (
              <button
                key={key}
                onClick={() => { onSelect(key); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 16px", border: "none",
                  background: key === persona ? COLOR.goldBg : "transparent",
                  color: key === persona ? COLOR.gold : COLOR.textSecondary,
                  fontSize: 13, fontWeight: key === persona ? 700 : 400,
                  cursor: "pointer", fontFamily: FONT.body,
                  borderBottom: `1px solid ${COLOR.borderSubtle}`,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (key !== persona) e.currentTarget.style.background = COLOR.hover; }}
                onMouseLeave={(e) => { if (key !== persona) e.currentTarget.style.background = "transparent"; }}
              >
                {pp.shortLabel}
                <div style={{ fontSize: 11, color: COLOR.textTertiary, marginTop: 2 }}>
                  {pp.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformBridgeCTA({ persona }) {
  const [hov, setHov] = useState(false);
  const [hovSecondary, setHovSecondary] = useState(false);
  const bridge = (persona && BRIDGE_CTA[persona]) || BRIDGE_CTA.generic;

  return (
    <FadeIn delay={650}>
      <div style={{
        background: "#F5F0E8", border: "1px solid #E8DFD0",
        borderRadius: 14,
        padding: "26px 28px", marginBottom: 48,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          color: "#B8860B", textTransform: "uppercase", marginBottom: 10,
        }}>
          CRUX PLATFORM
        </div>
        <div style={{
          fontFamily: FONT.display, fontSize: 21, fontWeight: 400,
          color: COLOR.text, marginBottom: 8, lineHeight: 1.35,
        }}>
          {bridge.pretext}
        </div>
        <p style={{
          fontSize: 14, color: "#6B5E4F", lineHeight: 1.6,
          margin: "0 0 18px", maxWidth: 600,
        }}>
          {bridge.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <a
            href="https://www.cruxclimate.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              display: "inline-block",
              background: hov ? COLOR.goldDim : COLOR.gold,
              color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 20px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: FONT.body,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            {bridge.cta} {"\u2192"}
          </a>
          {bridge.secondaryCta && (
            <a
              href="https://www.cruxclimate.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovSecondary(true)}
              onMouseLeave={() => setHovSecondary(false)}
              style={{
                display: "inline-block",
                background: hovSecondary ? "rgba(196,184,164,0.12)" : "transparent",
                color: COLOR.textSecondary,
                border: "1.5px solid #C4B8A4",
                borderRadius: 8,
                padding: "9px 20px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT.body,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              {bridge.secondaryCta}
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER 1 — "THE ANSWER" (Hero Block)
// ═══════════════════════════════════════════════════════════

function HeroBlock({ persona, isUnlocked, onRequestUnlock }) {
  const hero = persona && PERSONA_HERO[persona];
  if (!hero) return null;

  const tagColors = {
    green: { bg: COLOR.activeBg, text: COLOR.activeText },
    orange: { bg: COLOR.sunsetBg, text: COLOR.sunsetText },
  };

  return (
    <FadeIn>
      <div id="cp-section-hero" style={{ marginBottom: 40 }}>
        <div className="cp-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center",
        }}>
          {/* Left column — headline + context */}
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
              color: COLOR.gold, textTransform: "uppercase", marginBottom: 14,
            }}>
              {hero.personaLabel}
            </div>
            <h1 style={{
              fontFamily: FONT.display, fontSize: 36, fontWeight: 400,
              color: COLOR.text, margin: "0 0 14px", lineHeight: 1.25,
            }}>
              {hero.headline}
            </h1>
            <p style={{
              fontSize: 16, color: COLOR.textSecondary, lineHeight: 1.6,
              margin: 0,
            }}>
              {hero.body}
            </p>
          </div>

          {/* Right column — stat cards */}
          <div className="cp-hero-stats" style={{
            display: "grid",
            gridTemplateColumns: hero.statCards.length >= 2 ? "1fr 1fr" : "1fr",
            gap: 16,
          }}>
            {hero.statCards.map((card, i) => {
              const tc = tagColors[card.tagColor] || tagColors.green;
              return (
                <div key={i} style={{
                  background: COLOR.card,
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 14,
                  padding: "20px 20px 18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                    color: COLOR.textTertiary, textTransform: "uppercase", marginBottom: 10,
                  }}>
                    {card.creditLabel}
                  </div>
                  {/* PMM rationale: The hero stat card price is the primary gate for Buyers.
                      A CFO scanning this page sees "§45X MANUFACTURING" (free) but the specific
                      "93–96¢" price hits the blur — that's the conversion moment. */}
                  <GatedContent isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock}>
                    <div style={{
                      fontFamily: FONT.display, fontSize: 40, fontWeight: 400,
                      color: COLOR.text, lineHeight: 1.1, marginBottom: 6,
                    }}>
                      {card.price}
                    </div>
                    <div style={{
                      fontSize: 13, color: COLOR.textTertiary, marginBottom: 12,
                    }}>
                      {card.subtitle}
                    </div>
                    <div style={{
                      display: "inline-block",
                      fontSize: 11, fontWeight: 600,
                      padding: "4px 10px", borderRadius: 6,
                      background: tc.bg, color: tc.text,
                    }}>
                      {card.tag}
                    </div>
                  </GatedContent>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER 2 — "YOUR NEXT MOVE" (Curated Credit Cards)
// ═══════════════════════════════════════════════════════════

const SECTION_TITLES = {
  buyer: { heading: "Credits available now", subtitle: "Curated for tax credit buyers" },
  "seller-developer": { heading: "Your credit types", subtitle: "Curated for project developers" },
  "seller-manufacturer": { heading: "Your 45X credits", subtitle: "Curated for manufacturers" },
  advisor: { heading: "Market overview", subtitle: "Full credit landscape" },
};

function NextMoveSection({ persona, onNavigate, isUnlocked, onRequestUnlock }) {
  const config = persona && PERSONA_NEXT_MOVE[persona];
  if (!config) return null;

  const isAdvisor = persona === "advisor";
  const titles = SECTION_TITLES[persona] || { heading: "Credits", subtitle: "" };

  return (
    <div id="cp-section-credits" style={{ marginBottom: 36 }}>
      <FadeIn delay={100}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <div>
            <h2 style={{
              fontFamily: FONT.display, fontSize: 28, fontWeight: 400,
              color: COLOR.text, margin: 0,
            }}>
              {titles.heading}
            </h2>
            <p style={{ fontSize: 13, color: COLOR.textTertiary, margin: "4px 0 0" }}>
              {titles.subtitle}
            </p>
          </div>
          {isAdvisor && (
            <span style={{ fontSize: 12, color: COLOR.textTertiary }}>
              {Object.keys(CREDITS).length + OTHER_CREDITS.length + TERMINATED.length} credits tracked
            </span>
          )}
        </div>
      </FadeIn>

      {/* Credit cards */}
      {config.layout === "featured" ? (
        /* Manufacturer: featured 45X + compact 48C */
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 14 }}>
            {config.credits.map((key, i) => {
              const credit = CREDITS[key];
              return credit ? (
                <CreditCard
                  key={key}
                  credit={credit}
                  onClick={() => onNavigate(key)}
                  delay={150 + i * 80}
                  persona={persona}
                  isUnlocked={isUnlocked}
                  onRequestUnlock={onRequestUnlock}
                />
              ) : null;
            })}
          </div>
          {/* Compact 48C card from OTHER_CREDITS */}
          {config.extraCards && config.extraCards.map(sec => {
            const cr = OTHER_CREDITS.find(c => c.sec === "\u00A7" + sec);
            if (!cr) return null;
            return (
              <FadeIn key={sec} delay={300}>
                <div style={{
                  background: COLOR.card, border: `1px solid ${COLOR.border}`,
                  borderRadius: 10, padding: "16px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{
                      fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: COLOR.gold,
                    }}>
                      {cr.sec}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: COLOR.text }}>{cr.name}</div>
                      <div style={{ fontSize: 13, color: COLOR.textSecondary }}>{cr.note}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, color: COLOR.textTertiary, fontStyle: "italic", flexShrink: 0,
                  }}>
                    Deep dive coming soon
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      ) : (
        /* Standard grid: 2-col or 3-col depending on card count */
        <div>
          <div className="cp-credit-grid" style={{
            display: "grid",
            gridTemplateColumns: config.credits.length <= 2 ? "repeat(2,1fr)" : "repeat(2,1fr)",
            gap: 14, marginBottom: 20,
          }}>
            {config.credits.map((key, i) => {
              const credit = CREDITS[key];
              return credit ? (
                <CreditCard
                  key={key}
                  credit={credit}
                  onClick={() => onNavigate(key)}
                  delay={150 + i * 80}
                  persona={persona}
                  isUnlocked={isUnlocked}
                  onRequestUnlock={onRequestUnlock}
                />
              ) : null;
            })}
          </div>

          {/* Advisor-only: Other Active Credits + Terminated */}
          {config.showOther && (
            <FadeIn delay={500}>
              <div style={{
                background: COLOR.card, border: `1px solid ${COLOR.border}`,
                borderRadius: 10, overflow: "hidden", marginBottom: 12,
              }}>
                <div style={{
                  padding: "14px 20px", display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${COLOR.borderSubtle}`,
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: COLOR.gold,
                    letterSpacing: "0.08em",
                  }}>
                    OTHER ACTIVE CREDITS
                  </span>
                  <span style={{ fontSize: 11, color: COLOR.textTertiary, fontStyle: "italic" }}>
                    Deep dives coming soon
                  </span>
                </div>
                {OTHER_CREDITS.map((cr, i) => (
                  <div key={i} className="cp-other-row" style={{
                    display: "grid", gridTemplateColumns: "70px 1fr auto",
                    alignItems: "center", gap: 14,
                    padding: "12px 20px",
                    borderBottom: i < OTHER_CREDITS.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
                  }}>
                    <span style={{
                      fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: COLOR.gold,
                    }}>
                      {cr.sec}
                    </span>
                    <div>
                      <span style={{ fontSize: 14, color: COLOR.text, fontWeight: 500 }}>{cr.name}</span>
                      <span style={{ fontSize: 13, color: COLOR.textTertiary, marginLeft: 10 }}>{cr.note}</span>
                    </div>
                    {cr.status && (
                      <span className="cp-other-status" style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                        padding: "3px 8px", borderRadius: 4,
                        color: cr.status === "modified" ? COLOR.amber : COLOR.textSecondary,
                        background: cr.status === "modified" ? COLOR.amberBg : COLOR.active,
                        border: `1px solid ${cr.status === "modified" ? COLOR.amberBorder : COLOR.border}`,
                      }}>
                        {cr.status === "modified" ? "MODIFIED" : "ACTIVE"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {config.showTerminated && (
            <FadeIn delay={550}>
              <TerminatedSection />
            </FadeIn>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER 3a — KEY DEADLINES TIMELINE
// ═══════════════════════════════════════════════════════════

const URGENCY_STYLE = {
  URGENT:   { color: COLOR.red, bg: COLOR.redBg, border: COLOR.redBorder },
  UPCOMING: { color: COLOR.amber, bg: COLOR.amberBg, border: COLOR.amberBorder },
  FUTURE:   { color: COLOR.textTertiary, bg: COLOR.active, border: COLOR.borderHover },
};

function computeUrgency(dateStr) {
  const now = new Date();
  let target;
  if (dateStr.startsWith("Late")) {
    target = new Date("2026-12-01");
  } else {
    target = new Date(dateStr);
  }
  if (isNaN(target.getTime())) return "FUTURE";
  const monthsAway = (target - now) / (1000 * 60 * 60 * 24 * 30.44);
  if (monthsAway < 6) return "URGENT";
  if (monthsAway < 12) return "UPCOMING";
  return "FUTURE";
}

function buildDeadlines(persona) {
  const dateRank = (d) => {
    if (d.startsWith("Late")) return new Date("2026-12-01").getTime();
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };
  return TIMELINE
    .filter(t => !t.past)
    .filter(t => {
      if (!persona || persona === "advisor") return true;
      const rel = t.personaRelevance && t.personaRelevance[persona];
      return rel === "high" || rel === "medium";
    })
    .map(t => ({
      date: t.d,
      description: t.e,
      credits: t.credits || [],
      urgency: computeUrgency(t.d),
    }))
    .sort((a, b) => dateRank(a.date) - dateRank(b.date));
}

function DeadlinesTimeline({ persona }) {
  const deadlines = buildDeadlines(persona);
  if (deadlines.length === 0) return null;

  return (
    <div id="cp-section-deadlines" style={{ marginBottom: 36 }}>
      <FadeIn delay={200}>
        <h2 style={{
          fontFamily: FONT.display, fontSize: 28, fontWeight: 400,
          color: COLOR.text, margin: "0 0 20px",
        }}>
          Key Deadlines
        </h2>
      </FadeIn>

      <div>
        {deadlines.map((item, i) => {
          const us = URGENCY_STYLE[item.urgency];
          return (
            <FadeIn key={i} delay={250 + i * 50}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr auto",
                alignItems: "center",
                gap: 16,
                padding: "12px 0",
                borderBottom: i < deadlines.length - 1 ? `1px solid #f0ede8` : "none",
              }}>
                {/* Date */}
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: us.color,
                }}>
                  {item.date}
                </span>

                {/* Description */}
                <span style={{
                  fontSize: 14,
                  color: COLOR.text, lineHeight: 1.4,
                }}>
                  {item.description}
                </span>

                {/* Credit pills + urgency tag */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  flexShrink: 0,
                }}>
                  {item.credits.map(cr => (
                    <span key={cr} style={{
                      fontSize: 11, fontWeight: 600,
                      padding: "2px 6px", borderRadius: 3,
                      color: COLOR.textSecondary, background: "#F5F3EF",
                    }}>
                      {"\u00A7"}{cr}
                    </span>
                  ))}
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    padding: "2px 8px", borderRadius: 4,
                    color: us.color, background: us.bg,
                  }}>
                    {item.urgency}
                  </span>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYER 3b — MARKET INTELLIGENCE FEED
// ═══════════════════════════════════════════════════════════

const FEED_TYPE_STYLE = {
  deadline:   { color: COLOR.red, label: "DEADLINE" },
  guidance:   { color: COLOR.amber, label: "GUIDANCE" },
  regulatory: { color: COLOR.blue, label: "REGULATORY" },
  market:     { color: COLOR.green, label: "MARKET" },
};

function feedTypeFromSource(source) {
  if (!source) return "regulatory";
  if (source.includes("Crux")) return "market";
  if (source.includes("Treasury") || source.includes("IRS")) return "regulatory";
  if (source.includes("Congress")) return "regulatory";
  if (source.includes("DOE")) return "guidance";
  return "regulatory";
}

function buildIntelFeed(persona, showAll) {
  const dateRank = (d) => {
    if (d.startsWith("Late")) return new Date("2026-12-01").getTime();
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };
  let items = NEWS.map(n => ({
    date: n.date,
    title: n.title,
    summary: n.summary,
    credits: n.credits || [],
    feedType: feedTypeFromSource(n.source),
    source: n.source,
    severity: n.severity,
    personaRelevance: n.personaRelevance || {},
    originalNews: n,
  }));

  if (!showAll && persona && persona !== "advisor") {
    items = items.filter(item => {
      const rel = item.personaRelevance[persona];
      return rel === "high" || rel === "medium";
    });
  }

  // Reverse-chronological (newest first)
  items.sort((a, b) => dateRank(b.date) - dateRank(a.date));
  return items;
}

function IntelFeed({ persona, onNavigate }) {
  const [showAll, setShowAll] = useState(false);
  const [activeRegItem, setActiveRegItem] = useState(null);
  const isAdvisor = persona === "advisor";
  const feed = buildIntelFeed(persona, showAll || isAdvisor);

  return (
    <div id="cp-section-intelligence" style={{ marginBottom: 36 }}>
      {activeRegItem && (
        <RegModal
          item={activeRegItem}
          onClose={() => setActiveRegItem(null)}
          onNavigate={onNavigate}
          persona={persona}
        />
      )}

      <FadeIn delay={200}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <h2 style={{
              fontFamily: FONT.display, fontSize: 28, fontWeight: 400,
              color: COLOR.text, margin: 0,
            }}>
              Market Intelligence
            </h2>
            <span style={{ fontSize: 12, color: COLOR.textTertiary }}>
              Based on Crux's 2025 Market Intelligence Report
            </span>
          </div>
          {!isAdvisor && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: showAll ? COLOR.goldBg : "transparent",
                border: `1px solid ${showAll ? COLOR.goldBorder : COLOR.border}`,
                borderRadius: 6, padding: "5px 12px",
                fontSize: 12, fontWeight: 600,
                color: showAll ? COLOR.gold : COLOR.textTertiary,
                cursor: "pointer", fontFamily: FONT.body,
                transition: "all 0.15s",
              }}
            >
              {showAll ? "Showing all" : "Relevant to you"}
            </button>
          )}
        </div>
      </FadeIn>

      <div>
        {feed.map((item, i) => {
          const ft = FEED_TYPE_STYLE[item.feedType] || FEED_TYPE_STYLE.regulatory;

          return (
            <FadeIn key={i} delay={250 + i * 40}>
              <div
                onClick={() => setActiveRegItem(item.originalNews)}
                style={{
                  padding: "14px 0",
                  borderBottom: `1px solid #f0ede8`,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = COLOR.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Top line: source + category tag + credit pills */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: 6,
                }}>
                  {item.source && (
                    <span style={{ fontSize: 12, color: COLOR.textTertiary, fontWeight: 400 }}>
                      {item.source}
                    </span>
                  )}
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    padding: "2px 7px", borderRadius: 4,
                    color: ft.color, background: `${ft.color}12`,
                  }}>
                    {ft.label}
                  </span>
                  {item.credits.map(cr => (
                    <span key={cr} style={{
                      fontSize: 10, fontWeight: 600,
                      padding: "2px 6px", borderRadius: 3,
                      color: COLOR.textTertiary, background: "#F5F3EF",
                    }}>
                      {"\u00A7"}{cr}
                    </span>
                  ))}
                </div>

                {/* Bottom line: headline + date + arrow */}
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 12,
                }}>
                  <span style={{
                    fontSize: 15, fontWeight: 500,
                    color: COLOR.text, lineHeight: 1.4,
                    flex: 1,
                  }}>
                    {item.title}
                  </span>
                  <span style={{
                    fontSize: 12, color: COLOR.textTertiary,
                    whiteSpace: "nowrap", flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {item.date}
                  </span>
                  <span style={{
                    fontSize: 14, color: COLOR.gold, fontWeight: 500,
                    flexShrink: 0,
                  }}>
                    {"\u2192"}
                  </span>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MARKET OVERVIEW (HOME)
// ═══════════════════════════════════════════════════════════

function MarketOverview({ onNavigate, persona, isUnlocked, onRequestUnlock }) {
  return (
    <div>
      {/* Layer 1 — "The Answer" */}
      <HeroBlock persona={persona} isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock} />

      {/* Layer 2 — Credits */}
      <NextMoveSection persona={persona} onNavigate={onNavigate} isUnlocked={isUnlocked} onRequestUnlock={onRequestUnlock} />

      {/* Layer 3a — Key Deadlines Timeline */}
      <DeadlinesTimeline persona={persona} />

      {/* Layer 3b — Platform CTA (after deadlines for maximum urgency context) */}
      <PlatformBridgeCTA persona={persona} />

      {/* Layer 4 — Market Intelligence Feed */}
      <IntelFeed persona={persona} onNavigate={onNavigate} />

      {/* Disclaimer */}
      <div style={{
        padding: "12px 16px",
        background: COLOR.bgSubtle, borderRadius: 8, border: `1px solid ${COLOR.borderSubtle}`,
      }}>
        <p style={{ fontSize: 10, color: COLOR.textMuted, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: COLOR.textTertiary }}>Disclaimer:</strong> CreditPulse is educational only. Not legal, tax, or investment advice. Data sourced from IRA/OBBBA statutory text, IRS/Treasury guidance, and Crux Climate market reports including Crux Climate, &ldquo;The State of Clean Energy Finance: 2025 Market Intelligence Report&rdquo; (Feb 2026) &mdash; based on ~$55B in TTC transactions representing ~80% of market activity. Last updated {LAST_UPDATED}. Consult qualified advisors before transacting.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// AI CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════

function ctxFor(key) {
  const c = CREDITS[key];
  if (!c) return "";
  const parts = [];
  parts.push(`CREDIT: ${c.sec} — ${c.name}`);
  parts.push(`Type: ${c.type} | Status: ${c.status} | Risk: ${c.risk}`);
  parts.push(`Tagline: ${c.tagline}`);
  parts.push(`Pricing: ${c.pricing} (${c.pricingCtx})`);
  if (c.pricingDetail?.type === "ig_split") {
    parts.push(`IG Pricing: ${c.pricingDetail.ig.label} | Non-IG: ${c.pricingDetail.nonIg.label} | Spread: ${c.pricingDetail.spread}`);
  }
  parts.push(`Market Share: ${c.share} | Timeline: ${c.timeline}`);
  if (c.howItWorks) {
    parts.push(`Eligible: ${c.howItWorks.eligible?.join("; ")}`);
    if (c.howItWorks.valueTable) {
      parts.push(`Value Table: ${c.howItWorks.valueTable.map(r => `${r[0]}: ${r[1]}`).join("; ")}`);
    }
    parts.push(`Transferability: ${c.howItWorks.transferability}`);
    parts.push(`Duration: ${c.howItWorks.duration}`);
  }
  if (c.dates) {
    parts.push(`Key Dates: ${c.dates.map(d => `${d.d}: ${d.e}`).join("; ")}`);
  }
  if (c.risks) {
    parts.push(`Risk Summary: ${c.risks.summary}`);
    parts.push(`Underwriting Risks: ${c.risks.underwriting.map(r => `${r.text} (${r.severity})`).join("; ")}`);
    parts.push(`Mitigable: ${c.risks.mitigable.map(r => `${r.text} (${r.action})`).join("; ")}`);
    parts.push(`Uncertain: ${c.risks.uncertain.join("; ")}`);
  }
  if (c.guidance) {
    parts.push(`Guidance Status: ${c.guidance.status}`);
    parts.push(`Open Questions: ${c.guidance.open.join("; ")}`);
  }
  parts.push(`FEOC: ${c.feoc}`);
  parts.push(`Bottom Line: ${c.bottomLine?.join("; ")}`);
  return parts.join("\n");
}

function ctxAll() {
  const keys = Object.keys(CREDITS);
  const all = keys.map(k => ctxFor(k)).join("\n---\n");
  const other = OTHER_CREDITS.map(c => `${c.sec} ${c.name} (${c.type}) — ${c.note}`).join("\n");
  const term = TERMINATED.map(c => `${c.sec} ${c.name} — terminated ${c.date}`).join("\n");
  return all + "\nMARKET 2025: $63B total tax credit monetization (+27% YoY). Transfer market ~$42B (+48%). Tax equity $36.6B (+22%). ~25% of F1000 buying credits. 170 GW wind+solar safe-harbored. $8-10B unsold 2025 credits in 2026. Battery costs $108/kWh. 19 GW storage deployed (+72% YoY). Crux forecasts pricing rebound for solar ITC and §45X in 2026. Market increasingly selective — sponsor quality and project readiness differentiate access to capital. Hybrid TE structures 68% of commitments. Tech-neutral credits trading $0.01-0.02 below legacy.";
}

// ═══════════════════════════════════════════════════════════
// AI SIDEBAR
// ═══════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are CreditPulse, an expert assistant specializing in U.S. clean energy tax credits under the Inflation Reduction Act (IRA), the One Big Beautiful Bill Act (OBBBA), and related legislation.

Your role:
- Answer questions about clean energy tax credit eligibility, structure, pricing, timelines, and risk
- Draw ONLY from the curated data provided below — do not speculate or use outside knowledge
- Be specific: cite section numbers (§45X, §48E, §45Z, etc.), dollar amounts, percentages, and dates whenever possible
- Acknowledge when a question falls outside your curated data rather than guessing

Response style:
- Lead with a direct answer in 1-2 sentences
- Follow with supporting detail organized by relevance
- Use headers and bullet points for multi-part answers
- Keep answers 150-300 words unless more depth is needed
- Write in plain English — avoid jargon unless the user uses it first

Tone: Confident but precise — like a knowledgeable analyst briefing a corporate tax team.

Constraints:
- Never provide legal or tax advice — frame as informational
- Note when information may have changed since the data was last updated
- If a question is ambiguous, state your interpretation before answering

DATA:
`;

// Simple markdown-like text rendering (no react-markdown dependency)
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h5 key={i} style={{ fontSize: 13, fontWeight: 700, color: COLOR.text, margin: "12px 0 4px" }}>
          {line.slice(4)}
        </h5>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h4 key={i} style={{ fontSize: 14, fontWeight: 700, color: COLOR.text, margin: "14px 0 6px" }}>
          {line.slice(3)}
        </h4>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h3 key={i} style={{ fontSize: 15, fontWeight: 700, color: COLOR.text, margin: "16px 0 8px" }}>
          {line.slice(2)}
        </h3>
      );
    }
    // Bullet points
    else if (line.match(/^[\-\*]\s/)) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 4 }}>
          <span style={{ color: COLOR.gold, flexShrink: 0 }}>·</span>
          <span style={{ fontSize: 13, color: COLOR.text, lineHeight: 1.6 }}>
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    }
    // Empty line
    else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 6 }} />);
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={i} style={{ fontSize: 13, color: COLOR.text, lineHeight: 1.7, margin: "0 0 8px" }}>
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }
  return elements;
}

function renderInline(text) {
  // Handle **bold** and *italic*
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
      }
      parts.push(<strong key={key++} style={{ fontWeight: 700, color: COLOR.text }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }
  return parts;
}

function AskSidebar({ ctx, open, onClose, currentView }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  function ask() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    setError("");

    let accumulated = "";

    fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + ctx,
        messages: [{ role: "user", content: query }]
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(t => {
          let parsed;
          try { parsed = JSON.parse(t); } catch (e) { parsed = null; }
          throw new Error((parsed?.error?.message) || `Request failed (${res.status})`);
        });
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      function read() {
        return reader.read().then(result => {
          if (result.done) { setLoading(false); return; }
          buf += decoder.decode(result.value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const payload = trimmed.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                accumulated += evt.delta.text;
                setAnswer(accumulated);
              }
              if (evt.type === "message_stop") setLoading(false);
              if (evt.type === "error") {
                setError(evt.error?.message || "An error occurred.");
                setLoading(false);
                return;
              }
            } catch (e) { /* skip non-JSON lines */ }
          }

          if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
          return read();
        });
      }
      return read();
    })
    .catch(e => {
      setError(e.message || "Unable to connect.");
      setLoading(false);
    });
  }

  const creditLabel = currentView !== "home" && CREDITS[currentView]
    ? CREDITS[currentView].sec
    : null;

  const suggestions = currentView !== "home" && CREDITS[currentView]
    ? [
        `What are the key risks for ${CREDITS[currentView].sec} buyers?`,
        `How does ${CREDITS[currentView].sec} pricing compare to other credits?`,
        `What deadlines should I know about for ${CREDITS[currentView].sec}?`,
      ]
    : [
        "What credits can I still claim for solar projects?",
        "Which credits have the best pricing for buyers right now?",
        "What are the biggest risks in the transfer market?",
      ];

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.2)", backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            zIndex: 9998, transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Sidebar panel */}
      <div className="cp-sidebar" style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 420,
        background: COLOR.card, zIndex: 9999,
        display: "flex", flexDirection: "column",
        borderLeft: `1px solid ${COLOR.border}`,
        boxShadow: open ? `-16px 0 48px rgba(0,0,0,0.10)` : "none",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 22px", borderBottom: `1px solid ${COLOR.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: COLOR.gold, boxShadow: `0 0 8px ${COLOR.gold}60`,
            }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: COLOR.text }}>
              Ask CreditPulse
            </span>
            {creditLabel && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 4,
                fontFamily: FONT.mono, fontWeight: 700,
                background: COLOR.goldBg, color: COLOR.gold,
                border: `1px solid ${COLOR.goldBorder}`,
              }}>
                {creditLabel}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: COLOR.bgSubtle, border: `1px solid ${COLOR.border}`,
              borderRadius: 6, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18, color: COLOR.textTertiary,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = COLOR.active; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLOR.bgSubtle; }}
          >
            ×
          </button>
        </div>

        {/* Content area */}
        <div ref={contentRef} style={{
          flex: 1, overflowY: "auto", padding: "20px 22px",
        }}>
          {/* Answer */}
          {answer && (
            <div style={{
              padding: "16px 18px", background: COLOR.bgSubtle, borderRadius: 10,
              marginBottom: 16, borderLeft: `3px solid ${COLOR.gold}`,
              border: `1px solid ${COLOR.borderSubtle}`,
              borderLeftWidth: 3, borderLeftColor: COLOR.gold,
            }}>
              {renderMarkdown(answer)}
            </div>
          )}

          {/* Loading */}
          {loading && !answer && (
            <div style={{
              padding: "16px 18px", background: COLOR.bgSubtle, borderRadius: 10,
              marginBottom: 16, borderLeft: `3px solid ${COLOR.gold}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: COLOR.gold, animation: "pulse 1.2s infinite",
              }} />
              <span style={{ fontSize: 13, color: COLOR.textTertiary }}>Thinking...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: "14px 18px", background: COLOR.redBg, borderRadius: 10,
              marginBottom: 16, borderLeft: `3px solid ${COLOR.red}`,
            }}>
              <p style={{ fontSize: 13, color: COLOR.red, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Empty state — suggestions */}
          {!answer && !error && !loading && (
            <div>
              <p style={{
                fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.6,
                margin: "0 0 18px",
              }}>
                {creditLabel
                  ? `Ask anything about ${creditLabel} — eligibility, pricing, risks, timelines, or how it compares to other credits.`
                  : "Ask anything about clean energy tax credits, market pricing, risk profiles, or regulatory timelines."
                }
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    style={{
                      background: COLOR.bgSubtle, border: `1px solid ${COLOR.border}`,
                      borderRadius: 8, padding: "11px 16px", textAlign: "left",
                      cursor: "pointer", fontSize: 13, color: COLOR.textSecondary,
                      fontFamily: FONT.body, transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLOR.goldBorder; e.currentTarget.style.color = COLOR.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLOR.border; e.currentTarget.style.color = COLOR.textSecondary; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{
          padding: "14px 22px 12px", borderTop: `1px solid ${COLOR.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") ask(); }}
              placeholder="Ask a question..."
              disabled={loading}
              style={{
                flex: 1, background: COLOR.bgSubtle, border: `1px solid ${COLOR.border}`,
                borderRadius: 8, padding: "11px 14px", color: COLOR.text, fontSize: 13,
                outline: "none", fontFamily: FONT.body,
                opacity: loading ? 0.5 : 1,
                transition: "border-color 0.15s",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = COLOR.goldBorder; }}
              onBlur={e => { e.currentTarget.style.borderColor = COLOR.border; }}
            />
            <button
              onClick={ask}
              disabled={loading}
              style={{
                background: loading ? COLOR.border : COLOR.gold,
                color: "#fff", border: "none", borderRadius: 8,
                padding: "11px 18px", fontWeight: 700, fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: FONT.body, transition: "background 0.15s",
              }}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>
          <div style={{ fontSize: 10, color: COLOR.textMuted }}>
            Powered by Claude · Curated data only · Not legal advice
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════

// Hash routing helpers
function viewToHash(v) {
  if (v === "home") return "#/";
  if (v === "feocCheck") return "#/feoc";
  if (v.startsWith("feocCheck:")) return "#/feoc/" + v.split(":")[1];
  return "#/credit/" + v.toLowerCase();
}
function hashToView(hash) {
  if (!hash || hash === "#/" || hash === "#") return "home";
  if (hash === "#/feoc") return "feocCheck";
  if (hash.startsWith("#/feoc/")) return "feocCheck:" + hash.slice(7).toUpperCase();
  if (hash.startsWith("#/credit/")) return hash.slice(9).toUpperCase();
  return "home";
}

export default function CreditPulse() {
  const [view, setView] = useState(() => hashToView(window.location.hash));
  const [fade, setFade] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState(() => {
    try {
      const stored = localStorage.getItem("cp-persona");
      // Migrate old "seller" persona to null (force re-selection with new 4-persona system)
      if (stored === "seller") {
        localStorage.removeItem("cp-persona");
        return null;
      }
      return stored || null;
    } catch { return null; }
  });
  const ref = useRef(null);

  // Content gating state — persisted in localStorage so unlocked sessions survive
  // refreshes, persona switches, and deep-dive navigation
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try { return localStorage.getItem("creditpulse_unlocked") === "true"; } catch { return false; }
  });

  // PMM rationale: Fire-and-forget POST to serverless function on unlock. In production
  // this would feed a CRM (HubSpot, Salesforce) or email platform (Mailchimp, Customer.io).
  // For the portfolio piece, it demonstrates the capture mechanic exists.
  function unlockContent(email) {
    setIsUnlocked(true);
    try { localStorage.setItem("creditpulse_unlocked", "true"); } catch {}
    fetch("/.netlify/functions/capture-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, persona, source: view, timestamp: new Date().toISOString() }),
    }).catch(() => {});
  }

  // Sync hash → view on browser back/forward
  useEffect(() => {
    function onHashChange() {
      const v = hashToView(window.location.hash);
      setView(v);
      setFade(true);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function selectPersona(p) {
    setPersona(p);
    try { localStorage.setItem("cp-persona", p); } catch {}
    if (ref.current) ref.current.scrollTo({ top: 0 });
  }

  function nav(v) {
    setFade(false);
    setTimeout(() => {
      setView(v);
      window.location.hash = viewToHash(v);
      setFade(true);
      if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }

  const ctx = view === "home" ? ctxAll() :
              view === "feocCheck" || view.startsWith("feocCheck:") ? ctxAll() + "\n\nThe user is currently using the FEOC Compliance Check tool. They may have questions about Prohibited Foreign Entities (PFE), the MACR (Material Assistance Cost Ratio) test, safe harbor tables, supplier certifications, or the foreign entity content threshold calculations. Help them understand the compliance requirements for their specific credit and technology." :
              ctxFor(view);

  return (
    <div ref={ref} style={{
      background: COLOR.bg, minHeight: "100vh",
      fontFamily: FONT.body,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 14px; }
        body { background: ${COLOR.bg}; }
        ::placeholder { color: ${COLOR.textMuted}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLOR.border}; border-radius: 3px; }
        ::selection { background: ${COLOR.gold}30; color: ${COLOR.text}; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes gateOverlayIn { from { opacity: 0; transform: translate(-50%,-50%) scale(0.95); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        /* Responsive */
        @media (max-width: 768px) {
          .cp-container { padding: 20px 16px 60px !important; }
          .cp-credit-grid { grid-template-columns: 1fr !important; }
          .cp-persona-grid { grid-template-columns: 1fr !important; }
          .cp-two-col { grid-template-columns: 1fr !important; }
          .cp-three-col { grid-template-columns: 1fr !important; }
          .cp-hero-grid { grid-template-columns: 1fr !important; }
          .cp-hero-stats { grid-template-columns: 1fr !important; }
          .cp-tabs { flex-wrap: wrap; }
          .cp-tabs button { flex: none !important; }
          .cp-sidebar { width: 100% !important; }
          .cp-headline-pills { flex-direction: column; }
          .cp-tagline { display: none; }
          .cp-sticky-nav { overflow-x: auto; }
          .cp-comparison-table { font-size: 11px; }
          .cp-comparison-table th, .cp-comparison-table td { padding: 6px 6px !important; }
          .cp-deep-header-sec { font-size: 28px !important; }
          .cp-deep-header-name { font-size: 24px !important; }
          .cp-modal-inner { max-width: 100% !important; margin: 8px; }
          .cp-modal-body { padding: 20px 20px 24px !important; }
          .cp-modal-header { padding: 18px 20px 14px !important; }
          .cp-other-row { grid-template-columns: 60px 1fr !important; }
          .cp-other-status { display: none; }
          .cp-metric-strip { grid-template-columns: 1fr !important; }
          .feoc-options { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .cp-container { padding: 16px 12px 50px !important; }
          .cp-mini-stats { grid-template-columns: 1fr 1fr 1fr !important; }
          .cp-editorial { padding: 20px 18px !important; }
          .cp-editorial h2 { font-size: 24px !important; }
          .cp-editorial p { font-size: 14px !important; }
          .cp-section-heading { font-size: 22px !important; }
        }
      `}</style>

      {/* Landing screen — shown when no persona is selected */}
      {persona === null ? (
        <PersonaLandingScreen onSelect={selectPersona} />
      ) : (<>
        {/* Top bar — branding + attribution (not sticky) */}
        <div style={{
          maxWidth: 980, margin: "0 auto", padding: "14px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: `1px solid ${COLOR.border}`,
        }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10,
              cursor: view !== "home" ? "pointer" : "default",
            }}
            onClick={view !== "home" ? () => nav("home") : undefined}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: `linear-gradient(135deg, ${COLOR.gold}, ${COLOR.goldDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
            </div>
            <span style={{
              fontSize: 15, fontWeight: 700, color: COLOR.text,
              letterSpacing: "0.06em",
            }}>
              CREDITPULSE
            </span>
            <span className="cp-tagline" style={{
              fontSize: 11, color: COLOR.textTertiary, fontWeight: 400,
              marginLeft: 4,
            }}>
              Clean energy tax credit intelligence
            </span>
          </div>
          <span style={{ fontSize: 11, color: COLOR.textTertiary }}>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/jaredhutchinson/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: COLOR.textSecondary, textDecoration: "none",
                borderBottom: `1px solid ${COLOR.border}`, fontWeight: 500,
              }}
            >
              Jared Hutchinson
            </a>
          </span>
        </div>

        {/* Sticky nav bar — persona selector + section anchor links */}
        {view === "home" && (
          <div className="cp-sticky-nav" style={{
            position: "sticky", top: 0, zIndex: 100,
            background: "rgba(250, 250, 248, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${COLOR.border}`,
          }}>
            <div style={{
              maxWidth: 980, margin: "0 auto", padding: "0 28px",
              display: "flex", alignItems: "center", gap: 0,
              height: 48,
            }}>
              {persona !== "generic" && (
                <PersonaIndicator persona={persona} onSelect={selectPersona} />
              )}
              <span style={{ color: COLOR.textTertiary, margin: "0 12px", fontSize: 12 }}>{"\u00B7"}</span>
              {[
                { label: "Market Snapshot", id: "hero" },
                { label: "Credits", id: "credits" },
                { label: "Deadlines", id: "deadlines" },
                { label: "Intelligence", id: "intelligence" },
              ].map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => {
                    const el = document.getElementById(`cp-section-${link.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: FONT.body, fontSize: 13, fontWeight: 400,
                    color: COLOR.textTertiary,
                    padding: "12px 14px",
                    borderBottom: "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = COLOR.text;
                    e.currentTarget.style.borderBottomColor = COLOR.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLOR.textTertiary;
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="cp-container" style={{
          maxWidth: 980, margin: "0 auto", padding: "32px 28px 80px",
          opacity: fade ? 1 : 0, transition: "opacity 0.25s ease",
        }}>
          {/* Content */}
          {view === "home" ? (
            <MarketOverview onNavigate={nav} persona={persona} isUnlocked={isUnlocked} onRequestUnlock={unlockContent} />
          ) : view === "feocCheck" || view.startsWith("feocCheck:") ? (
            <FEOCDecisionTree
              onBack={() => nav("home")}
              onNavigate={nav}
              preselectedCredit={view.includes(":") ? view.split(":")[1] : null}
            />
          ) : (
            <DeepDive creditKey={view} onBack={() => nav("home")} onNavigate={nav} persona={persona} isUnlocked={isUnlocked} onRequestUnlock={unlockContent} />
          )}
        </div>

        {/* AI Sidebar — rendered outside main content container */}
        <AskSidebar ctx={ctx} open={sidebarOpen} onClose={() => setSidebarOpen(false)} currentView={view} />
      </>)}
    </div>
  );
}
