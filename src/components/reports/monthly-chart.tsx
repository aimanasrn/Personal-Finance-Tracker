"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type MonthlyChartProps = {
  income: number;
  expenses: number;
  monthLabel: string;
};

const currencyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0
});

export function MonthlyChart({
  income,
  expenses,
  monthLabel
}: MonthlyChartProps) {
  const data = [
    { name: "Income", value: income, fill: "#1f9d7a" },
    { name: "Expenses", value: expenses, fill: "#f97316" }
  ];
  const formatValue = (
    value: number | string | readonly (number | string)[] | undefined
  ) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    return currencyFormatter.format(
      typeof normalizedValue === "number"
        ? normalizedValue
        : Number(normalizedValue ?? 0)
    );
  };

  return (
    <article className="glass-panel section-reveal section-reveal-delay-2 min-w-0 overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {monthLabel} cash flow
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Compare what came in against what went out for the selected month.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
            Income
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Expenses
          </span>
        </div>
      </div>

      <div className="mt-6 h-64 min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%" minWidth={260}>
          <BarChart data={data} barGap={24}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              axisLine={false}
              dataKey="name"
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickFormatter={(value: number) => currencyFormatter.format(value)}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={90}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              formatter={(value) => formatValue(value)}
              labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            />
            <Bar dataKey="value" radius={[18, 18, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
