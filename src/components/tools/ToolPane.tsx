import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ToolPane({
  tone,
  label,
  htmlFor,
  actions,
  children,
  className,
}: {
  tone: "in" | "out";
  label: string;
  htmlFor?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("tool-pane", tone === "in" ? "is-in" : "is-out", className)}>
      <div className="tool-pane-head">
        <span className="tool-pane-pip" aria-hidden />
        {htmlFor ? (
          <label htmlFor={htmlFor} className="tool-pane-label">
            {label}
          </label>
        ) : (
          <p className="tool-pane-label">{label}</p>
        )}
        {actions ? <div className="tool-pane-actions">{actions}</div> : null}
      </div>
      <div className="tool-pane-main">{children}</div>
    </div>
  );
}
