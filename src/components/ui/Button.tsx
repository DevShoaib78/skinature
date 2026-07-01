import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-forest-900 text-cream border border-forest-900 hover:bg-forest-800 hover:shadow-[0_0_20px_rgba(26,60,52,0.2)]",
      secondary: "bg-gold-500 text-cream border border-gold-500 hover:bg-gold-600 hover:shadow-[0_0_20px_rgba(197,160,89,0.2)]",
      outline: "bg-transparent text-forest-900 border border-forest-900 hover:bg-forest-50",
      ghost: "bg-transparent text-forest-900 hover:bg-forest-50 hover:text-forest-700",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "px-8 py-3 rounded-full transition-all duration-500 ease-out font-sans tracking-widest text-xs uppercase",
          "hover:scale-[1.02] active:scale-[0.98]",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
