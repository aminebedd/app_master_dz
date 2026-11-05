import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium text-button whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Primary = the single green action on a screen.
  primary: "bg-primary text-on-primary hover:bg-primary/85",
  secondary: "bg-inverse text-on-inverse hover:bg-inverse/85",
  outline: "border border-line-strong text-fg hover:bg-raised",
  ghost: "text-fg hover:text-fg-2",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-4",
  sm: "px-4 py-2",
};

type Common = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string; external?: boolean };
type AsButton = Common & Omit<ComponentProps<"button">, "children" | "className"> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow = false, children, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${variant === "ghost" ? "px-1 py-2" : sizes[size]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        // Mirrored in RTL so the arrow always points "forward".
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        >
          →
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external } = props as AsLink;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, arrow: _a, children: _c, className: _cn, ...rest } = props as AsButton;
  return (
    <button {...rest} className={cls}>
      {content}
    </button>
  );
}
