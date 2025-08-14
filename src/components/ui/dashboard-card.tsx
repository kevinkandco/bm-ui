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
      "rounded-xl p-4 space-y-3 transition-all duration-300 hover:bg-white/[0.04]",
      "bg-[var(--brand-600)] border border-[var(--border-subtle)]",
      className
    )}
    {...props}
  >
    {(title || actions) && (
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-lg font-semibold tracking-tight" style={{color: 'var(--text-primary)'}}>
            {title}
          </h2>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="space-y-2">
      {children}
    </div>
  </div>
))

DashboardCard.displayName = "DashboardCard"

export { DashboardCard }