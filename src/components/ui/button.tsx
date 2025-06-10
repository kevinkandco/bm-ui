
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "chrome-pill",
        primary: "chrome-pill",
        "podia-primary": "chrome-pill",
        "podia-chip": "monitoring-chip",
        "podia-chip-outline": "monitoring-chip border border-rim-light bg-transparent",
        destructive: "error-glass-chip",
        outline: "glass-thin border border-rim-light text-glass-primary hover:bg-glass-thin/80",
        secondary: "glass-thin text-glass-primary hover:bg-glass-thin/80",
        ghost: "hover:bg-glass-ultra-thin text-glass-secondary hover:text-glass-primary",
        link: "text-glass-secondary underline-offset-4 hover:text-accent-primary",
        plain: "bg-transparent text-glass-primary hover:text-accent-primary p-0 border-none",
        glow: "glass-thick text-glass-primary hover:shadow-caustic",
        black: "glass-thick text-glass-primary rounded-full border border-rim-light transition-all duration-300 shadow-glass",
        back: "bg-transparent text-glass-primary hover:text-primary-teal p-0 border-none transition-colors",
        voice: "glass-thin w-12 h-12 rounded-full text-glass-primary hover:shadow-status-green active:scale-95 shadow-glass transition-all duration-300 p-0",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10 rounded-lg",
        none: "h-auto p-0",
        pill: "h-10 px-6 py-2 rounded-full",
        "podia-default": "px-4 py-2.5",
        "podia-chip": "px-3.5 py-1.5",
        "podia-voice": "w-12 h-12 p-0",
        chrome: "h-chrome-pill px-6 rounded-chrome", // 44pt chrome size
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
