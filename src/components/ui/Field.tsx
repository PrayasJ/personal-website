import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  prefix,
  suffix,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("field", className)}>
      {htmlFor ? (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <p className="field-label">{label}</p>
      )}
      <div
        className={cn(
          "field-control",
          prefix && "has-prefix",
          suffix && "has-suffix",
        )}
      >
        {prefix ? <span className="field-affix is-prefix">{prefix}</span> : null}
        {children}
        {suffix ? <span className="field-affix is-suffix">{suffix}</span> : null}
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "accent" | "danger";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "stat-tile",
        tone !== "default" && `is-${tone}`,
        className,
      )}
    >
      <p className="tape">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
