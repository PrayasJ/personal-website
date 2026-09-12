import { cn } from "@/lib/utils";

export function CheckChip({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      data-cursor="hot"
      aria-pressed={checked}
      className={cn("check-chip", checked && "is-on", className)}
      onClick={() => onChange(!checked)}
    >
      <span className="check-chip-mark" aria-hidden />
      {children}
    </button>
  );
}
