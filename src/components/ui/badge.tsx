
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Light mode specific variants
        "success-light": "border border-light-accent-green/30 bg-light-accent-green/12 text-light-accent-green font-medium dark:border-accent-primary/30 dark:bg-accent-primary/12 dark:text-accent-primary",
        "error-light": "border border-light-accent-error bg-light-accent-error/10 text-light-accent-error font-medium dark:border-destructive dark:bg-destructive/10 dark:text-destructive",
        "time-saved": "bg-light-accent-green/12 text-light-accent-green border-0 font-medium dark:bg-accent-primary/12 dark:text-accent-primary",
        "channel-tag": "bg-light-accent-green/10 text-light-accent-green border-0 font-medium dark:bg-accent-primary/10 dark:text-accent-primary",
        "trigger-tag": "bg-orange-100 text-orange-600 border-0 font-medium dark:bg-orange-500/10 dark:text-orange-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
