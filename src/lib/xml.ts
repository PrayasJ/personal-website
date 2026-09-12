/** Format XML with DOMParser. Browser only. */

export type XmlIssue = {
  message: string;
};

function parserError(doc: Document): string | null {
  const err = doc.querySelector("parsererror");
  if (!err) {
    return null;
  }
  return err.textContent?.trim() || "XML parse error.";
}

function serializeNode(node: Node, indent: number, pretty: boolean): string {
  const pad = pretty ? "  ".repeat(indent) : "";
  const nl = pretty ? "\n" : "";

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (!pretty) {
      return text;
    }
    const trimmed = text.trim();
    return trimmed ? `${pad}${trimmed}${nl}` : "";
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!--${node.textContent ?? ""}-->${nl}`;
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `${pad}<![CDATA[${node.textContent ?? ""}]]>${nl}`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as Element;
  const name = el.tagName;
  const attrs = Array.from(el.attributes)
    .map((attr) => ` ${attr.name}="${attr.value.replace(/"/g, "&quot;")}"`)
    .join("");

  const children = Array.from(el.childNodes);
  if (children.length === 0) {
    return `${pad}<${name}${attrs}/>${nl}`;
  }

  const onlyText =
    children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
  if (onlyText) {
    const text = (children[0].textContent ?? "").trim();
    return `${pad}<${name}${attrs}>${text}</${name}>${nl}`;
  }

  let body = "";
  for (const child of children) {
    body += serializeNode(child, indent + 1, pretty);
  }
  return `${pad}<${name}${attrs}>${nl}${body}${pad}</${name}>${nl}`;
}

export function formatXml(
  input: string,
  pretty: boolean,
): { ok: true; value: string } | { ok: false; error: XmlIssue } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: { message: "Paste some XML first." } };
  }
  const doc = new DOMParser().parseFromString(trimmed, "application/xml");
  const err = parserError(doc);
  if (err) {
    return { ok: false, error: { message: err } };
  }
  const root = doc.documentElement;
  if (!root) {
    return { ok: false, error: { message: "No root element." } };
  }
  const declaration = trimmed.startsWith("<?xml")
    ? `${trimmed.match(/^<\?xml[^?]*\?>/)?.[0] ?? ""}${pretty ? "\n" : ""}`
    : "";
  return { ok: true, value: `${declaration}${serializeNode(root, 0, pretty).trimEnd()}\n` };
}
