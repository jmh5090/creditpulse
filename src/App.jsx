import { useState, useRef } from "react";

/*
  CREDITPULSE v5 — Clean Energy Tax Credit Navigator
  Built by Jared Hutchinson

  UPDATE GUIDE:
  1. NEWS array → add at TOP
  2. TL array → mark past with past:true
  3. C objects → credit deep dives
  4. LAST_UPDATED → changes timestamp everywhere
*/

var LAST_UPDATED = "February 2026";

// Palette
var BG = "#FAFAF7";
var CARD = "#FFFFFF";
var BORDER = "#E8E5DE";
var TXT = "#1A1A1A";
var TXT2 = "#5C5C5C";
var TXT3 = "#8A8A8A";
var GOLD = "#B8860B";
var HOVER = "#F5F3EE";

var STATUS = {
  expanded: { c: "#2E7D32", bg: "#E8F5E9", l: "EXPANDED" },
  active: { c: "#37474F", bg: "#ECEFF1", l: "ACTIVE" },
  modified: { c: "#E65100", bg: "#FFF3E0", l: "MODIFIED" },
  sunsetting: { c: "#BF360C", bg: "#FBE9E7", l: "SUNSETTING" },
  terminated: { c: "#9E9E9E", bg: "#F5F5F5", l: "TERMINATED" }
};

var RISKCOLOR = {
  "None": "#2E7D32",
  "Low": "#37474F",
  "Medium": "#E65100",
  "High": "#BF360C",
  "Variable": "#5C5C5C"
};

// ─── CREDIT DATA ──────────────────────────────────────────
var C = {};

C["45X"] = {
  sec: "§45X",
  name: "Advanced Manufacturing Production Credit",
  type: "PTC",
  st: "modified",
  deep: true,
  one: "Pays U.S. manufacturers per unit of solar panels, batteries, and other clean energy components they produce. Wind components lose eligibility after 2027.",
  hover: [
    "Pricing: 93.5–96¢ per $1 of credit",
    "Market share: 27% of the transfer market",
    "Risk: Low — no recapture, verified production, primary diligence is FEOC supply chain"
  ],
  sum: "If you make solar panels, batteries, inverters, or mine critical minerals in the U.S., this credit pays you a fixed dollar amount for each unit you produce and sell. It's the single most-traded credit in the market and the backbone of America's push to build clean energy supply chains domestically.",
  obbba: "The core credit survived OBBBA mostly intact. The big changes: wind turbine components (blades, towers, nacelles) lose eligibility after 2027, metallurgical coal was added as a new qualifying product through 2029, and new rules restrict credits if your supply chain relies too heavily on companies tied to China, Russia, North Korea, or Iran.",
  how: {
    elig: [
      "Solar components — wafers, cells, modules, polysilicon",
      "Battery components — electrode materials, cells, modules, packs",
      "Inverters — residential through utility-scale",
      "Critical minerals — lithium, nickel, cobalt, and others processed in the U.S.",
      "Wind components — blades, nacelles, towers (but only through 2027)",
      "Metallurgical coal (newly added by OBBBA, through 2029)"
    ],
    val: "A fixed dollar amount per unit produced, set by statute:",
    valTable: [
      ["Solar modules", "$0.07/W(dc)"],
      ["Solar cells", "$0.04/W(dc)"],
      ["PV wafers", "$12 per m²"],
      ["Polysilicon", "$3 per kg"],
      ["Battery cells", "$35 per kWh"],
      ["Battery modules", "$10/kWh (or $45/kWh if no cells claimed)"],
      ["Critical minerals", "10% of production costs"],
      ["Inverters", "$0.02–$0.11/W(ac) depending on size"],
      ["Wind blades", "$2 per W"],
      ["Wind nacelles", "$5 per W"],
      ["Wind towers", "$3 per W"]
    ],
    bonus: "Unlike most other credits, there are no bonus multipliers for prevailing wages, domestic content, or energy communities. The credit value is based entirely on the per-unit schedule above. All production must happen in the U.S.",
    xfer: "Yes — manufacturers can sell their credits directly to other companies (a one-time transfer under §6418). This is one of the most straightforward credits to transfer because it's not tied to a specific project or property.",
    epay: "Yes — qualifying manufacturers can receive a direct cash payment from the government for up to 5 years instead of using the credit against taxes.",
    dur: "Full value from 2023 through 2029, then it phases down: 75% in 2030, 50% in 2031, 25% in 2032, and zero after that. Wind components end earlier — December 31, 2027."
  },
  tl: {
    orig: "Full credit from 2023 through 2029, gradual phaseout 2030–2032, ends after 2032.",
    post: "Main schedule unchanged. Wind components cut off after 12/31/2027. Metallurgical coal added through 12/31/2029. New FEOC rules apply.",
    dates: [
      { d: "12/31/2027", e: "Wind components — last day credits can be claimed", u: true },
      { d: "12/31/2029", e: "Full credit ends for most components" },
      { d: "2030–2032", e: "Credit phases down: 75% → 50% → 25%" },
      { d: "After 2032", e: "Credit ends entirely" }
    ]
  },
  feoc: "Yes — this is a major issue for §45X. Manufacturers must track how much of their raw materials come from companies tied to China, Russia, North Korea, or Iran. If too much of your supply chain involves these entities, you could lose the credit entirely. The government issued interim guidance in February 2026 (Notice 2026-15) with temporary safe harbors, but final rules are still pending.",
  riskScore: { level: "Low", reason: "No recapture. Verified production. Well-established rules. Primary diligence: FEOC supply chain." },
  risks: {
    underwriting: [
      "FEOC supply chain compliance — if your materials trace back to China, Russia, North Korea, or Iran beyond allowed thresholds, the entire credit is at risk.",
      "Unit counting and component classification — the IRS can challenge whether your product qualifies and how you measured output."
    ],
    mitigable: [
      "Documentation and audit trail — maintain detailed production logs and supply chain records from day one.",
      "Third-party supply chain mapping — independent verification of material origins significantly reduces buyer discount."
    ],
    uncertain: [
      "Final FEOC rules are still pending. The interim safe harbors could tighten, potentially disqualifying supply chains that pass today.",
      "How strictly the government will police multi-tier supply chains — the practical enforcement standard is unknown."
    ],
    summary: "No recapture risk (rare among credits). Primary exposure is compliance — specifically, whether your supply chain passes the foreign entity rules. Buyers face minimal counterparty risk because credits are tied to verified production, not project performance."
  },
  stats: {
    pricing: "93.5–96¢",
    pricingNote: "per $1 of credit",
    share: "27%",
    shareNote: "of transfer market",
    timeline: "8–16 wks",
    timelineNote: "listing to close"
  },
  mkt: {
    price: "Well-structured deals: 93.5¢–96¢ on the dollar. Strong demand keeps pricing high.",
    deal: "From under $10M for early-stage manufacturers to $100M+ for large producers.",
    time: "8–16 weeks. 30% of listed credits get bids on day one — fastest of any credit type."
  },
  guid: {
    stat: "Detailed rules finalized November 2024. Interim FEOC guidance February 2026. Final FEOC rules pending.",
    open: [
      "How strictly the government will police complex supply chains",
      "Whether newer technologies will qualify",
      "How much due diligence buyers must do on supply chains"
    ]
  },
  bl: [
    "The most actively traded credit in the market — strong demand, fast execution, clear per-unit economics.",
    "Valuable for U.S. manufacturers of solar, batteries, inverters, and critical minerals through 2029.",
    "Foreign supply chain rules are now the #1 diligence issue.",
    "Wind component manufacturers face an earlier deadline — credits end after 2027.",
    "Both transferable and eligible for direct cash payment from the government."
  ]
};

