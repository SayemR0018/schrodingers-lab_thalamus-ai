import { ArrowRight } from "lucide-react";
import { cn } from "@/landing/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";

type CommonProps = {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type GlassButtonProps = ButtonAsButton | ButtonAsLink;

const variantClass: Record<Variant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  tertiary: "btn btn-tertiary",
};

export function GlassButton({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: GlassButtonProps) {
  const classes = cn(variantClass[variant], className);
  const content = (
    <>
      {children}
      {arrow ? <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" /> : null}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, "variant" | "arrow" | "className" | "children">;
  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
