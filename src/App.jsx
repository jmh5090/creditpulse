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

// Color System — deep navy authority with warm gold accent
const COLOR = {
  // Surfaces
  bg: "#0C1117",
  bgSubtle: "#111820",
  card: "#161D27",
  cardHover: "#1A2332",
  cardElevated: "#1E2738",
  
  // Borders
  border: "#1E2A3A",
  borderSubtle: "#162030",
  borderHover: "#2A3A50",
  
  // Text
  text: "#E8ECF1",
  textSecondary: "#8A95A5",
  textTertiary: "#5A6577",
  textMuted: "#3D4A5C",
  
  // Accent
  gold: "#D4A843",
  goldDim: "#A68432",
  goldBg: "rgba(212,168,67,0.08)",
  goldBorder: "rgba(212,168,67,0.20)",
  
  // Status
  green: "#34D399",
  greenBg: "rgba(52,211,153,0.10)",
  greenBorder: "rgba(52,211,153,0.25)",
  amber: "#F59E0B",
  amberBg: "rgba(245,158,11,0.10)",
  amberBorder: "rgba(245,158,11,0.25)",
  red: "#EF4444",
  redBg: "rgba(239,68,68,0.10)",
  redBorder: "rgba(239,68,68,0.25)",
  blue: "#60A5FA",
  blueBg: "rgba(96,165,250,0.10)",
  
  // Interactive
  hover: "rgba(255,255,255,0.03)",
  active: "rgba(255,255,255,0.06)",
};

// Typography
const FONT = {
  display: "'Instrument Serif', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', monospace",
};

// Spacing scale
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

// ═══════════════════════════════════════════════════════════
// DATA (real, from current App.jsx)
// ═══════════════════════════════════════════════════════════

const LAST_UPDATED = "February 2026";

const STATUS_MAP = {
  expanded: { color: COLOR.green, bg: COLOR.greenBg, border: COLOR.greenBorder, label: "EXPANDED" },
  active: { color: COLOR.textSecondary, bg: COLOR.active, border: COLOR.borderHover, label: "ACTIVE" },
  modified: { color: COLOR.amber, bg: COLOR.amberBg, border: COLOR.amberBorder, label: "MODIFIED" },
  sunsetting: { color: COLOR.red, bg: COLOR.redBg, border: COLOR.redBorder, label: "SUNSETTING" },
};

const RISK_MAP = {
  Low: { color: COLOR.green, level: 1, label: "LOW" },
  Moderate: { color: COLOR.amber, level: 2, label: "MODERATE" },
  Elevated: { color: COLOR.red, level: 3, label: "ELEVATED" },
};

