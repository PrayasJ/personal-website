import type { HighlightKind, HighlightLang, HighlightToken } from "@/lib/highlight";
import { tokenize } from "@/lib/highlight";

const KIND_CLASS: Record<HighlightKind, string> = {
  text: "syn-text",
  key: "syn-key",
  string: "syn-string",
  number: "syn-number",
  boolean: "syn-boolean",
  null: "syn-null",
  comment: "syn-comment",
  punct: "syn-punct",
  keyword: "syn-keyword",
  type: "syn-type",
  header: "syn-header",
  payload: "syn-payload",
  signature: "syn-signature",
  escape: "syn-escape",
  hit0: "syn-hit0",
  hit1: "syn-hit1",
  hit2: "syn-hit2",
};

export function CodeTokens({ tokens }: { tokens: HighlightToken[] }) {
  return (
    <>
      {tokens.map((token, index) => (
        <span key={`${index}-${token.kind}`} className={KIND_CLASS[token.kind]}>
          {token.value}
        </span>
      ))}
    </>
  );
}

export function CodeHighlight({
  code,
  lang,
  tokens,
}: {
  code?: string;
  lang?: HighlightLang;
  tokens?: HighlightToken[];
}) {
  const resolved = tokens ?? tokenize(code ?? "", lang ?? "plain");
  return <CodeTokens tokens={resolved} />;
}
