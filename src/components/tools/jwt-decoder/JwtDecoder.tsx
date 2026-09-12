"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { ToolPane } from "@/components/tools/ToolPane";
import { decodeJwt } from "@/lib/jwt";

const EXAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmF5YXMiLCJpc3MiOiJwcmF5YXMuZGV2IiwiaWF0IjoxNzEwMDAwMDAwLCJleHAiOjE5MjQ5OTIwMDB9.signature-not-verified";

export function JwtDecoder() {
  const inputId = useId();
  const [token, setToken] = useState("");
  const result = decodeJwt(token);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Decode only. Signatures are not verified, and a decoded token is not proof
        that it is valid.
      </p>
      <ToolPane tone="in" label="JWT" htmlFor={inputId} className="mt-4">
        <CodeEditor
          id={inputId}
          value={token}
          onChange={setToken}
          lang="jwt"
          minHeightClass="min-h-28"
          placeholder="header.payload.signature"
        />
      </ToolPane>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setToken(EXAMPLE)}>
          Load example
        </Button>
        <Button variant="ghost" onClick={() => setToken("")}>
          Clear
        </Button>
      </div>

      {!token.trim() ? null : !result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {result.expired ? (
            <p className="rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger">
              The exp claim is in the past. That does not by itself make the token
              invalid — this page never checks the signature.
            </p>
          ) : null}
          {result.claims.length > 0 ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {result.claims.map((claim, index) => {
                const tones = ["syn-header", "syn-payload", "syn-number", "syn-keyword"] as const;
                return (
                  <div key={claim.name}>
                    <dt className={`tape ${tones[index % tones.length]}`}>{claim.name}</dt>
                    <dd className={`break-all font-mono text-sm ${tones[index % tones.length]}`}>
                      {claim.value}
                      {claim.note ? (
                        <span className="mt-1 block text-xs text-muted">{claim.note}</span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          ) : null}
          <div className="grid gap-4 lg:grid-cols-2">
            <ToolPane
              tone="in"
              label="Header"
              actions={<CopyButton value={result.header.json} />}
            >
              <pre className="tool-code">
                <CodeHighlight code={result.header.json} lang="json" />
              </pre>
            </ToolPane>
            <ToolPane
              tone="out"
              label="Payload"
              actions={<CopyButton value={result.payload.json} />}
            >
              <pre className="tool-code">
                <CodeHighlight code={result.payload.json} lang="json" />
              </pre>
            </ToolPane>
          </div>
          <div>
            <p className="tool-pane-label syn-signature">Signature</p>
            <p className="mt-2 break-all font-mono text-xs syn-signature">
              {result.signature || "No signature segment"}
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