C["48E"] = {
  sec: "§48E",
  name: "Clean Electricity Investment Credit",
  type: "ITC",
  st: "sunsetting",
  deep: true,
  one: "Covers up to 30%+ of the cost of building clean power plants and energy storage. Wind and solar face a hard deadline. Storage was protected.",
  hover: [
    "Pricing: ~89¢ per $1 of credit",
    "Market share: 26% of credits sold (H1 '25)",
    "Risk: Moderate — recapture is insurable, but PWA/domestic content/FEOC compliance layers require thorough documentation"
  ],
  sum: "If you're building a new power plant that produces zero-emission electricity — or an energy storage facility — this credit can cover 30% or more of your upfront investment. It's technology-neutral: it doesn't matter how you generate the clean power, as long as it's clean.",
  obbba: "OBBBA created winners and losers within this single credit. Wind and solar face an accelerated shutdown — ineligible unless construction starts by July 4, 2026, and the facility is operational by end of 2027. But energy storage was preserved. Fuel cell projects got better terms — a 30% credit regardless of emissions.",
  how: {
    elig: [
      "New zero-emission power plants (any qualifying technology)",
      "Energy storage systems (including standalone battery storage — preserved by OBBBA)",
      "Grid-enhancing equipment tied to eligible projects",
      "Fuel cell systems (expanded by OBBBA — 30% credit regardless of emissions)"
    ],
    val: "A percentage of what you spend building the project:",
    valTable: [
      ["Base rate", "6% of investment"],
      ["With prevailing wage & apprenticeship (PWA)", "30% of investment"],
      ["+ Domestic content bonus", "Up to +10%"],
      ["+ Energy community bonus", "Up to +10%"],
      ["+ Low-income community bonus", "+10% or +20% (under 5 MW)"],
      ["Maximum possible rate", "~70% of investment"]
    ],
    bonus: "The biggest lever is prevailing wage and apprenticeship (PWA) requirements — that takes you from 6% to 30%. PWA means paying workers the local prevailing wage and using registered apprentices for a percentage of labor hours.",
    xfer: "Yes — project owners can sell the credit through a one-time transfer. OBBBA added a restriction: you can't transfer to certain foreign-linked entities.",
    epay: "Yes — available for tax-exempt organizations, governments, tribes, and rural electric cooperatives.",
    dur: "Claimed once when the project starts operating. 5-year recapture period: if you sell or stop using it within 5 years, the government claws back a portion (decreasing 20%/year)."
  },
  beginConstruction: [
    "This is one of the most important — and most confusing — concepts in the credit. For wind and solar projects to qualify, construction must 'begin' by July 4, 2026. But what counts as 'beginning'? The IRS recognizes two safe harbors:",
    "Physical Work Test: You start significant physical work — not just planning or permitting, but actual construction. Ordering custom equipment can count; clearing land or pouring foundations definitely counts.",
    "5% Safe Harbor: You spend at least 5% of the project's total expected cost before the deadline. This is the more commonly used path because it's easier to document.",
    "Once you've 'begun construction,' you generally have four years to finish. For OBBBA's wind/solar sunset, the project must be placed in service by December 31, 2027.",
    "The open question: OBBBA codified these safe harbors specifically for FEOC provisions. Some lawyers are asking whether the same rules apply outside the FEOC context. Treasury hasn't clarified.",
    "Binding contract exception: Projects with a binding written contract executed before July 4, 2025 (OBBBA enactment) are generally grandfathered."
  ],
  tl: {
    orig: "Projects starting construction from 2025 onward, phaseout tied to emissions targets (no earlier than 2032).",
    post: "Wind/solar: dead unless construction starts by 7/4/2026 and operational by 12/31/2027. Storage: preserved through 2034. Other clean tech: full through 2033, then 2-year phasedown. Fuel cells: 30% with no emissions test.",
    dates: [
      { d: "7/4/2026", e: "Deadline to start construction for wind/solar", u: true },
      { d: "12/31/2027", e: "Wind/solar must be operational" },
      { d: "12/31/2033", e: "Other clean tech begins phasing down" },
      { d: "12/31/2035", e: "Credit ends for remaining technologies" }
    ]
  },
  feoc: "Yes — projects starting construction after December 31, 2025, can't receive the credit if they used significant help from foreign entities of concern during construction. Interim guidance issued February 2026. Final rules pending.",
  riskScore: { level: "Moderate", reason: "Recapture risk is real but insurable. Multiple compliance layers (PWA, domestic content, FEOC) require thorough documentation." },
  risks: {
    underwriting: [
      "Recapture — if the project is sold or stops qualifying within 5 years, the IRS claws back a portion of the credit (decreasing 20% per year). This is the defining risk for ITC deals.",
      "Basis risk — the credit is a percentage of project cost. If costs are inflated or misallocated, the credit gets reduced."
    ],
    mitigable: [
      "Recapture insurance — widely available and standard in deals above $10M. Protects the buyer if the project changes hands or use.",
      "Independent cost appraisal — a third-party valuation of the project's basis before closing reduces IRS challenge risk.",
      "PWA compliance documentation — verify the developer's prevailing wage and apprenticeship records before transacting."
    ],
    uncertain: [
      "Whether begin-construction safe harbors apply identically outside the FEOC context. Treasury hasn't clarified.",
      "How hybrid projects (generation + storage + other equipment at one site) will be treated for credit calculation.",
      "Whether FEOC restrictions will conflict with domestic content requirements in practice."
    ],
    summary: "Recapture is the headline risk — but it's well-understood and insurable. The bigger practical concern is making sure the developer's compliance paperwork (PWA, domestic content, FEOC) is airtight, because failures there reduce the credit amount. Counterparty risk varies — experienced developers with track records get better pricing."
  },
  stats: {
    pricing: "~89¢",
    pricingNote: "per $1 of credit",
    share: "26%",
    shareNote: "of credits sold (H1 '25)",
    timeline: "8–14 wks",
    timelineNote: "listing to close"
  },
  mkt: {
    price: "Around 89¢ on the dollar as of Q3 2025. Stable for well-structured projects.",
    deal: "From under $10M for distributed projects to over $100M for utility-scale.",
    time: "8–14 weeks. Faster for repeat developers."
  },
  guid: {
    stat: "Core rules finalized January 2025. Low-income bonus program active. FEOC interim guidance February 2026.",
    open: [
      "How hybrid projects are treated",
      "Whether FEOC rules conflict with domestic content requirements",
      "Whether construction-start rules work the same outside FEOC context"
    ]
  },
  bl: [
    "The go-to credit for new clean power and storage — worth 30%+ of your investment.",
    "Critical split: wind/solar must start construction by July 4, 2026. Storage has years more runway.",
    "Energy storage is the growth story — market share nearly tripled in a year.",
    "Fuel cells got better terms under OBBBA — 30% with fewer strings.",
    "Buyers: focus on recapture protection and developer PWA compliance."
  ]
};

