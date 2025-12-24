import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Indigo accent button
        default: "bg-primary text-primary-foreground rounded-md hover:bg-primary-hover hover:shadow-precision-md active:scale-[0.98] active:bg-primary-active",
        // Destructive - Red error button
        destructive: "bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 active:scale-[0.98]",
        // Outline - Border with transparent bg
        outline: "border border-border bg-background text-foreground rounded-md hover:bg-secondary hover:border-border-hover",
        // Secondary - Slate background
        secondary: "bg-secondary text-secondary-foreground rounded-md border border-border hover:bg-secondary-hover hover:shadow-precision-sm",
        // Ghost - Invisible until hover
        ghost: "rounded-md hover:bg-secondary hover:text-foreground",
        // Link - Text style with underline
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        // Generate - Special CTA button for generate action
        generate: "bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary-hover hover:shadow-accent active:scale-[0.98] active:bg-primary-active",
        // Success - Green positive action
        success: "bg-success text-success-foreground rounded-md hover:bg-success/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
