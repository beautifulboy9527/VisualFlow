import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Gradient accent button with glow
        default: "bg-gradient-to-r from-[hsl(185,75%,50%)] to-[hsl(160,70%,45%)] text-white rounded-xl hover:shadow-[0_8px_30px_hsl(175,70%,45%/0.4)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_4px_15px_hsl(175,70%,45%/0.3)]",
        // Destructive - Red error button
        destructive: "bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 hover:shadow-lg active:scale-[0.98]",
        // Outline - Border with transparent bg and gradient hover
        outline: "border border-border bg-background text-foreground rounded-xl hover:bg-secondary hover:border-primary/40 hover:shadow-sm",
        // Secondary - Slate background with subtle glow
        secondary: "bg-secondary text-secondary-foreground rounded-xl border border-border hover:bg-secondary-hover hover:shadow-sm hover:border-primary/30",
        // Ghost - Invisible until hover
        ghost: "rounded-xl hover:bg-secondary hover:text-foreground",
        // Link - Text style with underline
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        // Generate - Special CTA button with enhanced glow effect
        generate: "bg-gradient-to-r from-[hsl(185,75%,50%)] to-[hsl(160,70%,45%)] text-white rounded-xl font-semibold shadow-[0_4px_20px_hsl(175,70%,45%/0.35)] hover:shadow-[0_8px_35px_hsl(175,70%,45%/0.5)] hover:scale-[1.02] active:scale-[0.98]",
        // Success - Green positive action
        success: "bg-success text-success-foreground rounded-xl hover:bg-success/90 hover:shadow-lg active:scale-[0.98]",
        // Dark - Dark button with white text (for hero section)
        dark: "bg-foreground text-background rounded-full hover:bg-foreground/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        // Gradient Outline - Border with gradient glow effect
        "gradient-outline": "border-2 border-primary/50 bg-transparent text-foreground rounded-full hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_hsl(175,70%,45%/0.2)]",
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
