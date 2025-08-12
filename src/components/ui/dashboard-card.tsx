import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const DashboardCard = React.forwardRef<
  HTMLDivElement,
  DashboardCardProps
>(({ title, actions, children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl p-4 md:p-5 space-y-4 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    {(title || actions) && (
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-lg font-semibold text-text-primary tracking-tight">
            {title}
          </h2>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
))

DashboardCard.displayName = "DashboardCard"

export { DashboardCard }