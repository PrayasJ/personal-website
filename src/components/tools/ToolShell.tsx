import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ToolShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("tool-shell", className)}>
      <header className="tool-shell-bar">
        <span className="tool-shell-mark" aria-hidden />
        <p className="tape">desk · local</p>
        <p className="tool-shell-status">
          <span className="tool-shell-pip" aria-hidden />
          Browser only
        </p>
      </header>
      <div className="tool-shell-body">{children}</div>
    </section>
  );
}
