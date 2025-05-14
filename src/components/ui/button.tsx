
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-all ease-out duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white hover:-translate-y-1 hover:shadow-elevated",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-divider bg-transparent text-text-body hover:text-text-headline",
        secondary: "bg-surface text-text-body hover:text-text-headline",
        ghost: "hover:bg-surface hover:text-text-headline",
        link: "text-accent-blue underline-offset-4 hover:underline",
        plain: "bg-transparent p-0 border-none text-text-body hover:text-text-headline",
        glow: "bg-accent-blue text-white hover:-translate-y-1 hover:shadow-elevated",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-md",
        none: "h-auto p-0",
        pill: "h-11 rounded-full px-8",
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
