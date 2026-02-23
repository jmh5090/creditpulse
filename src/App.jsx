import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

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

var SEVERITY = {
  high: { c: "#BF360C", bg: "#FBE9E7", l: "HIGH" },
  medium: { c: "#E65100", bg: "#FFF3E0", l: "MEDIUM" },
  low: { c: "#37474F", bg: "#ECEFF1", l: "LOW" }
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
  { d: "Jul 4, 2025", e: "OBBBA signed into law", past: true,
    detail: "The One Big Beautiful Bill Act restructured IRA-era clean energy incentives. Several credits were terminated immediately, others modified, and §45Z was extended through 2029." },
  { d: "Sep 30, 2025", e: "EV credits (§30D, §45W) terminated", past: true,
    detail: "Consumer and commercial EV tax credits ended. Vehicles purchased after this date no longer qualify. The transfer market for these credits is closed." },
  { d: "Dec 31, 2025", e: "Home energy credits ended; FEOC rules took effect", past: true,
    detail: "Residential clean energy and efficiency credits (§25C, §25D) expired. Foreign Entity of Concern restrictions began applying to manufacturing and investment credits." },
  { d: "Feb 2026", e: "Interim FEOC guidance and proposed §45Z rules issued", past: true, type: "guidance",
    detail: "Treasury published interim safe harbors for FEOC compliance and proposed regulations for the §45Z clean fuel production credit." },
  { d: "May 28, 2026", e: "Public hearing on §45Z regulations", type: "guidance",
    detail: "Treasury will take public testimony on the proposed §45Z rules. Written comments are due 60 days before the hearing. Final rules could change CI scoring thresholds and verification requirements.",
    credits: ["§45Z"] },
  { d: "Jun 30, 2026", e: "Three more credits terminate: §30C, §45L, §179D", next: true,
    detail: "Alternative fuel vehicle refueling (§30C), energy-efficient commercial buildings (§179D), and new energy-efficient homes (§45L) all expire. Sellers with these credits should close transactions before this date." },
  { d: "Jul 4, 2026", e: "Hard deadline: begin construction for wind/solar", urg: true,
    detail: "Wind and solar projects must demonstrate construction has begun by this date to qualify for §48E or §45Y credits. The IRS 'begin construction' safe harbor requires either 5% of total cost incurred or continuous physical work of a significant nature.",
    credits: ["§48E"] },
  { d: "Late 2026", e: "Final FEOC rules expected from Treasury", type: "guidance",
    detail: "The interim 25% FEOC content threshold may tighten in final rules. Companies relying on the safe harbor should be mapping supply chains now rather than waiting.",
    credits: ["§45X", "§48E"] },
  { d: "Dec 31, 2026", e: "Domestic content requirement rises to 55%",
    detail: "The percentage of steel, iron, and manufactured products that must be sourced domestically increases from 40% to 55% for projects claiming the domestic content bonus. This affects the 10% bonus credit adder.",
    credits: ["§48E"] },
  { d: "Dec 31, 2027", e: "Wind/solar must be operational; §45X wind credits end",
    detail: "Projects that began construction by July 4, 2026 must be placed in service by this date. Separately, §45X manufacturing credits for wind turbine components (blades, nacelles, towers) expire entirely.",
    credits: ["§48E", "§45X"] },
  { d: "Dec 31, 2029", e: "§45Z and §45X full-value credits expire",
    detail: "The last day to earn full-value §45Z clean fuel credits and §45X manufacturing credits. After this, §45X enters a phasedown (75% in 2030, 50% in 2031, 25% in 2032, then zero).",
    credits: ["§45Z", "§45X"] }
];

