import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide";
  as?: "div" | "section" | "article";
};

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export function Container({
  children,
  className,
  size = "default",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6", sizes[size], className)}>
      {children}
    </Tag>
  );
}
