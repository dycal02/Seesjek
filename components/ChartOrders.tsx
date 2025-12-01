"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface OrderChartProps {
  startDate: string; // format: "2025-12-01"
  endDate: string; // format: "2025-12-07"
  orders: any[];
  totalOrders?: number;
}

export default function ChartOrders({ orders, totalOrders }: OrderChartProps) {
    const chartData = Object.values(
  orders.reduce((acc: any, order: any) => {
    const date = order.date;

    if (!acc[date]) {
      acc[date] = { date, total: 0 };
    }

    acc[date].total += 1;

    return acc;
  }, {})
);

  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-xl shadow">

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" tick={{ fontSize: 12 }} />

          <YAxis dataKey="total" allowDecimals={false} />

          <Tooltip />

          <Bar
            type="monotone"
            dataKey="total"
            stroke="#4A9FFF"
            strokeWidth={3}
            fill="#4A9FFF"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