var NEWS = [
  {
    id: "reg-001",
    date: "2026-02-18",
    source: "Treasury / IRS",
    title: "§45Q carbon capture — IRS issues safe harbor for 2025 reporting",
    severity: "medium",
    summary: "Treasury issued Notice 2026-01, establishing a backup reporting method for 2025 carbon capture volumes. This protects credit eligibility while EPA transitions its Subpart RR electronic reporting system.",
    keyChanges: [
      "Alternative MRV reporting pathway available for tax year 2025",
      "Projects can use existing EPA-approved monitoring plans as interim documentation",
      "Safe harbor applies to both §45Q(a) capture credits and §45Q(b) sequestration credits",
      "No penalty for reliance on the interim method if applied in good faith"
    ],
    buyerImpact: {
      enterprise: "Low disruption. Large-cap buyers already in §45Q deals can rely on existing MRV infrastructure. The safe harbor eliminates a narrow compliance risk — no pricing impact expected.",
      midMarket: "Positive signal for new entrants evaluating CCS credits. The safe harbor reduces the perceived regulatory risk that made some mid-market buyers hesitant about §45Q transactions.",
      sellers: "Direct benefit for CCS/DAC operators. Projects that were at risk of losing 2025 credit eligibility due to EPA system transitions now have a clear compliance path."
    },
    relevantCreditTypes: ["§45Q"],
    relatedLinks: ["https://www.irs.gov/pub/irs-drop/n-26-01.pdf"]
  },
  {
    id: "reg-002",
    date: "2026-02-12",
    source: "Treasury / IRS",
    title: "Foreign supply chain rules — interim FEOC guidance released",
    severity: "high",
    summary: "Treasury issued Notice 2026-15 with temporary safe harbors for Foreign Entity of Concern restrictions. The guidance provides interim thresholds and compliance methods affecting manufacturing, generation, and investment credits.",
    keyChanges: [
      "25% threshold for FEOC-sourced content in applicable credits (interim, may tighten)",
      "Self-certification permitted during safe harbor period with documentation requirements",
      "Supply chain tracing required to the 'first transformation' level, not raw material origin",
      "Safe harbor period runs through December 31, 2026 — final rules expected after",
      "Separate FEOC standards for battery components vs. critical minerals vs. generation equipment"
    ],
    buyerImpact: {
      enterprise: "Significant diligence burden. Fortune 500 tax teams must now incorporate FEOC supply chain analysis into every credit purchase. Expect 2-4 weeks added to deal timelines for verification. Upside: early compliance positions you ahead of final rules.",
      midMarket: "This is the update that matters most. If you're buying §45X or §48E credits, the seller's supply chain compliance is now your underwriting risk. Demand FEOC representations in purchase agreements. Consider hiring specialized diligence firms.",
      sellers: "Manufacturers and developers must begin supply chain mapping immediately. The 25% threshold is workable for most domestic-heavy operations, but companies with significant Chinese-sourced polysilicon, lithium, or inverter components face real exposure."
    },
    relevantCreditTypes: ["§45X", "§45Y", "§48E"],
    relatedLinks: ["https://www.irs.gov/pub/irs-drop/n-26-15.pdf"]
  },
  {
    id: "reg-003",
    date: "2026-02-05",
    source: "Treasury / IRS",
    title: "§45Z clean fuel rules — proposed regulations published",
    severity: "high",
    summary: "Proposed regulations establish carbon intensity scoring methodology, producer registration requirements, and third-party verification frameworks for clean fuel production credits. The 45ZCF-GREET model is confirmed as the designated calculation tool.",
    keyChanges: [
      "45ZCF-GREET model confirmed as sole carbon intensity calculation methodology",
      "Producer registration required before credits can be generated — 90-day lead time",
      "Third-party verification required for all CI scores below 25 kgCO2e/mmBTU",
      "Lifecycle analysis must include feedstock production, transportation, and end-use combustion",
      "SAF pathway includes both HEFA and Fischer-Tropsch with separate CI benchmarks",
      "Public hearing scheduled May 28, 2026 — written comments due 60 days before"
    ],
    buyerImpact: {
      enterprise: "Watch closely. §45Z is the only credit OBBBA extended through 2029, making it a reliable long-term play. But the CI scoring methodology will determine which fuels actually qualify and at what credit value. Model your exposure now using the proposed GREET framework.",
      midMarket: "Don't wait for final rules. Start CI modeling immediately using 45ZCF-GREET. The 90-day registration lead time means companies that delay could miss entire quarters of credit generation. This is a first-mover advantage opportunity.",
      sellers: "Critical. Producers must begin the registration process and third-party verification engagement now. The proposed CI benchmarks will directly determine your credit value per gallon. SAF producers should model both HEFA and FT pathways."
    },
    relevantCreditTypes: ["§45Z"],
    relatedLinks: ["https://www.federalregister.gov/documents/2026/02/05/2026-02341/clean-fuel-production-credit"]
  },
  {
    id: "reg-004",
    date: "2026-01-22",
    source: "DOE",
    title: "DOE updates prevailing wage compliance guidance for energy communities",
    severity: "low",
    summary: "The Department of Energy published updated maps and census-tract data for energy community designations, along with clarified prevailing wage requirements for projects seeking the 10% bonus credit.",
    keyChanges: [
      "Updated energy community census tracts reflecting 2025 unemployment data",
      "12 new metropolitan statistical areas now qualify as energy communities",
      "Prevailing wage safe harbor extended to cover subcontractor labor for projects under 5MW",
      "Apprenticeship percentage requirements unchanged at 15% of total labor hours"
    ],
    buyerImpact: {
      enterprise: "Minor update but worth flagging for portfolio optimization. If you're buying credits from projects in newly-designated energy communities, the 10% bonus may apply. Update your internal qualifying project maps.",
      midMarket: "Useful for companies evaluating specific project deals. The new census tracts could make previously-borderline projects eligible for bonus credit amounts, improving the economics of certain transactions.",
      sellers: "Developers in or near the 12 new MSAs should reassess project eligibility for the energy community bonus. The subcontractor safe harbor simplifies compliance for smaller distributed generation projects."
    },
    relevantCreditTypes: ["§48E", "§45Y"],
    relatedLinks: ["https://www.energy.gov/eere/energy-community-bonus"]
  },
  {
    id: "reg-005",
    date: "2026-01-15",
    source: "Congress",
    title: "Senate Finance Committee requests GAO review of credit transfer market",
    severity: "medium",
    summary: "The Senate Finance Committee formally requested a Government Accountability Office study of the §6418 credit transfer market, examining pricing transparency, intermediary fees, and buyer protections. Report expected Q4 2026.",
    keyChanges: [
      "GAO directed to assess pricing transparency and market efficiency",
      "Study scope includes intermediary/broker fee structures and potential conflicts of interest",
      "Committee expressed interest in whether a centralized exchange or reporting framework is needed",
      "Report to include comparison with international carbon credit market structures"
    ],
    buyerImpact: {
      enterprise: "Low immediate impact, but signals future regulatory direction. Large buyers should document their pricing methodology and broker selection processes now, in case reporting requirements follow the GAO report.",
      midMarket: "Net positive. More transparency generally benefits mid-market buyers who lack the deal volume to command premium pricing. A centralized exchange or reporting framework could level the information asymmetry.",
      sellers: "Minimal near-term effect, but watch the GAO report's recommendations. If Congress pushes for mandatory pricing disclosure, it could compress margins for sellers who benefit from opacity."
    },
    relevantCreditTypes: ["§45X", "§48E", "§45Z", "§45Q"],
    relatedLinks: []
  },
  {
    id: "reg-006",
    date: "2025-11-20",
    source: "Treasury / IRS",
    title: "Final regulations issued for §48E clean electricity ITC",
    severity: "high",
    summary: "Treasury finalized regulations for the technology-neutral clean electricity investment tax credit. The rules establish emissions thresholds, the qualified facility definition, and the interaction between §48E and legacy §48 for projects placed in service after 2024.",
    keyChanges: [
      "Net-zero lifecycle emissions threshold confirmed at 0 grams CO2e/kWh for full credit",
      "Projects with emissions up to 10g CO2e/kWh qualify for partial credit (proportional reduction)",
      "Energy storage qualifies as a standalone facility — no co-location with generation required",
      "Begin-construction rules align with existing IRS safe harbors (5% physical work or continuous efforts)",
      "Domestic content bonus requires 40% of steel/iron and 20% of manufactured products sourced domestically (rising to 55% by 2027)"
    ],
    buyerImpact: {
      enterprise: "Major clarity event. §48E is now the primary ITC credit for all new clean electricity projects. Enterprise buyers should update their underwriting models to reflect the finalized emissions thresholds and bonus structure. This is the most actively traded ITC credit.",
      midMarket: "Good news — the rules are largely as proposed, meaning deals in progress shouldn't need restructuring. The standalone storage qualification opens a significant new transaction category for companies with tax appetite but no prior energy experience.",
      sellers: "Final rules remove a major source of pricing uncertainty. Developers can now market credits with definitive regulatory backing. Storage developers benefit most from the standalone qualification rule."
    },
    relevantCreditTypes: ["§48E"],
    relatedLinks: ["https://www.federalregister.gov/documents/2025/11/20/2025-25891/clean-electricity-investment-credit"]
  },
  {
    id: "reg-007",
    date: "2025-10-08",
    source: "Treasury / IRS",
    title: "Credit pricing dipped — OBBBA reduces buyer tax appetite",
    severity: "medium",
    summary: "ITC credit pricing dropped to approximately 89¢ on the dollar following OBBBA's passage. The law's SALT cap increase and corporate tax adjustments reduced many potential buyers' federal tax liability, thinning the pool of credit purchasers.",
    keyChanges: [
      "Average ITC transfer pricing fell from 92-93¢ to 88-90¢ per dollar of credit",
      "PTC credit pricing remained more stable at 93-95¢ due to recurring annual generation",
      "OBBBA SALT cap increase reduced effective federal tax rates for many corporate buyers",
      "Broker deal volume fell approximately 18% quarter-over-quarter in Q3 2025"
    ],
    buyerImpact: {
      enterprise: "Opportunity window. If your entity still has meaningful federal tax liability after OBBBA adjustments, you can buy credits at historically favorable rates. Run a refreshed tax capacity analysis before year-end.",
      midMarket: "Strong buying moment. The pricing dip disproportionately benefits mid-market buyers who may have been priced out at 92-93¢. Consider accelerating planned credit purchases before pricing stabilizes.",
      sellers: "Adjust expectations. The 89¢ floor reflects genuine demand reduction, not a temporary dip. Sellers should model at current pricing and consider shorter-term forward contracts rather than waiting for a recovery that may not materialize quickly."
    },
    relevantCreditTypes: ["§48E", "§45X", "§45Z", "§45Q"],
    relatedLinks: []
  },
  {
    id: "reg-008",
    date: "2025-09-15",
    source: "USDA",
    title: "USDA issues rural energy project guidance affecting §48E siting",
    severity: "low",
    summary: "The USDA Rural Utilities Service published guidance clarifying how rural electric cooperatives can participate in clean electricity projects eligible for §48E credits, including direct pay provisions and interconnection standards.",
    keyChanges: [
      "Rural co-ops confirmed eligible for direct pay under §6417 for §48E projects",
      "Interconnection cost-sharing framework established for projects under 20MW",
      "USDA will provide technical assistance for co-ops pursuing first-time clean energy development",
      "No change to existing rural energy community bonus eligibility criteria"
    ],
    buyerImpact: {
      enterprise: "Minimal direct impact unless your portfolio includes rural utility-scale projects. The co-op direct pay pathway means these entities won't be selling credits — they'll claim them directly.",
      midMarket: "Watch for partnership opportunities. Co-ops with direct pay access may still seek private capital for project development, creating structured finance opportunities that don't involve credit transfer.",
      sellers: "Rural developers and EPCs benefit from USDA technical assistance and clearer interconnection cost-sharing. This could accelerate project timelines in underserved areas."
    },
    relevantCreditTypes: ["§48E"],
    relatedLinks: ["https://www.rd.usda.gov/programs-services/electric-programs"]
  }
];


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

