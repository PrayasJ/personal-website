import type { Tool } from "@/lib/tools";

export const calculatorTools: Tool[] = [
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description: "Reducing-balance loan EMI in INR, with the first year of the schedule.",
    category: "calculator",
    keywords: ["emi", "loan", "home loan", "reducing balance", "inr", "emi calculator india"],
    path: "/calculators/emi-calculator",
    title: "EMI Calculator India — Reducing Balance Home Loan EMI",
    metaDescription:
      "Free EMI calculator for India. Monthly reducing-balance EMI, total interest, first-year schedule. INR, in your browser. Not a loan offer.",
    h1: "EMI Calculator (India)",
    intro:
      "Principal, annual rate, and tenure in years. EMI uses a monthly reducing balance. Numbers are illustrative and not an offer of credit.",
    related: ["ctc-calculator", "rd-calculator", "fd-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is this my bank’s EMI?",
        answer:
          "Unlikely. Banks add fees, rounding, and sometimes a different day-count. This is the textbook formula.",
      },
      {
        question: "Is this financial advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "₹5 lakh at 8.5% for 20 years",
        code: "P=500000, r=8.5, n=20",
      },
    ],
    sections: [
      {
        title: "The formula",
        paragraphs: [
          "Monthly rate r is annual percent divided by 1200. EMI is P·r·(1+r)^n / ((1+r)^n−1). Interest each month is charged on the remaining principal.",
        ],
      },
    ],
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description: "Future value of a monthly SIP with a stated expected return.",
    category: "calculator",
    keywords: ["sip", "mutual fund", "investment", "future value", "inr", "sip calculator india"],
    path: "/calculators/sip-calculator",
    title: "SIP Calculator India — Monthly Mutual Fund Returns",
    metaDescription:
      "Free SIP calculator for India. Estimate future value of a monthly SIP with monthly compounding. INR, in your browser. Not investment advice.",
    h1: "SIP Calculator (India)",
    intro:
      "Monthly contribution, expected annual return, and years. The future value assumes monthly compounding at that rate. Markets do not guarantee it.",
    related: ["rd-calculator", "ppf-calculator", "emi-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the return guaranteed?",
        answer:
          "No. The rate is an input you type. Actual mutual-fund returns vary and can be negative.",
      },
      {
        question: "Is this investment advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "₹10,000 a month for 10 years at 12%",
        code: "PMT=10000, r=12, n=10",
      },
    ],
    sections: [
      {
        title: "The formula",
        paragraphs: [
          "Monthly rate i is annual percent divided by 1200. Future value is PMT · (((1+i)^n − 1) / i) · (1+i), with n in months. Invested capital is PMT · n.",
        ],
      },
    ],
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    description: "Fixed deposit maturity with yearly to monthly compounding.",
    category: "calculator",
    keywords: ["fd", "fixed deposit", "compound interest", "inr"],
    path: "/calculators/fd-calculator",
    title: "FD Calculator India — Compound Interest | Prayas.dev",
    metaDescription:
      "Estimate FD maturity and interest in your browser. Quarterly compounding by default. Not a bank quote.",
    h1: "FD Calculator",
    intro:
      "Principal, annual rate, years, and compounding frequency. Quarterly is the usual Indian default. Banks still round and may deduct TDS.",
    related: ["sip-calculator", "emi-calculator", "percentage-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this my bank’s maturity?",
        answer:
          "Probably not exactly. Formula is P(1+r/n)^(n·t). Payout options and TDS are ignored.",
      },
      {
        question: "Is this financial advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "₹1 lakh at 7.1% for 5 years, quarterly",
        code: "P=100000, r=7.1, n=5, freq=4",
      },
    ],
    sections: [
      {
        title: "Compounding",
        paragraphs: [
          "More frequent compounding grows a little faster at the same advertised rate. Monthly vs quarterly is a small gap for typical FD tenures.",
        ],
      },
    ],
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    description: "Add or remove India GST and split CGST / SGST.",
    category: "calculator",
    keywords: ["gst", "cgst", "sgst", "india tax", "invoice"],
    path: "/calculators/gst-calculator",
    title: "GST Calculator India — Inclusive & Exclusive Online",
    metaDescription:
      "Add or remove GST at 0, 5, 12, 18, or 28 percent. Shows CGST and SGST. Runs in your browser. Not tax advice.",
    h1: "GST Calculator",
    intro:
      "Exclusive or inclusive amount, plus a GST slab. CGST and SGST are half each. IGST for interstate supply is the full GST line.",
    related: ["percentage-calculator", "emi-calculator", "fd-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this my GST return?",
        answer: "No. It is arithmetic on one amount. File returns with a CA or the portal.",
      },
      {
        question: "Is this tax advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "₹1,000 exclusive at 18%",
        code: "amount=1000, rate=18",
      },
    ],
    sections: [
      {
        title: "Inclusive vs exclusive",
        paragraphs: [
          "Exclusive: GST is rate × base. Inclusive: base is total ÷ (1+rate). The checkbox switches that.",
        ],
      },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "x% of y, x is what % of y, and percent change.",
    category: "calculator",
    keywords: ["percentage", "percent change", "markup"],
    path: "/calculators/percentage-calculator",
    title: "Percentage Calculator Online | Prayas.dev",
    metaDescription:
      "Calculate x% of y, what percent x is of y, and percent change. Runs in your browser.",
    h1: "Percentage Calculator",
    intro:
      "Three percent problems on one blotter. Useful next to GST and returns. Not financial advice.",
    related: ["gst-calculator", "sip-calculator", "fd-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Division by zero?",
        answer: "Percent-of-y and percent-change need a non-zero base. The page says so.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "The arithmetic",
        paragraphs: [
          "Portion is p/100 × y. Ratio is x/y × 100. Change is (to−from)/from × 100.",
        ],
      },
    ],
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    description: "Public Provident Fund maturity with annual compounding in INR.",
    category: "calculator",
    keywords: ["ppf", "public provident fund", "india", "15 year"],
    path: "/calculators/ppf-calculator",
    title: "PPF Calculator India — 15 Year | Prayas.dev",
    metaDescription:
      "Estimate PPF maturity with yearly deposits and annual compounding. ₹1.5 lakh cap. Runs in your browser. Not investment advice.",
    h1: "PPF Calculator",
    intro:
      "Yearly deposit, notified rate, and tenure. Deposits are treated as made at the start of each year. The notified rate changes. Not tax advice.",
    related: ["rd-calculator", "fd-calculator", "sip-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Is the rate fixed?",
        answer:
          "No. The Government notifies a PPF rate. This page uses whatever you type, defaulting to 7.1%.",
      },
      {
        question: "Can I deposit more than ₹1.5 lakh?",
        answer: "The statutory cap is ₹1.5 lakh a year. The calculator refuses a higher figure.",
      },
    ],
    examples: [
      {
        title: "Max yearly for 15 years at 7.1%",
        code: "P=150000, r=7.1, n=15",
      },
    ],
    sections: [
      {
        title: "The assumption",
        paragraphs: [
          "Each year’s deposit is added, then the balance is multiplied by (1+r). Intra-year timing (before the 5th) is ignored. Banks and the Post Office will differ by rupees.",
        ],
      },
    ],
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    description: "Recurring deposit maturity with quarterly compounding in INR.",
    category: "calculator",
    keywords: ["rd", "recurring deposit", "india", "quarterly compounding"],
    path: "/calculators/rd-calculator",
    title: "RD Calculator India — Recurring Deposit | Prayas.dev",
    metaDescription:
      "Estimate recurring deposit maturity with monthly installments and quarterly compounding. INR, in your browser. Not a bank quote.",
    h1: "RD Calculator",
    intro:
      "Monthly installment, annual rate, tenure in months. Each installment compounds quarterly for the remaining term. Not a quote.",
    related: ["ppf-calculator", "fd-calculator", "sip-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this my bank’s RD?",
        answer:
          "Unlikely to the rupee. Banks round, cut months, and publish their own tables. This is the compounding model described on the page.",
      },
    ],
    examples: [
      {
        title: "₹5,000 a month for a year at 6.5%",
        code: "M=5000, r=6.5, n=12",
      },
    ],
    sections: [
      {
        title: "Compounding",
        paragraphs: [
          "The quarterly rate is annual ÷ 400. Installment m sits for (N−m)/3 quarters. Sum those future values.",
        ],
      },
    ],
  },
  {
    slug: "gratuity-calculator",
    name: "Gratuity Calculator",
    description: "India gratuity under the Act (/26) or a non-covered /30 formula.",
    category: "calculator",
    keywords: ["gratuity", "payment of gratuity act", "india", "15/26"],
    path: "/calculators/gratuity-calculator",
    title: "Gratuity Calculator India — 15/26 | Prayas.dev",
    metaDescription:
      "Estimate statutory gratuity: last drawn × 15 × years / 26, ₹20 lakh cap. Non-covered /30. Not legal advice.",
    h1: "Gratuity Calculator",
    intro:
      "Last drawn basic plus DA, years of service, and whether the Payment of Gratuity Act applies. More than six months rounds up. Cap ₹20 lakh under the Act. Not legal advice.",
    related: ["ctc-calculator", "in-hand-salary", "percentage-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Five-year rule?",
        answer:
          "Covered employees usually need five years. The calculator says so. Exceptions (death, disablement) are not modelled.",
      },
      {
        question: "What is last drawn?",
        answer: "Basic plus dearness allowance, not CTC and not bonuses, unless your contract says otherwise.",
      },
    ],
    examples: [
      {
        title: "₹50,000 last drawn, 7 years, covered",
        code: "(50000 × 15 × 7) / 26",
      },
    ],
    sections: [
      {
        title: "The two formulae",
        paragraphs: [
          "Act: (salary × 15 × years) / 26, capped at ₹20 lakh. Some establishments outside the Act use /30 and no statutory cap on this page.",
        ],
      },
    ],
  },
  {
    slug: "ctc-calculator",
    name: "CTC Calculator",
    description: "Split India CTC into basic, HRA, special, employer PF, and gratuity.",
    category: "calculator",
    keywords: ["ctc", "cost to company", "basic", "hra", "salary structure"],
    path: "/calculators/ctc-calculator",
    title: "CTC Calculator India — Basic, HRA, PF Split",
    metaDescription:
      "Break annual CTC into basic, HRA, special allowance, employer PF, and gratuity in your browser. Not a CTC letter.",
    h1: "CTC Calculator",
    intro:
      "Annual CTC, basic percent, metro or other HRA, optional ₹15,000 PF wage cap. Employer PF is 12%. Gratuity provision is 4.81% of basic. Special allowance is the remainder. Not HR advice.",
    related: ["in-hand-salary", "income-tax-calculator", "gst-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is this my offer letter?",
        answer:
          "Unlikely. Companies pick different basic percents, HRA policies, and whether PF is capped. This is a common IT template.",
      },
      {
        question: "Is employer PF part of in-hand?",
        answer: "No. Gross here is basic + HRA + special. PF and gratuity stay in CTC.",
      },
    ],
    examples: [
      {
        title: "₹12 lakh, 40% basic, metro",
        code: "CTC=1200000, basic=40%, HRA=50% of basic",
      },
    ],
    sections: [
      {
        title: "The split",
        paragraphs: [
          "Basic is a percent of CTC. HRA is 50% of basic in metro cities and 40% otherwise. Employer PF is 12% of basic, or of ₹1.8 lakh a year if you cap the wage. Gratuity provision uses 4.81% of basic. Special allowance takes what is left.",
        ],
      },
    ],
  },
  {
    slug: "in-hand-salary",
    name: "In-hand salary",
    description: "Estimate monthly in-hand from CTC or gross under the new tax regime.",
    category: "calculator",
    keywords: ["in-hand salary", "take home", "tds", "new regime", "epf"],
    path: "/calculators/in-hand-salary",
    title: "In-hand Salary Calculator India — New Tax Regime",
    metaDescription:
      "Estimate in-hand salary from CTC or monthly gross. New regime slabs after Budget 2025, EPF, professional tax. Not tax advice.",
    h1: "In-hand salary",
    intro:
      "Start from annual CTC or monthly gross. Employee PF, professional tax, and new-regime income tax (₹75,000 standard deduction, ₹12 lakh rebate, 4% cess) come off. Surcharge above ₹50 lakh is not modelled. Not tax advice.",
    related: ["ctc-calculator", "income-tax-calculator", "hra-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Old regime?",
        answer:
          "Not on this page. 80C, HRA exemption, and the old slabs are omitted so the numbers stay inspectable. Use the HRA calculator for old-regime exemption only.",
      },
      {
        question: "Is EPF a tax deduction here?",
        answer:
          "It reduces in-hand. It does not reduce taxable income under the new regime on this page.",
      },
    ],
    examples: [
      {
        title: "₹12 lakh CTC, metro, ₹200 PT",
        code: "new regime, standard deduction 75000, rebate to 12L",
      },
    ],
    sections: [
      {
        title: "Tax",
        paragraphs: [
          "Slabs follow Budget 2025’s new regime. Income up to ₹12 lakh after standard deduction is rebated to zero. Just above that, tax is limited by marginal relief so you never pay more tax than the rupees over ₹12 lakh until the slab tax is smaller. Then 4% cess.",
        ],
      },
    ],
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    description:
      "New-regime income tax for India: slabs, §87A rebate, and 4% cess.",
    category: "calculator",
    keywords: [
      "income tax calculator",
      "new regime",
      "87A",
      "budget 2025",
      "income tax india",
    ],
    path: "/calculators/income-tax-calculator",
    title: "Income Tax Calculator India — New Regime FY 2025-26",
    metaDescription:
      "Free new-regime income tax calculator for India. Budget 2025 slabs, §87A rebate to ₹12 lakh, 4% cess. Runs in your browser. Not tax advice.",
    h1: "Income Tax Calculator (New Regime)",
    intro:
      "Enter taxable income, or gross income and subtract the ₹75,000 standard deduction. See slab tax, §87A rebate, cess, and total. Surcharge above ₹50 lakh is not modelled. Not tax advice.",
    related: ["in-hand-salary", "ctc-calculator", "hra-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is this old regime?",
        answer:
          "No. Only the new regime after Budget 2025. Old slabs, 80C, and HRA exemption are not on this page.",
      },
      {
        question: "What is the ₹12 lakh rebate?",
        answer:
          "If taxable income is at most ₹12 lakh, §87A rebates income tax to zero. Just above that, marginal relief caps tax so you do not pay more tax than the rupees over ₹12 lakh until the slab tax is smaller.",
      },
      {
        question: "Is this tax advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "₹12 lakh taxable",
        code: "taxable=1200000 → tax 0 after §87A",
      },
    ],
    sections: [
      {
        title: "The slabs",
        paragraphs: [
          "0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%, 16–20L 20%, 20–24L 25%, above 24L 30%. Then 4% cess. The in-hand salary page uses the same helper; this page is only the tax line.",
        ],
      },
    ],
  },
  {
    slug: "hra-calculator",
    name: "HRA Calculator",
    description:
      "Old-regime HRA exemption: least of actual HRA, % of basic, and rent − 10% basic.",
    category: "calculator",
    keywords: [
      "hra calculator",
      "hra exemption",
      "section 10(13A)",
      "house rent allowance",
      "metro hra",
    ],
    path: "/calculators/hra-calculator",
    title: "HRA Calculator India — Exemption under Section 10(13A)",
    metaDescription:
      "Calculate HRA exemption for India (old regime): min of actual HRA, 50%/40% of basic, rent minus 10% of basic. Browser only. Not tax advice.",
    h1: "HRA Exemption Calculator",
    intro:
      "Annual basic, HRA received, and rent paid. Metro uses 50% of basic; other cities 40%. Exemption is the least of three figures. The new regime does not allow this. Not tax advice.",
    related: ["income-tax-calculator", "ctc-calculator", "in-hand-salary"],
    localProcessing: true,
    faqs: [
      {
        question: "New regime?",
        answer:
          "HRA exemption under section 10(13A) applies to the old regime. Under the new regime this exemption is not available.",
      },
      {
        question: "Monthly or annual?",
        answer: "Enter annual figures (or multiply monthly × 12).",
      },
      {
        question: "Is this tax advice?",
        answer: "No.",
      },
    ],
    examples: [
      {
        title: "Metro example",
        code: "basic=480000, HRA=240000, rent=300000 → min of three",
      },
    ],
    sections: [
      {
        title: "The three caps",
        paragraphs: [
          "Exemption is the minimum of: (1) HRA actually received, (2) 50% of basic in metro cities or 40% otherwise, (3) rent paid minus 10% of basic. Anything above that is taxable HRA.",
        ],
      },
    ],
  },
];
