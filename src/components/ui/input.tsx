
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl bg-deep-blue border border-border-subtle px-4 py-3 text-body text-white-text ring-offset-background placeholder:text-light-gray-text placeholder:text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-teal focus-visible:border-primary-teal disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
