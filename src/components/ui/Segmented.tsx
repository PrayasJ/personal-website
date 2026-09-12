import { cn } from "@/lib/utils";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentOption<T>[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("segmented-wrap", className)}>
      {label ? <p className="field-label">{label}</p> : null}
      <div className="segmented" role="tablist" aria-label={label}>
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={on}
              data-cursor="hot"
              className={cn("segmented-tab", on && "is-on")}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
