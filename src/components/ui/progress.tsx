
import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: "default" | "glow"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    const percentage = (value / max) * 100
    
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full bg-surface",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all",
            variant === "default" ? "bg-accent-blue" : "bg-accent-blue shadow-[0_0_5px_rgba(46,167,255,0.5)]"
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