// ─── Markdown Styles ──────────────────────────────────────
var mdComponents = {
  h1: function(props) { return <h3 style={{ fontSize: 15, fontWeight: 700, color: TXT, margin: "16px 0 8px", lineHeight: 1.3 }}>{props.children}</h3>; },
  h2: function(props) { return <h4 style={{ fontSize: 15, fontWeight: 700, color: TXT, margin: "14px 0 6px", lineHeight: 1.3 }}>{props.children}</h4>; },
  h3: function(props) { return <h5 style={{ fontSize: 13, fontWeight: 700, color: TXT, margin: "12px 0 4px", lineHeight: 1.3 }}>{props.children}</h5>; },
  p: function(props) { return <p style={{ fontSize: 13, lineHeight: 1.7, color: TXT, margin: "0 0 10px" }}>{props.children}</p>; },
  ul: function(props) { return <ul style={{ margin: "4px 0 10px", paddingLeft: 20 }}>{props.children}</ul>; },
  ol: function(props) { return <ol style={{ margin: "4px 0 10px", paddingLeft: 20 }}>{props.children}</ol>; },
  li: function(props) { return <li style={{ fontSize: 13, lineHeight: 1.65, color: TXT, marginBottom: 4 }}>{props.children}</li>; },
  strong: function(props) { return <strong style={{ fontWeight: 700, color: TXT }}>{props.children}</strong>; },
  em: function(props) { return <em style={{ fontStyle: "italic" }}>{props.children}</em>; },
  code: function(props) {
    return <code style={{ fontSize: 12, background: BORDER, padding: "2px 5px", borderRadius: 3, fontFamily: "'IBM Plex Mono',monospace" }}>{props.children}</code>;
  },
  pre: function(props) {
    return <pre style={{ fontSize: 12, background: "#F0EDE6", padding: "12px 14px", borderRadius: 6, overflowX: "auto", margin: "8px 0 10px", fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.5 }}>{props.children}</pre>;
  },
  blockquote: function(props) {
    return <blockquote style={{ borderLeft: "3px solid " + GOLD, margin: "8px 0", paddingLeft: 14, color: TXT2 }}>{props.children}</blockquote>;
  }
};

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
  var contentRef = useRef(null);

  function go() {
    if (!q.trim() || ld) return;
    setLd(true);
    setA("");
    setEr("");
    var sysMsg = "You are CreditPulse, an expert assistant specializing in U.S. clean energy tax credits under the Inflation Reduction Act (IRA) and related legislation.\n\nYour role:\n- Answer questions about clean energy tax credit eligibility, structure, pricing, timelines, and risk\n- Draw ONLY from the curated data provided below — do not speculate or use outside knowledge\n- Be specific: cite section numbers (§45X, §48E, §45Z, etc.), dollar amounts, percentages, and dates whenever possible\n- Acknowledge when a question falls outside your curated data rather than guessing\n\nResponse structure:\n- Lead with a direct answer to the question in 1-2 sentences\n- Follow with supporting detail organized by relevance\n- Use headers and bullet points to improve scannability when the answer has multiple components\n- End with a brief note on what the user should verify with a tax professional if the question involves eligibility or dollar amounts\n\nTone:\n- Confident but precise — like a knowledgeable analyst briefing a CFO\n- Avoid jargon unless the user uses it first, then match their level\n- Keep answers concise — aim for 150-300 words unless the question requires more depth\n\nImportant constraints:\n- Never provide legal or tax advice — always frame as informational\n- Always note when information may have changed since the curated data was last updated\n- If a question is ambiguous, state your interpretation before answering\n\nDATA:\n" + ctx;

    var accumulated = "";

    fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: sysMsg,
        messages: [{ role: "user", content: q }]
      })
    })
    .then(function(res) {
      if (!res.ok) {
        return res.text().then(function(t) {
          var parsed;
          try { parsed = JSON.parse(t); } catch (e) { parsed = null; }
          throw new Error((parsed && parsed.error && parsed.error.message) || "Request failed (" + res.status + ")");
        });
      }

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buf = "";

      function read() {
        return reader.read().then(function(result) {
          if (result.done) {
            setLd(false);
            return;
          }
          buf += decoder.decode(result.value, { stream: true });
          var lines = buf.split("\n");
          buf = lines.pop() || "";

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line.startsWith("data: ")) continue;
            var payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              var evt = JSON.parse(payload);
              if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") {
                accumulated += evt.delta.text;
                setA(accumulated);
              }
              if (evt.type === "message_stop") {
                setLd(false);
              }
              if (evt.type === "error") {
                setEr((evt.error && evt.error.message) || "An error occurred during streaming.");
                setLd(false);
                return;
              }
            } catch (e) {
              // skip non-JSON lines (event: type lines, empty lines)
            }
          }

          if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }

          return read();
        });
      }

      return read();
    })
    .catch(function(e) {
      setEr(e.message || "Unable to connect.");
      setLd(false);
    });
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
            <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>Ask CreditPulse</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, color: TXT3, cursor: "pointer", padding: 0, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
          {a ? (
            <div style={{
              padding: "14px 16px", background: HOVER, borderRadius: 8,
              marginBottom: 14, borderLeft: "3px solid " + GOLD
            }}>
              <ReactMarkdown components={mdComponents}>{a}</ReactMarkdown>
            </div>
          ) : null}
          {ld && !a ? (
            <div style={{
              padding: "14px 16px", background: HOVER, borderRadius: 8,
              marginBottom: 14, borderLeft: "3px solid " + GOLD,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: TXT3 }}>Thinking...</span>
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
          {!a && !er && !ld ? (
            <div>
              <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.6, margin: "0 0 16px" }}>
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
            disabled={ld}
            style={{
              flex: 1, background: HOVER, border: "1px solid " + BORDER,
              borderRadius: 8, padding: "11px 14px", color: TXT, fontSize: 13,
              outline: "none", fontFamily: "inherit",
              opacity: ld ? 0.6 : 1
            }}
          />
          <button
            onClick={go}
            disabled={ld}
            style={{
              background: ld ? BORDER : TXT, color: BG, border: "none",
              borderRadius: 8, padding: "11px 18px", fontWeight: 700, fontSize: 13,
              cursor: ld ? "not-allowed" : "pointer", fontFamily: "inherit"
            }}
          >
            {ld ? "..." : "Ask"}
          </button>
        </div>
        <div style={{ padding: "0 20px 12px", fontSize: 11, color: TXT3, flexShrink: 0 }}>
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
          color: TXT3, fontSize: 15,
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
      fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 6, marginTop: 14,
      paddingLeft: 10, borderLeft: "3px solid " + GOLD
    }}>
      {props.children}
    </div>
  );
}