const CREDITS = {
  "45X": {
    sec: "§45X", name: "Advanced Manufacturing Production", type: "PTC",
    status: "modified",
    tagline: "Per-unit payment to U.S. clean energy manufacturers",
    pricing: "93.5–96¢", pricingCtx: "per $1",
    pricingDetail: {
      type: "ig_split",
      ig: { low: 93, high: 96, label: "93–96¢" },
      nonIg: { low: 90, high: 93, label: "90–93¢" },
      spread: "~3¢",
      source: "Crux 2025 market data",
      note: "Most actively traded credit. 30% of listings get bids on day one."
    },
    share: "27%", shareCtx: "of transfer market",
    timeline: "8–16 wks", timelineCtx: "listing → close",
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
    pricing: "~89¢", pricingCtx: "per $1",
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
    tagline: "The only credit OBBBA expanded — pays per gallon by cleanliness",
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
    tagline: "Per-ton payment for capturing and permanently storing CO₂",
    pricing: "85–90¢", pricingCtx: "per $1 (larger discount)",
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

const TIMELINE = [
  { d: "Jul 4, 2025", e: "OBBBA signed into law", past: true },
  { d: "Sep 30, 2025", e: "EV credits terminated", past: true },
  { d: "Dec 31, 2025", e: "Home energy credits ended; FEOC rules took effect", past: true },
  { d: "Feb 2026", e: "Interim FEOC guidance & proposed §45Z rules", past: true, type: "guidance" },
  { d: "May 28, 2026", e: "Public hearing on §45Z regulations", type: "guidance", credits: ["45Z"] },
  { d: "Jun 30, 2026", e: "§30C, §45L, §179D terminate", next: true },
  { d: "Jul 4, 2026", e: "Hard deadline: begin construction for wind/solar", urgent: true, credits: ["48E"] },
  { d: "Late 2026", e: "Final FEOC rules expected", type: "guidance", credits: ["45X", "48E"] },
  { d: "Dec 31, 2026", e: "Domestic content requirement rises to 55%", credits: ["48E"] },
  { d: "Dec 31, 2027", e: "Wind/solar operational deadline; §45X wind credits end", credits: ["48E", "45X"] },
  { d: "Dec 31, 2029", e: "§45Z and §45X full-value credits expire", credits: ["45Z", "45X"] },
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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

// Regulatory monitor — slim clickable row (modal handled by parent)
function RegCardRow({ item, onClick, isLast }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "12px 8px",
        margin: "0 -8px",
        borderBottom: isLast ? "none" : `1px solid ${COLOR.borderSubtle}`,
        cursor: "pointer",
        borderRadius: 6,
        background: hov ? COLOR.hover : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <SeverityDot severity={item.severity} />
        <span style={{ fontSize: 11, color: COLOR.textTertiary, fontFamily: FONT.mono }}>{item.date}</span>
        <span style={{ fontSize: 10, color: COLOR.textMuted }}>·</span>
        <span style={{ fontSize: 11, color: COLOR.textTertiary }}>{item.source}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 3 }}>
          {item.credits.map((cr, j) => (
            <span key={j} style={{
              fontSize: 9, padding: "1px 5px", borderRadius: 3,
              fontFamily: FONT.mono, fontWeight: 600,
              background: COLOR.goldBg, color: COLOR.goldDim,
              border: `1px solid ${COLOR.goldBorder}`,
            }}>
              §{cr}
            </span>
          ))}
        </div>
      </div>
      <div style={{
        fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.45,
        fontWeight: 500,
      }}>
        {item.title}
      </div>
      <span style={{
        fontSize: 11, color: hov ? COLOR.gold : COLOR.textTertiary, fontWeight: 500,
        marginTop: 5, display: "inline-block",
        transition: "color 0.15s",
      }}>
        View details →
      </span>
    </div>
  );
}

// Regulatory detail modal — rendered at top level, outside all grids/transforms
function RegModal({ item, onClose, onNavigate }) {
  const [impactTab, setImpactTab] = useState("enterprise");

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
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
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
          boxShadow: "0 32px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
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
function MetricCard({ label, value, sublabel, style = {} }) {
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
    </div>
  );
}

