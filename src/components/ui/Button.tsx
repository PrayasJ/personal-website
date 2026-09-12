import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "buy" | "sell";
};

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    buy: "btn-buy",
    sell: "btn-sell",
    ghost: "btn-ghost",
  };

  return (
    <button
      type={type}
      className={cn("btn", styles[variant], className)}
      {...props}
    />
  );
}
