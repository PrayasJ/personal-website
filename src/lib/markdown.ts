import Showdown from "showdown";

const converter = new Showdown.Converter({
  tables: true,
  strikethrough: true,
  ghCodeBlocks: true,
  tasklists: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
});

/** Convert markdown to HTML in the browser. Output is not a full XSS sanitizer. */
export function markdownToHtml(source: string): string {
  return converter.makeHtml(source);
}
