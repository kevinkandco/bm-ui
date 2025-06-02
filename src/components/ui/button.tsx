
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-hover ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-accent-blue focus-visible:ring-opacity-40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ds-accent-blue text-white hover:bg-ds-accent-blue-hover",
        primary: "bg-ds-accent-blue text-white hover:bg-ds-accent-blue-hover rounded-md",
        secondary: "border border-ds-accent-blue bg-transparent text-ds-accent-blue hover:bg-ds-accent-blue hover:bg-opacity-10",
        tertiary: "bg-transparent text-ds-text-secondary hover:text-ds-text-primary border-none",
        destructive: "bg-ds-accent-red text-white hover:opacity-90",
        outline: "border border-ds-divider bg-ds-surface hover:bg-ds-surface-raised text-ds-text-primary",
        ghost: "hover:bg-ds-surface-raised text-ds-text-secondary hover:text-ds-text-primary",
        link: "text-ds-accent-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-16 py-8 text-label",
        sm: "h-9 rounded-md px-12 text-label",
        lg: "h-11 rounded-md px-24 text-base",
        icon: "h-10 w-10",
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
