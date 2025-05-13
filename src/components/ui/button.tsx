
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-surface-raised text-text-primary shadow-neu-raised hover:shadow-neu-hover hover:-translate-y-1 active:shadow-neu-pressed active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-neu-raised",
        outline:
          "border border-input bg-surface text-text-primary hover:bg-surface/80 hover:text-text-primary",
        secondary:
          "bg-surface text-text-secondary hover:bg-surface/80 hover:text-text-primary",
        ghost: "hover:bg-surface hover:text-text-primary text-text-secondary",
        link: "text-accent-primary underline-offset-4 hover:underline",
        plain: "bg-transparent text-text-secondary hover:text-text-primary p-0 border-none",
        primary: "bg-accent-primary text-white shadow-neu-raised hover:shadow-neu-hover hover:-translate-y-1 active:shadow-neu-pressed active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10 rounded-full",
        none: "h-auto p-0",
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