C["45Z"] = {
  sec: "§45Z",
  name: "Clean Fuel Production Credit",
  type: "PTC",
  st: "expanded",
  deep: true,
  one: "The only clean energy credit OBBBA actually made bigger — extended through 2029. Pays fuel producers based on how clean their fuel is.",
  hover: [
    "Pricing: Discount to established credits (rules still proposed)",
    "Market share: Growing — early-stage but high-interest",
    "Risk: Elevated — credit value depends entirely on carbon modeling that hasn't been stress-tested at scale"
  ],
  sum: "This credit pays fuel producers based on a simple principle: the cleaner your fuel, the more you earn per gallon. It replaced a confusing patchwork of older biofuel incentives with one unified framework.",
  obbba: "This is the one IRA energy credit OBBBA actually expanded. Production window extended from 2027 to 2029. SAF bonus cut from $1.75 to $1.00/gal after 2025. Excluding indirect land use change (ILUC) from emissions calculations made corn ethanol and soy biodiesel big winners. Feedstock must come from North America. Government cost estimate jumped from $2.9B to $25.7B.",
  how: {
    elig: [
      "Sustainable aviation fuel (SAF)",
      "Clean transportation fuels — highway, rail, and off-road",
      "Lifecycle emissions below 50 kg CO₂e/mmBTU",
      "Produced in the U.S. and sold to an unrelated buyer"
    ],
    val: "Paid per gallon. Amount scales with how clean the fuel is:",
    valTable: [
      ["Non-SAF fuel (with PWA)", "Up to $1.00/gallon"],
      ["Non-SAF fuel (without PWA)", "Up to $0.20/gallon"],
      ["SAF (after 12/31/2025)", "$1.00/gallon max"],
      ["SAF (before 12/31/2025)", "Up to $1.75/gallon"],
      ["Scaling", "Cleaner fuel = higher % of max rate"]
    ],
    bonus: "Prevailing wage is the big multiplier — takes non-SAF from $0.20 to $1.00/gallon. Beyond that, the upside is performance-based: extremely clean fuels earn close to the max rate.",
    xfer: "Yes — producers can sell credits through one-time transfer based on verified production volumes.",
    epay: "Yes — for tax-exempt organizations. Most commercial producers will use transfers instead.",
    dur: "Fuel produced January 1, 2025 through December 31, 2029. No phasedown — credit simply ends."
  },
  tl: {
    orig: "Credit for fuel produced January 2025 through December 2027.",
    post: "Extended to December 2029. After 2025: SAF premium eliminated, ILUC excluded, feedstock must be North American.",
    dates: [
      { d: "1/1/2025", e: "Credit begins" },
      { d: "12/31/2025", e: "SAF premium expires; technical changes take effect" },
      { d: "5/28/2026", e: "Public hearing on proposed regulations" },
      { d: "12/31/2029", e: "Credit expires", u: true }
    ]
  },
  feoc: "The FEOC restrictions that apply to equipment credits don't directly apply to §45Z. The focus is on carbon scoring, qualifying sales, and feedstock origin (North American after 2025).",
  riskScore: { level: "Elevated", reason: "Rules still proposed. Credit value entirely dependent on carbon modeling that hasn't been stress-tested at scale." },
  risks: {
    underwriting: [
      "Carbon intensity (CI) scoring — your credit value is entirely determined by your fuel's emissions calculation. If the IRS challenges your methodology, inputs, or GREET model assumptions, the credit could be reduced to zero.",
      "Regulatory uncertainty — the rules are still in proposed form. Final regulations could change qualification thresholds, approved methodologies, or verification standards."
    ],
    mitigable: [
      "Use the government's designated 45ZCF-GREET tool and document every modeling input. Deviation from the standard methodology invites scrutiny.",
      "Engage a third-party verifier early — having an independent CI score review before marketing credits builds buyer confidence.",
      "For established fuel types (corn ethanol, soy biodiesel), use published pathway data rather than custom models where possible."
    ],
    uncertain: [
      "What third-party verification will ultimately be required — the proposed rules outline a framework but final standards are TBD.",
      "How to calculate emissions for newer fuel types not yet modeled in the official tool.",
      "How the USDA's agricultural data will integrate with carbon modeling — affects feedstock assumptions."
    ],
    summary: "No recapture risk (credits earned per gallon are permanent). The dominant risk is getting the carbon math wrong — this credit is uniquely sensitive to emissions modeling. Regulatory uncertainty is also high because the rules are still being written. First-time producers face more buyer skepticism than established players."
  },
  stats: {
    pricing: "Discount",
    pricingNote: "to established credits",
    share: "Growing",
    shareNote: "early-stage market",
    timeline: "12–20 wks",
    timelineNote: "for first-time producers"
  },
  mkt: {
    price: "Modest discount to established categories. Pricing improving as market matures.",
    deal: "Low single-digit millions to very large SAF/renewable diesel allocations.",
    time: "12–20 weeks for first-time producers due to carbon modeling complexity."
  },
  guid: {
    stat: "45ZCF-GREET designated as primary methodology early 2025. Proposed regs February 2026. Public hearing May 28, 2026.",
    open: [
      "Emissions calculation for newer fuel types",
      "Third-party verification requirements",
      "Rules for sales through intermediaries",
      "USDA data integration into carbon modeling"
    ]
  },
  bl: [
    "The only credit OBBBA extended — significant political signal.",
    "Performance-based: credit value depends on how clean your fuel is.",
    "SAF rate cut, but eligibility broadened. Corn ethanol and soy biodiesel are winners.",
    "Market is early-stage but high-interest. Structures evolving quickly.",
    "5-year window (2025–2029). When you ramp up matters."
  ]
};

C["45Q"] = {
  sec: "§45Q",
  name: "Carbon Dioxide Sequestration Credit",
  type: "PTC",
  st: "expanded",
  deep: true,
  one: "Pays facilities per ton of CO₂ they capture and permanently store or use. Growing fast as CCS and direct air capture scale up.",
  hover: [
    "Pricing: 85–90¢ per $1 of credit (larger discount than power credits)",
    "Market share: Growing — minority share, scaling with CCS/DAC",
    "Risk: Elevated — long-dated operational risk, MRV compliance is complex, regulatory framework still evolving"
  ],
  sum: "This credit pays facilities a fixed dollar amount for every metric ton of carbon dioxide they capture and either permanently store underground or use in approved ways. It's the government's primary tool for incentivizing carbon capture and direct air capture — technologies many see as essential but that are still expensive to deploy at scale.",
  obbba: "OBBBA left the core §45Q mechanics intact but layered on broader FEOC policy considerations and stricter reporting expectations. The credit was not repealed or cut — a significant signal given how aggressively OBBBA treated other IRA credits. Treasury is preparing revisions to existing regulations to reflect evolving MRV (measurement, reporting, and verification) standards.",
  how: {
    elig: [
      "Carbon capture from industrial facilities (power plants, cement, steel, chemicals, etc.)",
      "Direct air capture (DAC) facilities",
      "Secure geological storage (saline formations, depleted oil/gas reservoirs)",
      "Enhanced oil recovery (EOR) with secure storage verification",
      "Qualifying utilization — chemical conversion or fixation in products meeting lifecycle GHG reduction requirements"
    ],
    val: "A fixed dollar amount per metric ton of qualified CO₂ captured:",
    valTable: [
      ["Secure geological storage (with PWA)", "$85/ton"],
      ["Secure geological storage (without PWA)", "$17/ton"],
      ["DAC with secure storage (with PWA)", "$180/ton"],
      ["DAC with secure storage (without PWA)", "$36/ton"],
      ["EOR / utilization (with PWA)", "$60/ton"],
      ["EOR / utilization (without PWA)", "$12/ton"]
    ],
    bonus: "The 5x multiplier for meeting prevailing wage and apprenticeship (PWA) requirements is the only bonus. Unlike §48E, there are no separate domestic content, energy community, or low-income bonuses. The biggest rate differentiator is the pathway: secure geological storage pays more than EOR or utilization, and DAC pays the most.",
    xfer: "Yes — §45Q credits are transferable under §6418 as a one-time transfer. Both tax-equity partnerships and direct transfers are used. Large CCS hubs may combine project-level equity with multi-year credit strips.",
    epay: "Yes, in limited circumstances — available for §6417-eligible entities (tax-exempts, governments, tribes, cooperatives). For taxable entities, transfer is the standard monetization path.",
    dur: "12 years from the date the qualified facility or carbon capture equipment is placed in service. Credits are claimed annually based on verified capture volumes."
  },
  tl: {
    orig: "IRA extended and increased §45Q for projects beginning construction by the statutory deadline, with a 12-year credit period from placed-in-service.",
    post: "OBBBA did not repeal §45Q. Core mechanics intact. FEOC policy overlay and MRV reporting changes anticipated. Notice 2026-01 safe harbor issued for 2025 volumes.",
    dates: [
      { d: "1/1/2023", e: "Enhanced IRA rates took effect for new projects" },
      { d: "1/1/2033", e: "Construction must begin by this date for enhanced rates", u: true },
      { d: "2025–2044", e: "12-year credit windows for projects placed in service 2023–2032" },
      { d: "Feb 2026", e: "Notice 2026-01 safe harbor for 2025 backup reporting issued" }
    ]
  },
  feoc: "FEOC rules are not yet the center of §45Q guidance — the primary regulatory focus is on storage integrity, MRV compliance, and secure geological sequestration verification. However, OBBBA creates a backdrop of stricter reporting and FEOC oversight that may influence future regulatory revisions. No explicit FEOC percentage thresholds have been codified for §45Q.",
  riskScore: { level: "Elevated", reason: "Long-dated operational risk. MRV compliance is complex. Storage integrity is a 12-year commitment. Regulatory framework still evolving." },
  risks: {
    underwriting: [
      "Storage integrity — the credit depends on CO₂ staying permanently underground. Any leakage or failure to verify secure storage can trigger credit loss.",
      "MRV compliance — measurement, reporting, and verification requirements are stringent and still evolving. EPA's Subpart RR electronic reporting system has experienced disruptions.",
      "Capture volume risk — credits are earned per ton actually captured. If the facility underperforms, credit volumes fall short of projections."
    ],
    mitigable: [
      "Notice 2026-01 safe harbor — IRS issued backup reporting methods for 2025 volumes, protecting eligibility during EPA reporting transitions.",
      "Structured indemnities and insurance — long-term storage liability can be allocated contractually with insurance backstops.",
      "Third-party MRV verification — independent monitoring of injection and storage reduces regulatory challenge risk."
    ],
    uncertain: [
      "Final MRV requirements are still being developed. Treasury has indicated it will propose revisions to existing §45Q regulations.",
      "Long-term liability allocation for stored CO₂ — who bears responsibility 20+ years after injection is not fully settled.",
      "How EPA reporting system transitions will interact with IRS credit eligibility in future years."
    ],
    summary: "No recapture in the traditional sense, but credits depend on ongoing verified storage — making this a long-dated operational commitment. MRV is the dominant diligence issue. The new IRS safe harbor signals regulatory commitment to keeping the credit functional, but the framework is still maturing. Buyers apply larger discounts than for power-sector credits due to technology and regulatory complexity."
  },
  stats: {
    pricing: "85–90¢",
    pricingNote: "per $1 (larger discount than power credits)",
    share: "Growing",
    shareNote: "minority share, scaling with CCS/DAC",
    timeline: "12–20 wks",
    timelineNote: "complex diligence"
  },
  mkt: {
    price: "Early §45Q transfers trade at 85¢–90¢ on the dollar — a larger discount than wind/solar ITCs/PTCs due to technology, regulatory, and MRV risk.",
    deal: "Deal sizes range from single-digit millions for smaller industrial capture to $100M+ for large CCS hubs and DAC facilities.",
    time: "12–20 weeks typical. Heavy diligence on storage verification, MRV compliance, and counterparty strength."
  },
  guid: {
    stat: "Existing §45Q regulations in place. Notice 2026-01 safe harbor issued for 2025 backup reporting. Treasury preparing revisions to reflect MRV and reporting changes.",
    open: [
      "Final MRV requirements and alignment with EPA reporting systems",
      "Long-term liability allocation for stored CO₂",
      "How FEOC oversight will interact with §45Q in practice",
      "Whether additional safe harbors will be issued for future reporting years"
    ]
  },
  bl: [
    "§45Q offers substantial per-ton value — up to $180/ton for DAC with secure storage — but demands robust MRV and storage assurances.",
    "12-year credit window per facility provides long-term revenue certainty for qualifying projects.",
    "Transferability opens §45Q to a broader buyer universe, but perceived risk keeps discounts higher than power-sector credits.",
    "New IRS safe harbor (Notice 2026-01) signals regulatory commitment — the government wants this credit to work.",
    "OBBBA left §45Q intact while cutting other credits — a strong political signal for carbon capture's durability."
  ]
};