// ─── Credit Card ──────────────────────────────────────────
function CCard(props) {
  var s = STATUS[props.status] || STATUS.active;

  return (
    <div
      onClick={props.deep ? props.onClick : undefined}
      style={{
        background: CARD,
        border: "1px solid " + BORDER,
        borderRadius: 10, padding: "14px 16px",
        cursor: props.deep ? "pointer" : "default",
        transition: "border-color 0.15s, box-shadow 0.15s",
        opacity: props.status === "terminated" ? 0.6 : 1
      }}
      onMouseEnter={props.deep ? function(e) { e.currentTarget.style.borderColor = "#C8C5BE"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; } : undefined}
      onMouseLeave={props.deep ? function(e) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; } : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: s.c, fontWeight: 700 }}>{props.sec}</span>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.c, fontWeight: 700 }}>{props.type}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: TXT, lineHeight: 1.3 }}>{props.name}</span>
        {props.pending ? (
          <span style={{ fontSize: 11, color: TXT3, fontStyle: "italic", marginLeft: "auto" }}>Coming soon</span>
        ) : null}
      </div>
      <div style={{ fontSize: 13, color: TXT2, lineHeight: 1.55 }}>{props.one}</div>
    </div>
  );
}

function GrpHdr(props) {
  var s = STATUS[props.status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.c }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: s.c, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</span>
      {props.note ? <span style={{ fontSize: 11, color: TXT3, fontStyle: "italic" }}>— {props.note}</span> : null}
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

// ─── Regulatory Monitor Card ─────────────────────────────
function RegCard(props) {
  var item = props.item;
  var nav = props.nav;
  var _o = useState(false);
  var open = _o[0];
  var setOpen = _o[1];
  var _h = useState(false);
  var hov = _h[0];
  var setHov = _h[1];
  var _it = useState("enterprise");
  var impactTab = _it[0];
  var setImpactTab = _it[1];
  var sev = SEVERITY[item.severity];
  var displayDate = (function() {
    var d = new Date(item.date + "T00:00:00");
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  })();

  var IMPACT_LABELS = {
    enterprise: { label: "Enterprise", desc: "Fortune 500 / large-cap" },
    midMarket: { label: "Mid-Market", desc: "$2B–$10B companies" },
    sellers: { label: "Sellers", desc: "Developers & manufacturers" }
  };

  return (
    <div
      onClick={function() { setOpen(!open); }}
      onMouseEnter={function() { setHov(true); }}
      onMouseLeave={function() { setHov(false); }}
      style={{
        background: hov && !open ? HOVER : CARD,
        border: "1px solid " + (open ? "#C8C5BE" : hov ? "#C8C5BE" : BORDER),
        borderLeft: "3px solid " + sev.c,
        borderRadius: 10,
        marginBottom: 12, cursor: "pointer", transition: "all 0.2s",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: "16px 22px" }}>
        {/* Row 1: date, source, severity */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: TXT3 }}>{displayDate}</span>
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 4,
            background: "#F0EDE6", color: TXT2, fontWeight: 700
          }}>{item.source}</span>
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 4,
            background: sev.bg, color: sev.c, fontWeight: 700, letterSpacing: "0.5px"
          }}>{sev.l}</span>
        </div>
        {/* Row 2: credit tags */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {item.relevantCreditTypes.map(function(ct, j) {
            var key = ct.replace("§", "");
            var hasDeep = C[key] && C[key].deep;
            return (
              <span
                key={j}
                onClick={hasDeep ? function(e) { e.stopPropagation(); nav(key); } : undefined}
                style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: hasDeep ? GOLD + "18" : "#F0EDE6",
                  color: hasDeep ? GOLD : TXT3,
                  fontWeight: 700, cursor: hasDeep ? "pointer" : "default",
                  border: hasDeep ? "1px solid " + GOLD + "40" : "1px solid transparent",
                  transition: "all 0.15s"
                }}
              >{ct}{hasDeep ? " \u2192" : ""}</span>
            );
          })}
        </div>
        {/* Row 3: headline + summary */}
        <div style={{ fontSize: 15, fontWeight: 700, color: TXT, lineHeight: 1.35 }}>{item.title}</div>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.55, margin: "6px 0 0" }}>{item.summary}</p>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 500 }}>
            {open ? "Show less \u2212" : "Details +"}
          </span>
        </div>
      </div>
      {open ? (
        <div style={{ padding: "0 22px 20px", borderTop: "1px solid " + BORDER }}>
          {/* Key Changes */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 8,
              paddingLeft: 10, borderLeft: "3px solid " + GOLD
            }}>Key Changes</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {item.keyChanges.map(function(kc, j) {
                return <li key={j} style={{ fontSize: 13, color: TXT2, lineHeight: 1.6, marginBottom: 4 }}>{kc}</li>;
              })}
            </ul>
          </div>
          {/* Buyer Impact — tabbed */}
          <div style={{ marginTop: 18 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 10,
              paddingLeft: 10, borderLeft: "3px solid " + GOLD
            }}>Buyer Impact</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {["enterprise", "midMarket", "sellers"].map(function(seg) {
                var active = impactTab === seg;
                return (
                  <button
                    key={seg}
                    onClick={function(e) { e.stopPropagation(); setImpactTab(seg); }}
                    style={{
                      fontSize: 11, padding: "4px 12px", borderRadius: 4,
                      background: active ? TXT : "transparent",
                      color: active ? "#fff" : TXT2,
                      border: "1px solid " + (active ? TXT : BORDER),
                      fontWeight: active ? 700 : 400,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s"
                    }}
                  >{IMPACT_LABELS[seg].label}</button>
                );
              })}
            </div>
            <div style={{ padding: "12px 14px", background: HOVER, borderRadius: 8, border: "1px solid " + BORDER }}>
              <div style={{ fontSize: 11, color: TXT3, marginBottom: 6 }}>{IMPACT_LABELS[impactTab].desc}</div>
              <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.6, margin: 0 }}>{item.buyerImpact[impactTab]}</p>
            </div>
          </div>
          {/* Source Links */}
          {item.relatedLinks.length > 0 ? (
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.relatedLinks.map(function(link, j) {
                return (
                  <a
                    key={j}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={function(e) { e.stopPropagation(); }}
                    style={{
                      fontSize: 11, color: GOLD, textDecoration: "none",
                      padding: "4px 10px", borderRadius: 4,
                      border: "1px solid " + GOLD + "40", background: GOLD + "08"
                    }}
                  >Source document \u2197</a>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────
function TLItem(props) {
  var t = props.item;
  var nav = props.nav;
  var expandable = !t.past && t.detail;
  var _o = useState(false);
  var open = _o[0];
  var setOpen = _o[1];

  var dotBg = "#D0CEC8";
  if (t.urg) dotBg = "#BF360C";
  else if (t.next) dotBg = TXT;
  else if (t.type === "guidance" && !t.past) dotBg = "#E65100";

  return (
    <div
      onClick={expandable ? function() { setOpen(!open); } : undefined}
      style={{
        marginBottom: 16, position: "relative",
        cursor: expandable ? "pointer" : "default"
      }}
    >
      <div style={{
        position: "absolute", left: -28, top: 5, width: 10, height: 10,
        borderRadius: t.type === "guidance" ? 2 : "50%",
        background: dotBg,
        border: t.next ? "2px solid " + TXT : "none"
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{
          fontSize: 11,
          color: t.past ? "#B0ADA6" : t.urg ? "#BF360C" : TXT2,
          fontWeight: t.urg || t.next ? 700 : 400,
          textDecoration: t.past ? "line-through" : "none"
        }}>{t.d}</span>
        {t.next ? <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 4, background: TXT, color: "#fff", fontWeight: 700 }}>NEXT</span> : null}
        {t.type === "guidance" && !t.past ? <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 4, background: "#FFF3E0", color: "#E65100", fontWeight: 700 }}>GUIDANCE</span> : null}
        {t.urg ? <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 4, background: "#FBE9E7", color: "#BF360C", fontWeight: 700 }}>URGENT</span> : null}
      </div>
      <div style={{ fontSize: 13, color: t.past ? "#B0ADA6" : t.urg ? TXT : TXT2, lineHeight: 1.5 }}>{t.e}</div>
      {expandable && !open ? (
        <span style={{ fontSize: 11, color: GOLD, fontWeight: 500, marginTop: 4, display: "inline-block" }}>More +</span>
      ) : null}
      {expandable && open ? (
        <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: "2px solid " + GOLD + "40" }}>
          <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.6, margin: "0 0 8px" }}>{t.detail}</p>
          {t.credits && t.credits.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {t.credits.map(function(ct, j) {
                var key = ct.replace("§", "");
                var hasDeep = C[key] && C[key].deep;
                return (
                  <span
                    key={j}
                    onClick={hasDeep ? function(e) { e.stopPropagation(); nav(key); } : undefined}
                    style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 4,
                      background: hasDeep ? GOLD + "18" : "#F0EDE6",
                      color: hasDeep ? GOLD : TXT3,
                      fontWeight: 700, cursor: hasDeep ? "pointer" : "default",
                      border: hasDeep ? "1px solid " + GOLD + "40" : "1px solid transparent",
                      transition: "all 0.15s"
                    }}
                  >{ct}{hasDeep ? " \u2192" : ""}</span>
                );
              })}
            </div>
          ) : null}
          <span style={{ fontSize: 11, color: GOLD, fontWeight: 500, marginTop: 6, display: "inline-block" }}>Less \u2212</span>
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

  return (
    <div>
      <button
        onClick={props.onBack}
        style={{
          background: "none", border: "none", color: GOLD, fontSize: 13,
          cursor: "pointer", padding: "6px 0", marginBottom: 14,
          fontFamily: "inherit", fontWeight: 500
        }}
      >
        ← Back to Overview
      </button>

      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 700, color: s.c }}>{c.sec}</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, background: s.bg, color: s.c, fontWeight: 700 }}>{s.l}</span>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, background: "#F0EDE6", color: TXT3, fontWeight: 700 }}>{c.type}</span>
        </div>
        <h1 style={{ fontSize: 20, color: TXT, margin: "0 0 12px", fontWeight: 700, lineHeight: 1.3 }}>{c.name}</h1>
        <p style={{ fontSize: 15, color: TXT2, lineHeight: 1.7, maxWidth: 720, margin: 0 }}>{c.sum}</p>
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
              <div style={{ fontSize: 11, fontWeight: 700, color: TXT3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{item[2]}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 20, fontWeight: 700, color: TXT, marginBottom: 2 }}>{item[0]}</div>
              <div style={{ fontSize: 11, color: TXT3, lineHeight: 1.3 }}>{item[1]}</div>
            </div>
          );
        })}
      </div>

      {/* ── ALWAYS VISIBLE: TL;DR ── */}
      <div style={{
        marginBottom: 16, background: CARD,
        border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>TL;DR</span>
        </div>
        <div style={{ padding: "4px 20px 18px", borderTop: "1px solid " + BORDER }}>
          {c.bl.map(function(b, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: s.c, flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 13, color: i === 0 ? TXT : TXT2, lineHeight: 1.55, fontWeight: i === 0 ? 700 : 400 }}>{b}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALWAYS VISIBLE: Key Dates ── */}
      <div style={{
        marginBottom: 16, background: CARD,
        border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>Key Dates</span>
        </div>
        <div style={{ padding: "4px 20px 18px", borderTop: "1px solid " + BORDER }}>
          {c.tl.dates.map(function(d, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < c.tl.dates.length - 1 ? 10 : 0 }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 13,
                  color: d.u ? "#BF360C" : s.c, minWidth: 100, flexShrink: 0,
                  fontWeight: d.u ? 700 : 400
                }}>{d.d}</span>
                <span style={{ fontSize: 13, color: d.u ? TXT : TXT2, lineHeight: 1.45 }}>
                  {d.e}{d.u ? " ⚠" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALWAYS VISIBLE: Cross-Credit Comparison ── */}
      {(function() {
        var cols = [
          { key: "45X", label: "§45X", sub: "Manufacturing" },
          { key: "48E", label: "§48E", sub: "Power / Storage" },
          { key: "45Z", label: "§45Z", sub: "Clean Fuel" },
          { key: "45Q", label: "§45Q", sub: "Carbon Capture" }
        ];
        var rows = [
          { label: "Pricing", vals: ["93.5–96¢", "~89¢", "Discount", "85–90¢"] },
          { label: "Risk", vals: ["Low", "Moderate", "Elevated", "Elevated"] },
          { label: "Market share", vals: ["27%", "26%", "Growing", "Growing"] },
          { label: "Rules finalized", vals: ["Mostly yes", "Mostly yes", "No — proposed", "Partially"] },
          { label: "Deal timeline", vals: ["8–16 wks", "8–14 wks", "12–20 wks", "12–20 wks"] }
        ];
        return (
          <div style={{
            marginBottom: 16, background: CARD,
            border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden"
          }}>
            <div style={{ padding: "14px 20px" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>Compare Across Credits</span>
            </div>
            <div style={{ padding: "4px 20px 18px", borderTop: "1px solid " + BORDER }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid " + BORDER }}></th>
                    {cols.map(function(col) {
                      var isCurrent = c.sec === col.label;
                      return (
                        <th key={col.key} style={{
                          textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 700,
                          color: isCurrent ? GOLD : TXT3,
                          borderBottom: "1px solid " + BORDER,
                          background: isCurrent ? GOLD + "0A" : "transparent"
                        }}>
                          <div>{col.label}</div>
                          <div style={{ fontWeight: 400, fontSize: 10, marginTop: 1 }}>{col.sub}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(function(row, ri) {
                    return (
                      <tr key={ri}>
                        <td style={{ padding: "7px 8px", color: TXT3, fontSize: 11, fontWeight: 700, borderBottom: ri < rows.length - 1 ? "1px solid " + BORDER : "none" }}>{row.label}</td>
                        {row.vals.map(function(val, ci) {
                          var isCurrent = c.sec === cols[ci].label;
                          return (
                            <td key={ci} style={{
                              padding: "7px 8px", fontSize: 13,
                              color: isCurrent ? TXT : TXT2,
                              fontWeight: isCurrent ? 700 : 400,
                              borderBottom: ri < rows.length - 1 ? "1px solid " + BORDER : "none",
                              background: isCurrent ? GOLD + "0A" : "transparent"
                            }}>{val}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ── ALWAYS VISIBLE: Risk Profile ── */}
      {c.risks ? (
        <div style={{
          marginBottom: 16, background: CARD,
          border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden"
        }}>
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: TXT }}>Risk Profile</span>
            <span style={{
              fontSize: 11, padding: "2px 10px", borderRadius: 4,
              background: scoreColor + "14", color: scoreColor, fontWeight: 700,
              letterSpacing: "0.3px"
            }}>{c.riskScore.level.toUpperCase()}</span>
          </div>
          <div style={{ padding: "4px 20px 18px", borderTop: "1px solid " + BORDER }}>
            <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.risks.summary}</p>
          </div>
        </div>
      ) : null}

      {/* ── COLLAPSED: OBBBA Changes ── */}
      <Sec title="What Changed Under OBBBA" startOpen={false}>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.7, margin: 0 }}>{c.obbba}</p>
      </Sec>

      {/* ── COLLAPSED: Credit Mechanics (includes transferability + direct pay) ── */}
      <Sec title="Credit Mechanics" startOpen={false}>
        <Lbl>What Qualifies</Lbl>
        {c.how.elig.map(function(e, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
              <span style={{ color: s.c, flexShrink: 0, marginTop: 2 }}>•</span>
              <span style={{ fontSize: 13, color: TXT2, lineHeight: 1.55 }}>{e}</span>
            </div>
          );
        })}
        <Lbl>How Much It's Worth</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: "0 0 10px" }}>{c.how.val}</p>
        {c.how.valTable ? (
          <div style={{ background: HOVER, borderRadius: 8, padding: "12px 16px", marginBottom: 10, border: "1px solid " + BORDER }}>
            {c.how.valTable.map(function(row, i) {
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0",
                  borderBottom: i < c.how.valTable.length - 1 ? "1px solid " + BORDER : "none"
                }}>
                  <span style={{ fontSize: 13, color: TXT2 }}>{row[0]}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: TXT, fontWeight: 700 }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        <Lbl>Bonuses</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.bonus}</p>
        <Lbl>Duration</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.dur}</p>
        <Lbl>Market Detail</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: "0 0 4px" }}>{c.mkt.price}</p>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: "0 0 4px" }}>{c.mkt.share}</p>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.mkt.deal}</p>
        <Lbl>Transferability</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.xfer}</p>
        <Lbl>Direct Pay</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: 0 }}>{c.how.epay}</p>
      </Sec>

      {/* ── COLLAPSED: Begin Construction (48E only) ── */}
      {c.beginConstruction ? (
        <Sec title="What Does 'Begin Construction' Actually Mean?" startOpen={false}>
          {c.beginConstruction.map(function(para, i) {
            return <p key={i} style={{ fontSize: 13, color: TXT2, lineHeight: 1.65, margin: "0 0 12px" }}>{para}</p>;
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
                <span style={{ fontSize: 13, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
          <Lbl>What you can mitigate</Lbl>
          {c.risks.mitigable.map(function(r, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#2E7D32", flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 13, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
          <Lbl>What's still uncertain</Lbl>
          {c.risks.uncertain.map(function(r, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#E65100", flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 13, color: TXT2, lineHeight: 1.6 }}>{r}</span>
              </div>
            );
          })}
        </Sec>
      ) : null}

      {/* ── COLLAPSED: Regulatory Status & FEOC (merged) ── */}
      <Sec title="Regulatory Status & FEOC" startOpen={false}>
        <Lbl>Foreign Supply Chain Restrictions</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.7, margin: 0 }}>{c.feoc}</p>
        <Lbl>Current Guidance</Lbl>
        <p style={{ fontSize: 13, color: TXT2, lineHeight: 1.6, margin: "0 0 10px" }}>{c.guid.stat}</p>
        <Lbl>Unresolved Questions</Lbl>
        {c.guid.open.map(function(q, i) {
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
              <span style={{ color: "#E65100", flexShrink: 0, fontWeight: 700 }}>?</span>
              <span style={{ fontSize: 13, color: TXT2, lineHeight: 1.55 }}>{q}</span>
            </div>
          );
        })}
      </Sec>

      {/* DISCLAIMER */}
      <div style={{ padding: "14px 20px", background: HOVER, borderRadius: 8, border: "1px solid " + BORDER }}>
        <p style={{ fontSize: 11, color: TXT3, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: TXT2 }}>Disclaimer:</strong> CreditPulse is educational only. Not legal, tax, or investment advice. Every transaction is different — consult a qualified tax advisor or energy attorney. Data as of {LAST_UPDATED}.
        </p>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────
function Home(props) {
  var nav = props.nav;
  var _sp = useState(false);
  var showPast = _sp[0];
  var setShowPast = _sp[1];

  var tlUpcoming = TL.filter(function(t) { return !t.past; });
  var tlPast = TL.filter(function(t) { return t.past; });

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
        background: BORDER, borderRadius: 10, overflow: "hidden", marginBottom: 48
      }}>
        {[
          ["89–96¢", "Credit pricing range (per $1)"],
          ["12-mo low", "Supply-to-demand ratio — buyer's market"],
          ["8–16 wks", "Median time from listing to close"]
        ].map(function(item, i) {
          return (
            <div key={i} style={{ background: CARD, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 700, color: TXT, marginBottom: 4 }}>{item[0]}</div>
              <div style={{ fontSize: 11, color: TXT3, lineHeight: 1.35 }}>{item[1]}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, color: TXT, margin: "0 0 16px", fontWeight: 700 }}>Credit Status After OBBBA</h2>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="expanded" note="OBBBA made these credits better" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            <CCard sec={C["45Z"].sec} name={C["45Z"].name} type={C["45Z"].type} status={C["45Z"].st} one={C["45Z"].one} onClick={function() { nav("45Z"); }} deep={true} />
            <CCard sec={C["45Q"].sec} name={C["45Q"].name} type={C["45Q"].type} status={C["45Q"].st} one={C["45Q"].one} onClick={function() { nav("45Q"); }} deep={true} />
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
            <CCard sec={C["45X"].sec} name={C["45X"].name} type={C["45X"].type} status={C["45X"].st} one={C["45X"].one} onClick={function() { nav("45X"); }} deep={true} />
            <CCard sec="§45V" name="Clean Hydrogen Production" type="PTC" status="modified" one="Credit active but rules contentious. FEOC restrictions apply." pending={true} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <GrpHdr status="sunsetting" note="Facing accelerated expiration" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            <CCard sec="§45Y" name="Clean Electricity Production Credit" type="PTC" status="sunsetting" one="Same wind/solar deadline: construction must start by July 4, 2026." pending={true} />
            <CCard sec={C["48E"].sec} name={C["48E"].name} type={C["48E"].type} status={C["48E"].st} one={C["48E"].one} onClick={function() { nav("48E"); }} deep={true} />
          </div>
        </div>

      </div>

      {/* ── Key Deadlines ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, color: TXT, margin: "0 0 16px", fontWeight: 700 }}>Key Deadlines</h2>
        <div style={{ borderLeft: "2px solid " + BORDER, paddingLeft: 22, marginLeft: 6 }}>
          {tlUpcoming.map(function(t, i) {
            return <TLItem key={i} item={t} nav={nav} />;
          })}
        </div>
        {/* Past milestones toggle */}
        <button
          onClick={function() { setShowPast(!showPast); }}
          style={{
            marginTop: 8, fontSize: 12, color: TXT3, background: "none",
            border: "1px solid " + BORDER, borderRadius: 6, padding: "6px 14px",
            cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
            transition: "all 0.15s"
          }}
        >{showPast ? "Hide past milestones \u2212" : "Show past milestones +"}</button>
        {showPast ? (
          <div style={{ borderLeft: "2px solid " + BORDER, paddingLeft: 22, marginLeft: 6, marginTop: 16, opacity: 0.7 }}>
            {tlPast.map(function(t, i) {
              return <TLItem key={"past-" + i} item={t} nav={nav} />;
            })}
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, color: TXT, margin: "0 0 16px", fontWeight: 700 }}>Regulatory Monitor</h2>
        {NEWS.map(function(item) {
          return <RegCard key={item.id} item={item} nav={nav} />;
        })}
      </div>

      <div style={{ padding: "14px 20px", background: HOVER, borderRadius: 8, border: "1px solid " + BORDER }}>
        <p style={{ fontSize: 11, color: TXT3, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: TXT2 }}>Disclaimer:</strong> CreditPulse is educational only. Not legal, tax, or investment advice. Data sourced from IRA/OBBBA statutory text, IRS/Treasury guidance, and Crux Climate market reports. Last updated {LAST_UPDATED}. Consult qualified advisors before transacting.
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
        "::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:3px;}" +
        "@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}"
      }</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "36px 24px 80px", opacity: fade ? 1 : 0, transition: "opacity 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18, borderBottom: "1px solid " + BORDER, position: "sticky", top: 0, background: BG, zIndex: 100, paddingTop: 12, marginBottom: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: view !== "home" ? "pointer" : "default" }}
            onClick={view !== "home" ? function() { nav("home"); } : undefined}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: TXT, letterSpacing: "0.04em" }}>CREDITPULSE</span>
            <span style={{ fontSize: 12, color: TXT3, fontWeight: 400 }}>Tracking the evolving clean energy tax credit landscape</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: TXT3 }}>
              Built by{" "}
              <a href="https://www.linkedin.com/in/jaredhutchinson/" target="_blank" rel="noopener noreferrer" style={{ color: TXT2, textDecoration: "none", borderBottom: "1px solid " + BORDER, fontWeight: 500 }}>
                Jared Hutchinson
              </a>
            </span>
            <button
              onClick={function() { setSidebarOpen(true); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: TXT, color: BG, border: "none", borderRadius: 6,
                padding: "7px 14px", fontSize: 13, fontWeight: 700,
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
