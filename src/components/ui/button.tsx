
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-glass-blue text-white hover:bg-lake-blue transition-colors duration-300 shadow-neon",
        primary: "bg-primary-teal text-white-text hover:bg-accent-green transition-all duration-200 active:scale-95 shadow-podia-button font-medium text-button rounded-podia-button",
        "podia-primary": "bg-primary-teal text-white-text hover:bg-accent-green transition-all duration-200 active:scale-95 shadow-podia-button font-medium text-button rounded-podia-button",
        "podia-chip": "bg-deep-blue text-white-text hover:bg-deep-blue/90 transition-all duration-200 font-normal text-chip rounded-podia-chip",
        "podia-chip-outline": "bg-transparent text-light-gray-text border border-light-gray-text/40 hover:border-light-gray-text/60 transition-all duration-200 font-normal text-chip rounded-podia-chip",
        destructive:
          "bg-hot-coral text-white hover:bg-hot-coral/90 shadow-sm",
        outline:
          "border bg-surface-overlay backdrop-blur-md hover:bg-white/15 text-text-primary hover:text-text-primary dark:border-white/40 light:border-black/20",
        secondary:
          "bg-white/25 backdrop-blur-md text-text-primary hover:bg-white/35 shadow-sm",
        ghost: "hover:bg-white/15 hover:text-text-primary text-text-secondary",
        link: "text-text-secondary underline-offset-4 hover:text-accent-primary",
        plain: "bg-transparent text-text-primary hover:text-accent-primary p-0 border-none",
        glow: "bg-black/80 text-white hover:bg-black/70 transition-all duration-300 shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] border border-white/10 dark:text-white light:text-text-primary",
        black: "bg-black text-white hover:bg-black/90 rounded-full border border-white/10 transition-all duration-300 shadow-none hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]",
        back: "bg-transparent text-white hover:text-primary-teal p-0 border-none transition-colors",
        voice: "w-12 h-12 rounded-full bg-primary-teal text-white-text hover:bg-accent-green active:scale-95 shadow-podia-button transition-all duration-200 p-0",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-full",
        none: "h-auto p-0",
        pill: "h-10 px-6 py-2 rounded-full",
        "podia-default": "px-4 py-2.5",
        "podia-chip": "px-3.5 py-1.5",
        "podia-voice": "w-12 h-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