var TERM = [
  { sec: "§30D", n: "Clean Vehicle Credit", d: "Terminated Sep 2025" },
  { sec: "§45W", n: "Commercial Clean Vehicles", d: "Terminated Sep 2025" },
  { sec: "§25C", n: "Energy Efficient Home Improvement", d: "Terminated Dec 2025" },
  { sec: "§25D", n: "Residential Clean Energy", d: "Terminated Dec 2025" },
  { sec: "§30C", n: "Alt Fuel Vehicle Refueling", d: "Terminates Jun 2026" },
  { sec: "§45L", n: "New Energy Efficient Home", d: "Terminates Jun 2026" },
  { sec: "§179D", n: "Energy Efficient Commercial Buildings", d: "Terminates Jun 2026" }
];

var ACT = [
  { sec: "§45U", n: "Zero-Emission Nuclear Power", type: "PTC", one: "Supports existing nuclear plants. Demand growing as AI data centers seek 24/7 clean power." },
  { sec: "§48C", n: "Advanced Energy Manufacturing", type: "ITC", one: "Funds clean energy factory investments. Popular with buyers." },
  { sec: "§48", n: "Legacy Energy Investment Credit", type: "ITC", one: "For projects started before 2025. Not changed by OBBBA." },
  { sec: "§45", n: "Legacy Clean Energy Production Credit", type: "PTC", one: "For projects started before 2025. Not changed by OBBBA." }
];

var TL = [
  { d: "Jul 4, 2025", e: "OBBBA signed into law", past: true },
  { d: "Sep 30, 2025", e: "EV credits (§30D, §45W) terminated", past: true },
  { d: "Dec 31, 2025", e: "Home energy credits ended; FEOC rules took effect", past: true },
  { d: "Feb 2026", e: "Interim FEOC guidance and proposed §45Z rules issued", past: true, type: "guidance" },
  { d: "May 28, 2026", e: "Public hearing on §45Z regulations", type: "guidance" },
  { d: "Jun 30, 2026", e: "Three more credits terminate: §30C, §45L, §179D", next: true },
  { d: "Jul 4, 2026", e: "Hard deadline: begin construction for wind/solar", urg: true },
  { d: "Late 2026", e: "Final FEOC rules expected from Treasury", type: "guidance" },
  { d: "Dec 31, 2026", e: "Domestic content requirement rises to 55%" },
  { d: "Dec 31, 2027", e: "Wind/solar must be operational; §45X wind credits end" },
  { d: "Dec 31, 2029", e: "§45Z and §45X full-value credits expire" }
];

var NEWS = [
  {
    date: "Feb 2026", tag: "Policy",
    h: "§45Q carbon capture — IRS issues safe harbor for 2025 reporting",
    cr: ["§45Q"],
    who: "CCS and DAC project operators claiming §45Q credits, and buyers purchasing those credits in the transfer market.",
    what: "Treasury issued Notice 2026-01, establishing a backup reporting method for 2025 carbon capture volumes. This protects credit eligibility during EPA's Subpart RR electronic reporting system transitions.",
    next: "Watch for Treasury's proposed revisions to existing §45Q regulations, which will address MRV requirements and long-term storage verification standards."
  },
  {
    date: "Feb 2026", tag: "Policy",
    h: "Foreign supply chain rules — interim guidance released",
    cr: ["§45X", "§45Y", "§48E"],
    who: "Any company claiming credits that involve foreign-sourced components — manufacturers (§45X), project developers (§45Y/§48E), and credit buyers doing supply chain diligence.",
    what: "Treasury issued Notice 2026-15 with temporary safe harbors for FEOC (Foreign Entity of Concern) restrictions. The guidance provides interim thresholds and compliance methods while final rules are developed.",
    next: "Final FEOC rules expected late 2026. The interim safe harbors could tighten, so companies should map their supply chains now rather than waiting."
  },
  {
    date: "Feb 2026", tag: "Policy",
    h: "§45Z clean fuel rules — proposed regulations published",
    cr: ["§45Z"],
    who: "Fuel producers (SAF, renewable diesel, ethanol, biodiesel) and credit buyers evaluating §45Z transactions.",
    what: "Proposed regulations cover carbon intensity scoring methodology, producer registration requirements, and third-party verification frameworks. The 45ZCF-GREET model is the designated calculation tool.",
    next: "Public hearing scheduled May 28, 2026. Final rules could change qualification thresholds and verification standards. Producers should begin modeling credits using the proposed framework now."
  },
  {
    date: "Q3 2025", tag: "Market",
    h: "Credit prices dipped — fewer buyers, more opportunity",
    cr: ["Market-wide"],
    who: "Credit buyers looking for favorable pricing, and sellers who may need to accept lower offers to close deals.",
    what: "ITC pricing dropped to ~89¢ on the dollar. OBBBA's other provisions (SALT cap increase, corporate tax adjustments) reduced corporate tax bills, thinning the pool of buyers who need credits to offset liability.",
    next: "Pricing may stabilize or recover as the market adjusts to post-OBBBA tax dynamics. Buyers with near-term tax liability have a window to lock in historically favorable rates."
  }
];

var MATCH_ROLES = [
  { id: "buyer", label: "Buying credits" },
  { id: "developer", label: "Building a project" },
  { id: "manufacturer", label: "Manufacturing equipment" },
  { id: "fuel", label: "Producing fuel" },
  { id: "advisor", label: "Advising clients" }
];

