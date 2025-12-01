"use client";

import ChartOrders from "@/components/ChartOrders";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const [chartData, setChartData] = useState<{
    orders: any[];
    start_key: string;
    end_key: string;
  }>({
    orders: [],
    start_key: "",
    end_key: ""
  });
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard?date=${selectedDate}&type=${viewMode}`
      );

      const json = await res.json();
      console.log("Dashboard Data:", json.orders);
      setChartData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate, viewMode]);

  const totalOrders = chartData.orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-[#25AEAE]">Dashboard</h1>

      {/* Tanggal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#25AEAE] mb-1">
          Pilih Tanggal
        </label>
        <input
          type="date"
          className="px-4 py-2 border border-[#72A5A5] rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* View Mode */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "daily", label: "Harian" },
          { key: "weekly", label: "Mingguan" },
          { key: "monthly", label: "Bulanan" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setViewMode(m.key as any)}
            className={`px-4 py-2 rounded-lg border ${
              viewMode === m.key
                ? "bg-[#25AEAE] text-white border-[#25AEAE]"
                : "bg-white text-[#25AEAE] border-[#25AEAE]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mb-6 p-4 bg-white shadow rounded border-l-4 border-[#25AEAE]">
        <p className="text-[#72A5A5] text-sm">Total Order</p>
        <h2 className="text-3xl font-bold text-[#25AEAE]">{totalOrders}</h2>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-bold text-[#25AEAE] mb-4">
          Grafik Order ({viewMode})
        </h3>

        {loading ? (
          <p className="text-center text-[#72A5A5]">Memuat data...</p>
        ) : (
          <ChartOrders 
            startDate={chartData.start_key || ""}
            endDate={chartData.end_key || ""}
            orders={chartData.orders || []}
            totalOrders={totalOrders}
          />
        )}
      </div>
    </div>
  );
}