// Credit card — clean, scannable, no jargon
function CreditCard({ credit, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const c = credit;

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
          boxShadow: hov ? "0 8px 32px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.15)",
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
              color: COLOR.red, background: COLOR.redBg, border: `1px solid ${COLOR.redBorder}`,
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

        {/* Tagline */}
        <p style={{
          fontSize: 14, color: COLOR.textSecondary, lineHeight: 1.55,
          margin: "0 0 16px",
        }}>
          {c.tagline}
        </p>

        {/* Mini stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1, background: COLOR.borderSubtle, borderRadius: 8, overflow: "hidden",
        }}>
          {[
            [c.pricing, "Pricing"],
            [c.share, "Mkt Share"],
            [c.timeline, "Timeline"],
          ].map(([val, label], i) => (
            <div key={i} style={{
              background: COLOR.bgSubtle, padding: "10px 8px", textAlign: "center",
            }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: COLOR.text }}>
                {val}
              </div>
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
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// Severity dot for news items
function SeverityDot({ severity }) {
  const colors = { high: COLOR.red, medium: COLOR.amber, low: COLOR.textTertiary };
  return (
    <div style={{
      width: 7, height: 7, borderRadius: "50%",
      background: colors[severity] || COLOR.textTertiary,
      flexShrink: 0,
    }} />
  );
}

// Timeline visual item
function TimelineItem({ item, isLast, onNavigate }) {
  const isPast = item.past;
  const isUrgent = item.urgent;
  const isNext = item.next;
  const isGuidance = item.type === "guidance" && !isPast;

  let dotColor = COLOR.textMuted;
  if (isUrgent) dotColor = COLOR.red;
  else if (isNext) dotColor = COLOR.text;
  else if (isGuidance) dotColor = COLOR.amber;
  else if (isPast) dotColor = COLOR.textMuted;

  return (
    <div style={{ display: "flex", gap: 14, paddingBottom: isLast ? 0 : 16 }}>
      {/* Dot + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 12, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10,
          borderRadius: isGuidance ? 2 : "50%",
          background: dotColor,
          border: isNext ? `2px solid ${COLOR.text}` : "none",
          boxShadow: isUrgent ? `0 0 8px ${COLOR.red}40` : "none",
          flexShrink: 0,
        }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, background: COLOR.border, marginTop: 4 }} />
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
          <span style={{
            fontFamily: FONT.mono, fontSize: 11,
            color: isPast ? COLOR.textMuted : isUrgent ? COLOR.red : COLOR.textSecondary,
            fontWeight: isUrgent || isNext ? 700 : 400,
            textDecoration: isPast ? "line-through" : "none",
          }}>
            {item.d}
          </span>
          {isNext && (
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 3,
              background: COLOR.text, color: COLOR.bg, fontWeight: 700, letterSpacing: "0.05em",
            }}>NEXT</span>
          )}
          {isGuidance && (
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 3,
              background: COLOR.amberBg, color: COLOR.amber, fontWeight: 700, border: `1px solid ${COLOR.amberBorder}`,
            }}>GUIDANCE</span>
          )}
          {isUrgent && (
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 3,
              background: COLOR.redBg, color: COLOR.red, fontWeight: 700, border: `1px solid ${COLOR.redBorder}`,
            }}>URGENT</span>
          )}
        </div>
        <div style={{
          fontSize: 14, color: isPast ? COLOR.textMuted : COLOR.textSecondary, lineHeight: 1.45,
        }}>
          {item.e}
        </div>
        {item.credits && (
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {item.credits.map((cr, j) => {
              const hasDeep = !!CREDITS[cr];
              return (
                <span
                  key={j}
                  onClick={hasDeep && onNavigate ? () => onNavigate(cr) : undefined}
                  style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 3,
                    fontFamily: FONT.mono, fontWeight: 600,
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
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEEP DIVE PAGE
// ═══════════════════════════════════════════════════════════

function DeepDive({ creditKey, onBack }) {
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
      <FadeIn delay={80}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
          background: COLOR.border, borderRadius: 10, overflow: "hidden", marginBottom: 28,
        }}>
          <MetricCard label="Pricing" value={c.pricing} sublabel={c.pricingCtx} />
          <MetricCard label="Market Share" value={c.share} sublabel={c.shareCtx} />
          <MetricCard label="Deal Timeline" value={c.timeline} sublabel={c.timelineCtx} />
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
            <div style={{
              background: COLOR.card, border: `1px solid ${COLOR.border}`,
              borderRadius: 10, padding: "22px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.gold, letterSpacing: "0.08em", marginBottom: 18 }}>
                CREDIT PRICING
              </div>
              <PricingChart detail={c.pricingDetail} />
            </div>

            {/* Cross-credit comparison */}
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
                            {val}
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
// MARKET OVERVIEW (HOME)
// ═══════════════════════════════════════════════════════════

function MarketOverview({ onNavigate }) {
  const upcoming = TIMELINE.filter(t => !t.past);
  const [activeRegItem, setActiveRegItem] = useState(null);

  return (
    <div>
      {/* Regulatory modal — rendered here, outside all grids and FadeIn transforms */}
      {activeRegItem && (
        <RegModal
          item={activeRegItem}
          onClose={() => setActiveRegItem(null)}
          onNavigate={onNavigate}
        />
      )}
      {/* Editorial headline */}
      <FadeIn>
        <div className="cp-editorial" style={{
          marginBottom: 36,
          padding: "28px 30px",
          background: COLOR.card,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 12,
          borderLeft: `3px solid ${COLOR.gold}`,
        }}>
          <h2 style={{
            fontFamily: FONT.display, fontSize: 30, fontWeight: 400,
            color: COLOR.text, margin: "0 0 12px", lineHeight: 1.35,
          }}>
            Here's the latest with clean energy tax credits.
          </h2>
          <p style={{
            fontSize: 15, color: COLOR.textSecondary, lineHeight: 1.65,
            margin: 0, maxWidth: 760,
          }}>
            Credit pricing sits at 12-month lows as OBBBA's tax changes thin the buyer pool — 
            creating an opportunity window for companies that still have federal tax appetite.
            Treasury is still releasing guidance that will define clean energy finance for years.
            Key upcoming dates include:
          </p>
          <div className="cp-headline-pills" style={{
            display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap",
          }}>
            {[
              { label: "Jul 4, 2026", note: "Wind/solar deadline", color: COLOR.red },
              { label: "May 28, 2026", note: "§45Z hearing", color: COLOR.amber },
              { label: "Late 2026", note: "Final FEOC rules", color: COLOR.gold },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px",
                background: `${item.color}10`,
                border: `1px solid ${item.color}30`,
                borderRadius: 6,
              }}>
                <span style={{
                  fontFamily: FONT.mono, fontSize: 12, fontWeight: 700,
                  color: item.color,
                }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 12, color: COLOR.textSecondary }}>
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Credit Landscape ── */}
      <FadeIn delay={100}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <h2 className="cp-section-heading" style={{
            fontFamily: FONT.display, fontSize: 28, fontWeight: 400,
            color: COLOR.text, margin: 0,
          }}>
            Credit Landscape
          </h2>
          <span style={{ fontSize: 12, color: COLOR.textTertiary }}>
            {Object.keys(CREDITS).length + OTHER_CREDITS.length + TERMINATED.length} credits tracked
          </span>
        </div>
      </FadeIn>

      {/* Deep dive credits — prominent cards */}
      <div className="cp-credit-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14,
        marginBottom: 20,
      }}>
        {Object.entries(CREDITS).map(([key, credit], i) => (
          <CreditCard
            key={key}
            credit={credit}
            onClick={() => onNavigate(key)}
            delay={150 + i * 80}
          />
        ))}
      </div>

      {/* Other active credits — compact rows */}
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
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "70px 1fr auto",
              alignItems: "center", gap: 14,
              padding: "12px 20px",
              borderBottom: i < OTHER_CREDITS.length - 1 ? `1px solid ${COLOR.borderSubtle}` : "none",
            }}>
              <span style={{
                fontFamily: FONT.mono, fontSize: 13, fontWeight: 700,
                color: COLOR.gold,
              }}>
                {cr.sec}
              </span>
              <div>
                <span style={{ fontSize: 14, color: COLOR.text, fontWeight: 500 }}>{cr.name}</span>
                <span style={{ fontSize: 13, color: COLOR.textTertiary, marginLeft: 10 }}>{cr.note}</span>
              </div>
              {cr.status && (
                <span style={{
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

      {/* Terminated credits — collapsible */}
      <FadeIn delay={550}>
        <TerminatedSection />
      </FadeIn>

      <div style={{ marginBottom: 48 }} />

      {/* Two-column: Timeline + News */}
      <div className="cp-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }}>
        {/* Timeline */}
        <FadeIn delay={500}>
          <div style={{
            background: COLOR.card, border: `1px solid ${COLOR.border}`,
            borderRadius: 12, padding: "22px",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLOR.gold,
              letterSpacing: "0.08em", marginBottom: 18,
            }}>
              KEY DEADLINES
            </div>
            {upcoming.map((item, i) => (
              <TimelineItem key={i} item={item} isLast={i === upcoming.length - 1} onNavigate={onNavigate} />
            ))}
          </div>
        </FadeIn>

        {/* News */}
        <FadeIn delay={550}>
          <div style={{
            background: COLOR.card, border: `1px solid ${COLOR.border}`,
            borderRadius: 12, padding: "22px",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLOR.gold,
              letterSpacing: "0.08em", marginBottom: 18,
            }}>
              REGULATORY MONITOR
            </div>
            {NEWS.map((item, i) => (
              <RegCardRow key={i} item={item} onClick={() => setActiveRegItem(item)} isLast={i === NEWS.length - 1} />
            ))}
          </div>
        </FadeIn>
      </div>

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
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)",
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
        boxShadow: open ? `-16px 0 60px rgba(0,0,0,0.3)` : "none",
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
                color: COLOR.bg, border: "none", borderRadius: 8,
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

export default function CreditPulse() {
  const [view, setView] = useState("home");
  const [fade, setFade] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ref = useRef(null);

  function nav(v) {
    setFade(false);
    setTimeout(() => {
      setView(v);
      setFade(true);
      if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }

  const ctx = view === "home" ? ctxAll() : ctxFor(view);

  return (
    <div ref={ref} style={{
      background: COLOR.bg, minHeight: "100vh",
      fontFamily: FONT.body,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Serif&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: ${COLOR.textMuted}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLOR.border}; border-radius: 3px; }
        ::selection { background: ${COLOR.gold}30; color: ${COLOR.text}; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        /* Responsive */
        @media (max-width: 768px) {
          .cp-container { padding: 20px 16px 60px !important; }
          .cp-header { flex-direction: column; align-items: flex-start !important; gap: 12px; }
          .cp-header-right { width: 100%; justify-content: space-between !important; }
          .cp-credit-grid { grid-template-columns: 1fr !important; }
          .cp-two-col { grid-template-columns: 1fr !important; }
          .cp-three-col { grid-template-columns: 1fr !important; }
          .cp-tabs { flex-wrap: wrap; }
          .cp-tabs button { flex: none !important; }
          .cp-sidebar { width: 100% !important; }
          .cp-headline-pills { flex-direction: column; }
          .cp-tagline { display: none; }
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

      <div className="cp-container" style={{
        maxWidth: 980, margin: "0 auto", padding: "36px 28px 80px",
        opacity: fade ? 1 : 0, transition: "opacity 0.25s ease",
      }}>
        {/* Header */}
        <div className="cp-header" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingBottom: 18, borderBottom: `1px solid ${COLOR.border}`,
          position: "sticky", top: 0, background: COLOR.bg, zIndex: 100,
          paddingTop: 12, marginBottom: 32,
        }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10,
              cursor: view !== "home" ? "pointer" : "default",
            }}
            onClick={view !== "home" ? () => nav("home") : undefined}
          >
            {/* Logo mark */}
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: `linear-gradient(135deg, ${COLOR.gold}, ${COLOR.goldDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.bg }} />
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
          <div className="cp-header-right" style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: COLOR.gold, color: COLOR.bg, border: "none", borderRadius: 6,
                padding: "7px 14px", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: FONT.body,
                transition: "opacity 0.15s",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLOR.bg, opacity: 0.6 }} />
              Ask AI
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "home" ? (
          <MarketOverview onNavigate={nav} />
        ) : (
          <DeepDive creditKey={view} onBack={() => nav("home")} />
        )}
      </div>

      {/* AI Sidebar — rendered outside main content container */}
      <AskSidebar ctx={ctx} open={sidebarOpen} onClose={() => setSidebarOpen(false)} currentView={view} />
    </div>
  );
}
