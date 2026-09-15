"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.625rem",
  color: "var(--popover-foreground)",
  boxShadow: "var(--shadow-card)",
}

const tooltipLabelStyle = {
  color: "var(--muted-foreground)",
}

const axisTick = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
}

export function AnalyticsCharts({
  revenue,
  orders,
}: {
  revenue: { date: string; revenue: number }[]
  orders: { date: string; orders: number }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenue} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={axisTick} />
            <YAxis tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(value) => `$${(value / 100).toFixed(0)}`} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
              formatter={(value) => [`$${(Number(value) / 100).toFixed(2)}`, "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "var(--chart-2)", stroke: "var(--background)", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={orders} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={axisTick} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.55 }}
            />
            <Bar dataKey="orders" name="Orders" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
