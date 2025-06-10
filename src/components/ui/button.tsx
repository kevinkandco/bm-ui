
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-button-primary",
        primary: "glass-button-primary font-medium text-button rounded-glass-button",
        "podia-primary": "glass-button-primary font-medium text-button rounded-glass-button",
        "podia-chip": "glass-chip font-normal text-chip",
        "podia-chip-outline": "glass-ultra-thin text-glass-secondary border border-rim-light hover:border-rim-light-hover transition-all duration-200 font-normal text-chip rounded-glass-pill",
        destructive: "bg-hot-coral text-white hover:bg-hot-coral/90 shadow-sm",
        outline: "glass-thin hover:glass-regular text-glass-primary border-rim-light hover:border-rim-light-hover",
        secondary: "glass-thin text-glass-primary hover:glass-regular shadow-sm",
        ghost: "hover:glass-ultra-thin hover:text-glass-primary text-glass-secondary",
        link: "text-glass-secondary underline-offset-4 hover:text-accent-primary",
        plain: "bg-transparent text-glass-primary hover:text-accent-primary p-0 border-none",
        glow: "glass-thin text-glass-primary hover:glass-regular transition-all duration-300 border border-rim-light hover:border-rim-light-hover",
        black: "glass-regular text-glass-primary hover:glass-thick rounded-full border border-rim-light transition-all duration-300",
        back: "bg-transparent text-glass-primary hover:text-primary-teal p-0 border-none transition-colors",
        voice: "glass-button-primary w-12 h-12 rounded-full glass-press p-0",
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