var MATCH_RESULTS = {
  buyer: {
    credits: ["48E", "45X", "45Z"],
    msg: "The three most active transferable credits are §48E (clean power/storage), §45X (manufacturing), and §45Z (clean fuels). Pricing ranges from 89¢ to 96¢ on the dollar."
  },
  developer: {
    credits: ["48E"],
    msg: "§48E is your primary credit — up to 30%+ of your project investment. Wind/solar must start construction by July 4, 2026. Storage has years more runway."
  },
  manufacturer: {
    credits: ["45X"],
    msg: "§45X pays a fixed dollar amount per unit produced. Most actively traded credit. Biggest issue: new foreign supply chain rules."
  },
  fuel: {
    credits: ["45Z"],
    msg: "§45Z is the only credit OBBBA extended (through 2029). Value depends on your fuel's carbon intensity score."
  },
  advisor: {
    credits: ["48E", "45X", "45Z"],
    msg: "All three deep dives include market pricing, risk profiles, and open regulatory questions."
  }
};

// ─── AI Context Builder ───────────────────────────────────
function ctxFor(k) {
  var c = C[k];
  var parts = [];
  parts.push("CREDIT: " + c.sec + " — " + c.name);
  parts.push("Type: " + c.type + " | Status: " + STATUS[c.st].l);
  parts.push("Summary: " + c.sum);
  parts.push("OBBBA: " + c.obbba);
  parts.push("Eligible: " + c.how.elig.join("; "));
  parts.push("Value: " + c.how.val);
  if (c.how.valTable) {
    parts.push("Rates: " + c.how.valTable.map(function(r) { return r[0] + ": " + r[1]; }).join("; "));
  }
  parts.push("Bonuses: " + c.how.bonus);
  parts.push("Transfer: " + c.how.xfer);
  parts.push("Duration: " + c.how.dur);
  if (c.beginConstruction) {
    parts.push("Begin Construction: " + c.beginConstruction.join(" "));
  }
  parts.push("Timeline: " + c.tl.dates.map(function(d) { return d.d + ": " + d.e; }).join("; "));
  parts.push("FEOC: " + c.feoc);
  if (c.risks) {
    parts.push("Risk Summary: " + c.risks.summary);
    parts.push("Underwriting Risks: " + c.risks.underwriting.join("; "));
    parts.push("Mitigable Risks: " + c.risks.mitigable.join("; "));
    parts.push("Uncertain: " + c.risks.uncertain.join("; "));
  }
  parts.push("Market: " + c.mkt.share + " Pricing: " + c.mkt.price);
  parts.push("Guidance: " + c.guid.stat);
  parts.push("Key: " + c.bl.join("; "));
  return parts.join("\n");
}

function ctxAll() {
  var keys = Object.keys(C);
  var all = keys.map(function(k) { return ctxFor(k); }).join("\n---\n");
  return all + "\nMARKET: $55-60B projected 2025. 8 active types. ITC 89¢, PTC 92¢.";
}

