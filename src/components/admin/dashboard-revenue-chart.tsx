"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardRevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return <div className="h-72 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `$${(value / 100).toFixed(0)}`} /><Tooltip contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.625rem", color: "var(--popover-foreground)" }} labelStyle={{ color: "var(--muted-foreground)" }} formatter={(value) => [`$${(Number(value) / 100).toFixed(2)}`, "Revenue"]} /><Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "var(--chart-2)", stroke: "var(--background)", strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div>
}
