import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Tool, ToolFaq } from "@/lib/tools";

export type HowToStep = {
  name: string;
  text: string;
};

export function toolPrimaryKeyword(tool: Tool): string {
  return tool.keywords[0] ?? tool.name.toLowerCase();
}

export function toolHowToSteps(tool: Tool): HowToStep[] {
  const keyword = toolPrimaryKeyword(tool);
  if (tool.category === "pdf") {
    return [
      {
        name: "Add PDFs",
        text: `Open ${tool.name} and drop PDF files into this page. They are read with the File API in this tab — not uploaded to ${SITE_NAME}.`,
      },
      {
        name: "Set options",
        text: `Choose order, page ranges, rotation, or quality for this ${keyword} tool.`,
      },
      {
        name: "Preview",
        text: "Check the source document and the result on the page before you keep a file.",
      },
      {
        name: "Download",
        text: "Confirm the download when you are ready. The originals stay on your device.",
      },
    ];
  }
  if (tool.category === "image") {
    return [
      {
        name: "Choose an image",
        text: `Open ${tool.name} and pick a PNG, JPEG, or WebP. The bitmap stays in this browser.`,
      },
      {
        name: "Adjust",
        text: `Set size, crop, format, or quality for this ${keyword} step.`,
      },
      {
        name: "Preview",
        text: "Compare the original and the result before you save anything.",
      },
      {
        name: "Download",
        text: "Confirm when you want the file. Nothing is stored on a server.",
      },
    ];
  }
  if (tool.category === "calculator") {
    return [
      {
        name: "Enter figures",
        text: `Fill in the ${tool.name} fields (INR, percents, and tenure as labelled).`,
      },
      {
        name: "Read the result",
        text: "The formula runs in JavaScript on this page. It is not a quote from a bank or payroll vendor.",
      },
      {
        name: "Check the assumptions",
        text: "Read the notes under the calculator. Rounding, fees, and tax rules vary.",
      },
    ];
  }
  return [
    {
      name: "Paste input",
      text: `Paste text into ${tool.name}. ${
        tool.localProcessing
          ? "It is processed in this browser and is not sent to a backend."
          : ""
      }`.trim(),
    },
      {
        name: "Run the tool",
        text: `Use ${tool.name} to format, convert, generate, or inspect the input. The primary action is on this page.`,
      },
    {
      name: "Copy the output",
      text: "Copy the result from the page. Refreshing clears it; nothing is saved on a server.",
    },
  ];
}

export function toolFeatures(tool: Tool): string[] {
  return [
    `Free ${tool.name}`,
    "No account or signup",
    tool.localProcessing ? "Runs entirely in your browser" : "Browser-based",
    tool.localProcessing ? "No upload to a server" : null,
    "No watermark",
    tool.category === "calculator" ? "India-focused, figures in INR" : null,
    tool.category === "pdf" || tool.category === "image"
      ? "Preview, then confirm download"
      : null,
  ].filter((item): item is string => Boolean(item));
}

export function extraToolFaqs(tool: Tool): ToolFaq[] {
  const existing = tool.faqs.map((faq) => faq.question.toLowerCase());
  const extras: ToolFaq[] = [];
  const has = (needle: string) => existing.some((question) => question.includes(needle));

  if (!has("free")) {
    extras.push({
      question: `Is ${tool.name} free?`,
      answer: `Yes. ${tool.name} on ${SITE_NAME} is free. There is no account, no login wall, and no watermark on the result.`,
    });
  }
  if (
    tool.localProcessing &&
    !has("upload") &&
    !has("leave") &&
    !has("sent") &&
    !has("anywhere")
  ) {
    extras.push({
      question: `Does ${tool.name} upload my data?`,
      answer: `No. ${tool.name} runs in JavaScript in your browser. Files and text are not posted to ${SITE_URL} as part of using the tool.`,
    });
  }
  if (!has("offline") && !has("internet") && !has("network")) {
    extras.push({
      question: `Can I use ${tool.name} offline?`,
      answer:
        "After this page has loaded, the tool does not need another server round-trip. A first visit or a cache-busting reload still needs the site to be reachable.",
    });
  }
  return extras;
}

export function allToolFaqs(tool: Tool): ToolFaq[] {
  return [...tool.faqs, ...extraToolFaqs(tool)];
}

export function toolSoftwareCategory(tool: Tool): string {
  switch (tool.category) {
    case "calculator":
    case "student":
      return "FinanceApplication";
    case "pdf":
    case "image":
    case "photo":
    case "qr":
      return "UtilitiesApplication";
    default:
      return "DeveloperApplication";
  }
}

export function toolInLanguage(tool: Tool): string {
  return tool.category === "calculator" ||
    tool.category === "student" ||
    tool.category === "photo" ||
    tool.category === "qr"
    ? "en-IN"
    : "en";
}

export function toolMetaKeywords(tool: Tool): string[] {
  return [
    ...tool.keywords,
    tool.name,
    `free ${toolPrimaryKeyword(tool)}`,
    `${toolPrimaryKeyword(tool)} online`,
    "browser only",
    "no upload",
  ];
}
