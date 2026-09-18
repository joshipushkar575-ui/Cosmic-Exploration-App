import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  [
    "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl text-sm font-medium tracking-[0.01em]",
    "transition-all duration-300 ease-out",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
    "overflow-hidden",
    "[&_svg]:pointer-events-none",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:shrink-0",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
    "before:opacity-0 before:transition-opacity before:duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border border-cyan-300/20",
          "bg-gradient-to-br from-cyan-300/15 via-blue-400/10 to-violet-400/15",
          "text-white",
          "shadow-[0_8px_30px_rgba(56,189,248,0.10)]",
          "hover:border-cyan-200/40",
          "hover:from-cyan-300/25 hover:via-blue-400/15 hover:to-violet-400/25",
          "hover:shadow-[0_10px_35px_rgba(56,189,248,0.18)]",
          "before:bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.20),transparent_45%)]",
          "hover:before:opacity-100",
        ].join(" "),

        destructive: [
          "border border-red-300/20",
          "bg-red-500/10 text-red-100",
          "shadow-[0_8px_30px_rgba(239,68,68,0.08)]",
          "hover:border-red-300/40 hover:bg-red-500/20",
          "hover:shadow-[0_10px_35px_rgba(239,68,68,0.14)]",
        ].join(" "),

        outline: [
          "border border-white/15",
          "bg-white/[0.04] text-white",
          "backdrop-blur-xl",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          "hover:border-cyan-200/30",
          "hover:bg-white/[0.08]",
          "hover:shadow-[0_8px_30px_rgba(56,189,248,0.08)]",
        ].join(" "),

        secondary: [
          "border border-violet-300/15",
          "bg-violet-400/[0.10] text-white",
          "hover:border-violet-300/30",
          "hover:bg-violet-400/[0.17]",
          "hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]",
        ].join(" "),

        ghost: [
          "border border-transparent",
          "bg-transparent text-white/70",
          "hover:border-white/10",
          "hover:bg-white/[0.06]",
          "hover:text-white",
        ].join(" "),

        link: [
          "h-auto rounded-md border-0 bg-transparent p-0",
          "text-cyan-200 underline-offset-4",
          "hover:text-cyan-100 hover:underline",
          "before:hidden",
        ].join(" "),
      },

      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
