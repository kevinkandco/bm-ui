
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-ripple",
  {
    variants: {
      variant: {
        default: "bg-warm-coral text-off-white hover:bg-cranberry transition-colors dark:bg-hot-coral dark:text-canvas-black dark:hover:bg-hot-coral/90",
        destructive:
          "bg-cranberry text-off-white hover:bg-cranberry/90 dark:bg-hot-coral dark:text-canvas-black dark:hover:bg-hot-coral/90",
        outline:
          "border border-deep-plum/30 bg-white/60 hover:bg-white/70 backdrop-blur-[30px] text-deep-plum hover:text-deep-plum dark:border-light-rose/30 dark:bg-slate-grey/30 dark:hover:bg-slate-grey/40 dark:text-light-rose dark:hover:text-light-rose",
        secondary:
          "bg-white/60 backdrop-blur-[30px] text-deep-plum hover:bg-white/70 dark:bg-slate-grey/30 dark:text-light-rose dark:hover:bg-slate-grey/40",
        ghost: "hover:bg-white/30 hover:text-deep-plum text-deep-plum/70 dark:hover:bg-slate-grey/30 dark:hover:text-light-rose dark:text-light-rose/70",
        link: "text-deep-plum underline-offset-4 hover:text-warm-coral dark:text-light-rose dark:hover:text-hot-coral",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-full",
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
