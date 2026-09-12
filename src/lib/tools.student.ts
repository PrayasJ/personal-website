import type { Tool } from "@/lib/tools";

export const studentTools: Tool[] = [
  {
    slug: "cgpa-to-percentage",
    name: "CGPA to percentage",
    description:
      "Convert CGPA to percentage with a multiplier (default 9.5) or a custom factor.",
    category: "student",
    keywords: [
      "cgpa to percentage",
      "convert cgpa to percentage",
      "cgpa calculator",
      "sgpa to percentage",
    ],
    path: "/student/cgpa-to-percentage",
    title: "CGPA to Percentage Converter Online — Free",
    metaDescription:
      "Convert CGPA to percentage with the common ×9.5 formula or a custom multiplier. Boards and colleges differ — check your handbook.",
    h1: "CGPA to Percentage",
    intro:
      "Default multiplier is 9.5 (a common CBSE-style rule of thumb). Your university may use a different factor — set a custom multiplier when you know it.",
    related: ["attendance-calculator", "percentage-calculator", "age-calculator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is ×9.5 official everywhere?",
        answer:
          "No. Many Indian boards and universities publish their own conversion. Use the factor from your mark sheet or handbook.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Caveats",
        paragraphs: [
          "Percentage = CGPA × multiplier. Some institutions use grade tables instead of a single factor. This tool does not replace an official transcript.",
        ],
      },
    ],
  },
  {
    slug: "attendance-calculator",
    name: "Attendance calculator",
    description:
      "Compute attendance percentage and how many classes you can miss or still need.",
    category: "student",
    keywords: [
      "attendance calculator",
      "how many classes can i miss",
      "attendance percentage",
      "bunk calculator",
    ],
    path: "/student/attendance-calculator",
    title: "Attendance Calculator Online — Miss or Need Classes",
    metaDescription:
      "Calculate attendance %, classes you can still miss, or classes needed to hit a target. Runs in the browser.",
    h1: "Attendance Calculator",
    intro:
      "Enter classes attended and total held so far, plus a target %. See current percentage, how many you can miss, or how many more you need.",
    related: ["cgpa-to-percentage", "percentage-calculator", "age-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Does this match my college portal?",
        answer:
          "Portals may exclude labs, count periods differently, or round oddly. Treat this as a planning estimate.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Formulas",
        paragraphs: [
          "Current % = attended ÷ total × 100. Missable classes assume future totals grow by skips only. Needed classes assume you attend every remaining class until the target is met.",
        ],
      },
    ],
  },
];

export const ageCalculatorTool: Tool = {
  slug: "age-calculator",
  name: "Age calculator",
  description: "Calculate exact age in years, months, and days from a date of birth.",
  category: "calculator",
  keywords: [
    "age calculator",
    "calculate age from date of birth",
    "age in years months days",
    "dob calculator",
  ],
  path: "/calculators/age-calculator",
  title: "Age Calculator Online — Years, Months, Days from DOB",
  metaDescription:
    "Calculate exact age from date of birth in years, months, and days. India-friendly date input. Runs in the browser.",
  h1: "Age Calculator",
  intro:
    "Pick a date of birth and an optional “as of” date. Get years, months, and days without uploading anything.",
  related: ["cgpa-to-percentage", "percentage-calculator", "emi-calculator"],
  localProcessing: true,
  faqs: [
    {
      question: "Leap days?",
      answer:
        "Age is computed with calendar months and days from the two dates. February 29 birthdays land on Feb 28 in non-leap years when the as-of date has no 29th.",
    },
  ],
  examples: [],
  sections: [
    {
      title: "Exact age",
      paragraphs: [
        "Useful for forms that ask for completed years plus residual months and days. Not a legal age verification service.",
      ],
    },
  ],
};