// ─── Floating Chat Widget ─────────────────────────────────
function AskSidebar(props) {
  var ctx = props.ctx;
  var open = props.open;
  var onClose = props.onClose;
  var _q = useState("");
  var q = _q[0];
  var setQ = _q[1];
  var _a = useState("");
  var a = _a[0];
  var setA = _a[1];
  var _ld = useState(false);
  var ld = _ld[0];
  var setLd = _ld[1];
  var _er = useState("");
  var er = _er[0];
  var setEr = _er[1];

  function go() {
    if (!q.trim()) return;
    setLd(true);
    setA("");
    setEr("");
    var sysMsg = "You are CreditPulse, an expert on U.S. clean energy tax credits after OBBBA (signed July 4, 2025). Answer using ONLY the data below. Plain English. Concise (2-4 sentences). Cite section numbers. If unsure, say so.\n\nDATA:\n" + ctx;
    fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: sysMsg,
        messages: [{ role: "user", content: q }]
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.content && d.content[0] && d.content[0].text) {
        setA(d.content[0].text);
      } else {
        setEr((d.error && d.error.message) || "Something went wrong.");
      }
    })
    .catch(function() { setEr("Unable to connect."); })
    .finally(function() { setLd(false); });
  }

  return (
    <>
      {/* Overlay */}
      {open ? (
        <div
          onClick={onClose}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.15)", zIndex: 999,
            transition: "opacity 0.3s", opacity: open ? 1 : 0
          }}
        />
      ) : null}
      {/* Sidebar panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
        background: CARD, zIndex: 1000, display: "flex",
        flexDirection: "column", borderLeft: "1px solid " + BORDER,
        boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.1)" : "none",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease"
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 20px", borderBottom: "1px solid " + BORDER, flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: TXT }}>Ask CreditPulse</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, color: TXT3, cursor: "pointer", padding: 0, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
          {a ? (
            <div style={{
              padding: "14px 16px", background: HOVER, borderRadius: 8,
              marginBottom: 14, borderLeft: "3px solid " + GOLD
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: TXT, margin: 0 }}>{a}</p>
            </div>
          ) : null}
          {er ? (
            <div style={{
              padding: "12px 16px", background: "#FFF3E0", borderRadius: 8,
              marginBottom: 14, borderLeft: "3px solid #E65100"
            }}>
              <p style={{ fontSize: 13, color: "#E65100", margin: 0 }}>{er}</p>
            </div>
          ) : null}
          {!a && !er ? (
            <div>
              <p style={{ fontSize: 14, color: TXT2, lineHeight: 1.6, margin: "0 0 16px" }}>
                Ask anything about clean energy tax credits, market pricing, risk profiles, or regulatory timelines.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "What credits can I still claim for solar?",
                  "How does §45X pricing compare to §48E?",
                  "What are the biggest risks for credit buyers?"
                ].map(function(suggestion, i) {
                  return (
                    <button
                      key={i}
                      onClick={function(e) { e.stopPropagation(); setQ(suggestion); }}
                      style={{
                        background: HOVER, border: "1px solid " + BORDER, borderRadius: 8,
                        padding: "10px 14px", textAlign: "left", cursor: "pointer",
                        fontSize: 13, color: TXT2, fontFamily: "inherit",
                        transition: "border-color 0.15s"
                      }}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        {/* Input */}
        <div style={{
          padding: "14px 20px 16px", borderTop: "1px solid " + BORDER,
          display: "flex", gap: 8, flexShrink: 0
        }}>
          <input
            value={q}
            onChange={function(e) { setQ(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter") go(); }}
            placeholder="Ask a question..."
            style={{
              flex: 1, background: HOVER, border: "1px solid " + BORDER,
              borderRadius: 8, padding: "11px 14px", color: TXT, fontSize: 13,
              outline: "none", fontFamily: "inherit"
            }}
          />
          <button
            onClick={go}
            disabled={ld}
            style={{
              background: ld ? BORDER : TXT, color: BG, border: "none",
              borderRadius: 8, padding: "11px 18px", fontWeight: 700, fontSize: 13,
              cursor: ld ? "wait" : "pointer", fontFamily: "inherit"
            }}
          >
            {ld ? "..." : "Ask"}
          </button>
        </div>
        <div style={{ padding: "0 20px 12px", fontSize: 9, color: TXT3, flexShrink: 0 }}>
          Powered by Claude API · Curated data only · Not legal advice
        </div>
      </div>
    </>
  );
}

// ─── Collapsible Section ──────────────────────────────────
function Sec(props) {
  var _o = useState(props.startOpen !== false);
  var open = _o[0];
  var setOpen = _o[1];
  return (
    <div style={{
      marginBottom: 16, background: CARD,
      border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden"
    }}>
      <button
        onClick={function() { setOpen(!open); }}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "14px 20px", background: "transparent",
          border: "none", cursor: "pointer", fontFamily: "inherit"
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>{props.title}</span>
        <span style={{
          color: TXT3, fontSize: 16,
          transform: open ? "rotate(0)" : "rotate(-90deg)",
          transition: "0.2s"
        }}>▾</span>
      </button>
      {open ? (
        <div style={{ padding: "4px 20px 18px", borderTop: "1px solid " + BORDER }}>
          {props.children}
        </div>
      ) : null}
    </div>
  );
}

function Lbl(props) {
  return (
    <div style={{
      fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 6, marginTop: 14,
      paddingLeft: 10, borderLeft: "3px solid " + GOLD
    }}>
      {props.children}
    </div>
  );
}

// ─── Credit Card ──────────────────────────────────────────
function CCard(props) {
  var _h = useState(false);
  var h = _h[0];
  var setH = _h[1];
  var s = STATUS[props.status] || STATUS.active;

  return (
    <div
      onMouseEnter={function() { setH(true); }}
      onMouseLeave={function() { setH(false); }}
      onClick={props.deep ? props.onClick : undefined}
      style={{
        background: CARD,
        border: "1px solid " + (h && props.deep ? "#C8C5BE" : BORDER),
        borderRadius: 10, padding: "18px 20px",
        cursor: props.deep ? "pointer" : "default",
        transition: "all 0.2s",
        transform: h && props.deep ? "translateY(-2px)" : "none",
        boxShadow: h && props.deep ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
        opacity: props.status === "terminated" ? 0.6 : 1
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: s.c, fontWeight: 700 }}>{props.sec}</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.c, fontWeight: 600 }}>{props.type}</span>
        </div>
        {props.deep ? (
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, background: GOLD, color: "#fff", fontWeight: 600 }}>Explore →</span>
        ) : null}
        {props.pending ? (
          <span style={{ fontSize: 10, color: TXT3, fontStyle: "italic" }}>Coming soon</span>
        ) : null}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: TXT, marginBottom: 6, lineHeight: 1.3 }}>{props.name}</div>
      <div style={{ fontSize: 13.5, color: TXT2, lineHeight: 1.55 }}>{props.one}</div>
      {h && props.hover && props.deep ? (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid " + BORDER }}>
          {props.hover.map(function(f, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.c, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: TXT2 }}>
                  {f.indexOf(":") > -1 ? (
                    <><strong style={{ color: TXT }}>{f.slice(0, f.indexOf(":"))}</strong>{f.slice(f.indexOf(":"))}</>
                  ) : f}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function GrpHdr(props) {
  var s = STATUS[props.status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.c }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: s.c, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</span>
      {props.note ? <span style={{ fontSize: 12, color: TXT3, fontStyle: "italic" }}>— {props.note}</span> : null}
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

// ─── News Card ────────────────────────────────────────────
function NewsCard(props) {
  var item = props.item;
  var _o = useState(false);
  var open = _o[0];
  var setOpen = _o[1];
  var _h = useState(false);
  var hov = _h[0];
  var setHov = _h[1];

  return (
    <div
      onClick={function() { setOpen(!open); }}
      onMouseEnter={function() { setHov(true); }}
      onMouseLeave={function() { setHov(false); }}
      style={{
        background: hov && !open ? HOVER : CARD,
        border: "1px solid " + (hov ? "#C8C5BE" : BORDER), borderRadius: 10,
        marginBottom: 10, cursor: "pointer", transition: "all 0.2s",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: "16px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: TXT3 }}>{item.date}</span>
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 4,
            background: item.tag === "Market" ? "#FFF3E0" : "#F0EDE6",
            color: item.tag === "Market" ? "#E65100" : TXT2, fontWeight: 600
          }}>{item.tag}</span>
          {item.cr.map(function(c, j) {
            return <span key={j} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#F0EDE6", color: TXT3, fontWeight: 600 }}>{c}</span>;
          })}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: TXT, marginTop: 8, lineHeight: 1.35 }}>{item.h}</div>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>
            {open ? "Show less \u2212" : "Read more +"}
          </span>
        </div>
      </div>
      {open ? (
        <div style={{ padding: "0 22px 18px", borderTop: "1px solid " + BORDER }}>
          {[
            ["Who this affects", item.who],
            ["What happened", item.what],
            ["What's next", item.next]
          ].map(function(row, i) {
            return (
              <div key={i} style={{ marginTop: 14 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: TXT, marginBottom: 4,
                  paddingLeft: 10, borderLeft: "3px solid " + GOLD
                }}>{row[0]}</div>
                <p style={{ fontSize: 14, color: TXT2, lineHeight: 1.65, margin: 0 }}>{row[1]}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ─── Deep Dive Page ───────────────────────────────────────
function DeepDive(props) {
  var c = C[props.ck];
  var s = STATUS[c.st];
  var scoreColor = c.riskScore.level === "Low" ? "#2E7D32" : c.riskScore.level === "Moderate" ? "#E65100" : "#BF360C";
  var scoreBg = c.riskScore.level === "Low" ? "#E8F5E9" : c.riskScore.level === "Moderate" ? "#FFF3E0" : "#FBE9E7";

  return (
    <div>
      <button
        onClick={props.onBack}
        style={{
          background: "none", border: "none", color: GOLD, fontSize: 13,
          cursor: "pointer", padding: "6px 0", marginBottom: 14,
          fontFamily: "inherit", fontWeight: 600
        }}
      >
        ← Back to Overview
      </button>

      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 700, color: s.c }}>{c.sec}</span>
          <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 5, background: s.bg, color: s.c, fontWeight: 700 }}>{s.l}</span>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, background: "#F0EDE6", color: TXT3, fontWeight: 600 }}>{c.type}</span>
        </div>
        <h1 style={{ fontSize: 26, color: TXT, margin: "0 0 12px", fontWeight: 400, lineHeight: 1.3 }}>{c.name}</h1>
        <p style={{ fontSize: 16, color: TXT2, lineHeight: 1.7, maxWidth: 720, margin: 0 }}>{c.sum}</p>
      </div>

      {/* STATS BAR */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
        background: BORDER, borderRadius: 10, overflow: "hidden", marginBottom: 24
      }}>
        {[
          [c.stats.pricing, c.stats.pricingNote, "Pricing"],
          [c.stats.share, c.stats.shareNote, "Market Share"],
          [c.stats.timeline, c.stats.timelineNote, "Deal Timeline"]
        ].map(function(item, i) {
          return (
            <div key={i} style={{ background: CARD, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TXT3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{item[2]}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 700, color: TXT, marginBottom: 2 }}>{item[0]}</div>
              <div style={{ fontSize: 11, color: TXT3, lineHeight: 1.3 }}>{item[1]}</div>
            </div>
          );
        })}
      </div>

      {/* ── OPEN BY DEFAULT: Bottom Line ── */}
      <Sec title="If You Read Nothing Else">
        {c.bl.map(function(b, i) {
          return (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "12px 16px", marginBottom: 6,
              background: i === 0 ? "rgba(0,0,0,0.03)" : HOVER,
              borderRadius: 8,
              border: i === 0 ? "2px solid " + s.c : "1px solid " + BORDER,
              alignItems: "flex-start"
            }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: s.c, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 14.5, color: i === 0 ? TXT : TXT2, lineHeight: 1.6 }}>{b}</span>
            </div>
          );
        })}
      </Sec>

      {/* ── OPEN BY DEFAULT: Risk Score + Comparison ── */}
      {c.risks ? (
        <Sec title="Risk Profile">
          {/* Overall risk score — hero element */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "16px 20px", marginBottom: 16,
            background: scoreBg, borderRadius: 10,
            border: "2px solid " + scoreColor + "44"
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 700,
              color: scoreColor, lineHeight: 1, flexShrink: 0
            }}>
              {c.riskScore.level}
            </div>
            <div style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.55 }}>
              {c.riskScore.reason}
            </div>
          </div>

          {/* Cross-credit comparison — tighter 3-row version */}
          <div style={{
            background: HOVER, borderRadius: 8, border: "1px solid " + BORDER,
            padding: "14px 18px", marginBottom: 16
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TXT3, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Compare across credits
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: TXT3, fontWeight: 600, fontSize: 11, borderBottom: "1px solid " + BORDER }}></th>
                  {["§45X Mfg", "§48E Power", "§45Z Fuel"].map(function(h, i) {
                    var isCurrent = (i === 0 && c.sec === "§45X") || (i === 1 && c.sec === "§48E") || (i === 2 && c.sec === "§45Z");
                    return (
                      <th key={i} style={{
                        textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 700,
                        color: isCurrent ? GOLD : TXT3,
                        borderBottom: "1px solid " + BORDER,
                        background: isCurrent ? "rgba(184,134,11,0.06)" : "transparent"
                      }}>{h}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Main risk", "Supply chain (FEOC)", "Recapture (insurable)", "Carbon scoring"],
                  ["Rules finalized?", "Mostly yes", "Mostly yes", "No — still proposed"],
                  ["Recapture", "None", "5-year clawback", "None"]
                ].map(function(row, ri) {
                  return (
                    <tr key={ri}>
                      <td style={{ padding: "7px 8px", color: TXT3, fontSize: 12, fontWeight: 600, borderBottom: ri < 2 ? "1px solid " + BORDER : "none" }}>{row[0]}</td>
                      {[row[1], row[2], row[3]].map(function(cell, ci) {
                        var isCurrent = (ci === 0 && c.sec === "§45X") || (ci === 1 && c.sec === "§48E") || (ci === 2 && c.sec === "§45Z");
                        return (
                          <td key={ci} style={{
                            padding: "7px 8px", fontSize: 12.5,
                            color: isCurrent ? TXT : TXT2,
                            fontWeight: isCurrent ? 600 : 400,
                            borderBottom: ri < 2 ? "1px solid " + BORDER : "none",
                            background: isCurrent ? "rgba(184,134,11,0.06)" : "transparent"
                          }}>{cell}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 14, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.risks.summary}</p>
        </Sec>
      ) : null}

      {/* ── COLLAPSED: OBBBA Changes ── */}
      <Sec title="What Changed Under OBBBA" startOpen={false}>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.7, margin: 0 }}>{c.obbba}</p>
      </Sec>

      {/* ── COLLAPSED: Credit Mechanics ── */}
      <Sec title="Credit Mechanics" startOpen={false}>
        <Lbl>What Qualifies</Lbl>
        {c.how.elig.map(function(e, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
              <span style={{ color: s.c, flexShrink: 0, marginTop: 2 }}>•</span>
              <span style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.55 }}>{e}</span>
            </div>
          );
        })}
        <Lbl>How Much It's Worth</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: "0 0 10px" }}>{c.how.val}</p>
        {c.how.valTable ? (
          <div style={{ background: HOVER, borderRadius: 8, padding: "12px 16px", marginBottom: 10, border: "1px solid " + BORDER }}>
            {c.how.valTable.map(function(row, i) {
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0",
                  borderBottom: i < c.how.valTable.length - 1 ? "1px solid " + BORDER : "none"
                }}>
                  <span style={{ fontSize: 13.5, color: TXT2 }}>{row[0]}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: TXT, fontWeight: 600 }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        <Lbl>Bonuses</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.bonus}</p>
        <Lbl>Duration</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.dur}</p>
        <Lbl>Market Detail</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: "0 0 4px" }}>{c.mkt.price}</p>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: "0 0 4px" }}>{c.mkt.share}</p>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.mkt.deal}</p>
      </Sec>

      {/* ── COLLAPSED: Transferability ── */}
      <Sec title="Transferability & Direct Pay" startOpen={false}>
        <Lbl>Can You Sell It?</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.xfer}</p>
        <Lbl>Direct Cash Payment</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.epay}</p>
      </Sec>

      {/* ── COLLAPSED: Begin Construction (48E only) ── */}
      {c.beginConstruction ? (
        <Sec title="What Does 'Begin Construction' Actually Mean?" startOpen={false}>
          {c.beginConstruction.map(function(para, i) {
            return <p key={i} style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.65, margin: "0 0 12px" }}>{para}</p>;
          })}
        </Sec>
      ) : null}

      {/* ── COLLAPSED: Risk Detail ── */}
      {c.risks ? (
        <Sec title="Risk Detail — Underwriting, Mitigation, Uncertainty" startOpen={false}>
          <Lbl>What you're underwriting</Lbl>
          {c.risks.underwriting.map(function(r, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#BF360C", flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 14, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
          <Lbl>What you can mitigate</Lbl>
          {c.risks.mitigable.map(function(r, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#2E7D32", flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 14, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
          <Lbl>What's still uncertain</Lbl>
          {c.risks.uncertain.map(function(r, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#E65100", flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 14, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
        </Sec>
      ) : null}

      {/* ── COLLAPSED: Timeline ── */}
      <Sec title="Key Dates" startOpen={false}>
        {c.tl.dates.map(function(d, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 10 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 13,
                color: d.u ? "#BF360C" : s.c, minWidth: 100, flexShrink: 0,
                fontWeight: d.u ? 700 : 400
              }}>{d.d}</span>
              <span style={{ fontSize: 14, color: d.u ? TXT : TXT2, lineHeight: 1.45 }}>
                {d.e}{d.u ? " ⚠" : ""}
              </span>
            </div>
          );
        })}
      </Sec>

      {/* ── COLLAPSED: FEOC ── */}
      <Sec title="Foreign Supply Chain Restrictions (FEOC)" startOpen={false}>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.7, margin: 0 }}>{c.feoc}</p>
      </Sec>

      {/* ── COLLAPSED: Regulatory Status ── */}
      <Sec title="Where Do the Rules Stand?" startOpen={false}>
        <Lbl>Current Status</Lbl>
        <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.6, margin: "0 0 10px" }}>{c.guid.stat}</p>
        <Lbl>Unresolved Questions</Lbl>
        {c.guid.open.map(function(q, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
              <span style={{ color: "#E65100", flexShrink: 0, fontWeight: 700 }}>?</span>
              <span style={{ fontSize: 14, color: TXT2, lineHeight: 1.55 }}>{q}</span>
            </div>
          );
        })}
      </Sec>

      {/* CTA + DISCLAIMER */}
      <div style={{
        padding: "20px 24px", background: HOVER, borderRadius: 10,
        border: "1px solid " + BORDER, marginBottom: 20
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: TXT, marginBottom: 6 }}>Ready to go deeper?</div>
        <p style={{ fontSize: 14, color: TXT2, lineHeight: 1.6, margin: 0 }}>
          Every transaction is different. Reach out to a qualified tax advisor, energy attorney, or credit marketplace.
        </p>
      </div>

      <div style={{ padding: "14px 20px", background: HOVER, borderRadius: 8, border: "1px solid " + BORDER }}>
        <p style={{ fontSize: 12, color: TXT3, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: TXT2 }}>Disclaimer:</strong> Educational only. Not legal, tax, or investment advice. Data as of {LAST_UPDATED}.
        </p>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────
function Home(props) {
  var nav = props.nav;
  var _mo = useState(false);
  var matchOpen = _mo[0];
  var setMatchOpen = _mo[1];
  var _mr = useState(null);
  var matchRole = _mr[0];
  var setMatchRole = _mr[1];
  var mr = matchRole ? MATCH_RESULTS[matchRole] : null;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: TXT3 }}>Last updated {LAST_UPDATED}</div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
        background: BORDER, borderRadius: 10, overflow: "hidden", marginBottom: 32
      }}>
        {[
          ["89–96¢", "Credit pricing range (per $1)"],
          ["12-mo low", "Supply-to-demand ratio — buyer's market"],
          ["8–16 wks", "Median time from listing to close"]
        ].map(function(item, i) {
          return (
            <div key={i} style={{ background: CARD, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 24, fontWeight: 700, color: TXT, marginBottom: 4 }}>{item[0]}</div>
              <div style={{ fontSize: 12, color: TXT3, lineHeight: 1.35 }}>{item[1]}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, color: TXT, margin: "0 0 6px", fontWeight: 500 }}>Credit Status After OBBBA</h2>
        <p style={{ fontSize: 14, color: TXT3, margin: "0 0 20px" }}>Cards marked "Explore" have full deep dives.</p>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="expanded" note="OBBBA made these credits better" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            <CCard sec={C["45Z"].sec} name={C["45Z"].name} type={C["45Z"].type} status={C["45Z"].st} one={C["45Z"].one} hover={C["45Z"].hover} onClick={function() { nav("45Z"); }} deep={true} />
            <CCard sec={C["45Q"].sec} name={C["45Q"].name} type={C["45Q"].type} status={C["45Q"].st} one={C["45Q"].one} hover={C["45Q"].hover} onClick={function() { nav("45Q"); }} deep={true} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="active" note="Largely unchanged by OBBBA" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            {ACT.map(function(a, i) {
              return <CCard key={i} sec={a.sec} name={a.n} type={a.type} status="active" one={a.one} pending={true} />;
            })}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="modified" note="Changed but still functional" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            <CCard sec={C["45X"].sec} name={C["45X"].name} type={C["45X"].type} status={C["45X"].st} one={C["45X"].one} hover={C["45X"].hover} onClick={function() { nav("45X"); }} deep={true} />
            <CCard sec="§45V" name="Clean Hydrogen Production" type="PTC" status="modified" one="Credit active but rules contentious. FEOC restrictions apply." pending={true} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="sunsetting" note="Facing accelerated expiration" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            <CCard sec="§45Y" name="Clean Electricity Production Credit" type="PTC" status="sunsetting" one="Same wind/solar deadline: construction must start by July 4, 2026." pending={true} />
            <CCard sec={C["48E"].sec} name={C["48E"].name} type={C["48E"].type} status={C["48E"].st} one={C["48E"].one} hover={C["48E"].hover} onClick={function() { nav("48E"); }} deep={true} />
          </div>
        </div>

      </div>

      <div style={{
        background: "linear-gradient(135deg, #FDF6E3 0%, #F9EDCF 100%)",
        border: "1px solid #E8D5A3",
        borderRadius: 10, padding: "20px 24px", marginBottom: 36
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#6B5200" }}>Not sure where to start?</span>
            <span style={{ fontSize: 13, color: "#8B7332", marginLeft: 8 }}>Tell us your role and we'll point you to the right credits.</span>
          </div>
          <button
            onClick={function() { setMatchOpen(!matchOpen); if (matchOpen) setMatchRole(null); }}
            style={{
              background: GOLD, color: "#fff", border: "none", borderRadius: 6,
              padding: "8px 16px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", flexShrink: 0
            }}
          >
            {matchOpen ? "Close" : "Get Started"}
          </button>
        </div>
        {matchOpen ? (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #E8D5A3" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: mr ? 14 : 0 }}>
              {MATCH_ROLES.map(function(o) {
                var active = matchRole === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={function() { setMatchRole(o.id); }}
                    style={{
                      background: active ? GOLD : "transparent",
                      border: "1px solid " + (active ? GOLD : "#D4C08A"),
                      borderRadius: 6, padding: "8px 14px",
                      color: active ? "#fff" : "#6B5200", fontSize: 13,
                      fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit"
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            {mr ? (
              <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.5)", borderRadius: 8, borderLeft: "3px solid " + GOLD }}>
                <p style={{ fontSize: 14.5, color: TXT2, lineHeight: 1.7, margin: "0 0 12px" }}>{mr.msg}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {mr.credits.map(function(ck) {
                    if (!C[ck]) return null;
                    return (
                      <button
                        key={ck}
                        onClick={function() { nav(ck); }}
                        style={{
                          background: TXT, color: "#fff", border: "none", borderRadius: 6,
                          padding: "7px 14px", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit"
                        }}
                      >
                        {C[ck].sec} Deep Dive →
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, color: TXT, margin: "0 0 6px", fontWeight: 500 }}>Recent Developments</h2>
        <p style={{ fontSize: 14, color: TXT3, margin: "0 0 16px" }}>Policy and market updates.</p>
        {NEWS.map(function(item, i) {
          return <NewsCard key={i} item={item} />;
        })}
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, color: TXT, margin: "0 0 6px", fontWeight: 500 }}>What's Coming Next</h2>
        <p style={{ fontSize: 14, color: TXT3, margin: "0 0 18px" }}>Key deadlines and expected government actions.</p>
        <div style={{ borderLeft: "2px solid " + BORDER, paddingLeft: 22, marginLeft: 6 }}>
          {TL.map(function(t, i) {
            var dotBg = "#D0CEC8";
            if (t.urg) dotBg = "#BF360C";
            else if (t.next) dotBg = TXT;
            else if (t.type === "guidance" && !t.past) dotBg = "#E65100";
            return (
              <div key={i} style={{ marginBottom: 16, position: "relative" }}>
                <div style={{
                  position: "absolute", left: -28, top: 5, width: 10, height: 10,
                  borderRadius: t.type === "guidance" ? 2 : "50%",
                  background: dotBg,
                  border: t.next ? "2px solid " + TXT : "none"
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 13,
                    color: t.past ? "#B0ADA6" : t.urg ? "#BF360C" : TXT2,
                    fontWeight: t.urg || t.next ? 700 : 400,
                    textDecoration: t.past ? "line-through" : "none"
                  }}>{t.d}</span>
                  {t.next ? <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: TXT, color: "#fff", fontWeight: 700 }}>NEXT</span> : null}
                  {t.type === "guidance" && !t.past ? <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: "#FFF3E0", color: "#E65100", fontWeight: 600 }}>GUIDANCE</span> : null}
                </div>
                <div style={{ fontSize: 14, color: t.past ? "#B0ADA6" : t.urg ? TXT : TXT2, lineHeight: 1.5 }}>{t.e}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, color: TXT, margin: "0 0 6px", fontWeight: 500 }}>About This Tool</h2>
        <p style={{ fontSize: 14, color: TXT3, margin: "0 0 16px" }}>How CreditPulse works and where the information comes from.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Data Sources", "IRA and OBBBA statutory text, IRS/Treasury guidance, Crux Climate market reports, law firm advisories, CRS, JCT, and the Clean Investment Monitor."],
            ["How Ask CreditPulse Works", "Uses the Claude API (Anthropic) to answer questions against curated data. No internet search. Not a substitute for professional advice."],
            ["What's a Transferable Tax Credit?", "The IRA created §6418, letting companies sell earned clean energy credits for cash. A market worth tens of billions annually."],
            ["What Are FEOC Restrictions?", "OBBBA restricts credits for projects/products with significant ties to companies in China, Russia, North Korea, or Iran."]
          ].map(function(item, i) {
            return (
              <div key={i} style={{ padding: "18px 20px", background: CARD, border: "1px solid " + BORDER, borderRadius: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 6 }}>{item[0]}</div>
                <p style={{ fontSize: 13, color: TXT2, margin: 0, lineHeight: 1.6 }}>{item[1]}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "14px 20px", background: HOVER, borderRadius: 8, border: "1px solid " + BORDER }}>
        <p style={{ fontSize: 12, color: TXT3, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: TXT2 }}>Disclaimer:</strong> CreditPulse is educational only. Not legal, tax, or investment advice. Data as of {LAST_UPDATED}. Consult qualified advisors before transacting.
        </p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function CreditPulse() {
  var _v = useState("home");
  var view = _v[0];
  var setView = _v[1];
  var _f = useState(true);
  var fade = _f[0];
  var setFade = _f[1];
  var _sb = useState(false);
  var sidebarOpen = _sb[0];
  var setSidebarOpen = _sb[1];
  var ref = useRef(null);

  function nav(v) {
    setFade(false);
    setTimeout(function() {
      setView(v);
      setFade(true);
      if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
    }, 180);
  }

  var ctx = view === "home" ? ctxAll() : ctxFor(view);

  return (
    <div ref={ref} style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <style>{
        "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');" +
        "*{box-sizing:border-box;}" +
        "::placeholder{color:#B0ADA6;}" +
        "::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:3px;}"
      }</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "36px 24px 80px", opacity: fade ? 1 : 0, transition: "opacity 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18, borderBottom: "1px solid " + BORDER, position: "sticky", top: 0, background: BG, zIndex: 100, paddingTop: 12, marginBottom: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: view !== "home" ? "pointer" : "default" }}
            onClick={view !== "home" ? function() { nav("home"); } : undefined}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: TXT, letterSpacing: "0.04em" }}>CREDITPULSE</span>
            <span style={{ fontSize: 12, color: TXT3, fontWeight: 400 }}>Tracking the evolving clean energy tax credit landscape</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: TXT3 }}>
              Built by{" "}
              <a href="https://www.linkedin.com/in/jaredhutchinson/" target="_blank" rel="noopener noreferrer" style={{ color: TXT2, textDecoration: "none", borderBottom: "1px solid " + BORDER, fontWeight: 600 }}>
                Jared Hutchinson
              </a>
            </span>
            <button
              onClick={function() { setSidebarOpen(true); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: TXT, color: BG, border: "none", borderRadius: 6,
                padding: "7px 14px", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s"
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
              Ask AI
            </button>
          </div>
        </div>
        {view === "home" ? <Home nav={nav} /> : <DeepDive ck={view} onBack={function() { nav("home"); }} />}
      </div>
      <AskSidebar ctx={ctx} open={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
    </div>
  );
}
