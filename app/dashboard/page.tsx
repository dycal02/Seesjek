"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard`);
      const json = await res.json();

      if (json.orders) {
        setChartData(json.orders);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = chartData.reduce((sum, d) => sum + (d.total || 0), 0);
  const maxOrders =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.total)) : 1;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#25AEAE] mb-2">Dashboard</h1>
        <p className="text-[#72A5A5]">
          Selamat datang kembali! Berikut adalah ringkasan hari ini.
        </p>
      </div>

      {/* Date Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#25AEAE] mb-2">
          Pilih Tanggal
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border-2 border-[#72A5A5] rounded-lg bg-white"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/order">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#25AEAE] hover:shadow-lg">
            <p className="text-[#72A5A5] text-sm mb-2">Total Order</p>
            <h2 className="text-4xl font-bold text-[#25AEAE]">
              {String(totalOrders)}
            </h2>
          </div>
        </Link>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#25AEAE]">
            Grafik Orderan - {selectedDate}
          </h3>
        </div>

        {loading ? (
          <p className="text-center text-[#72A5A5]">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-min">
              {/* Y-axis */}
              <div className="flex flex-col justify-between items-end w-12 text-xs text-[#72A5A5] pr-2">
                <span>{maxOrders}</span>
                <span>{Math.floor(maxOrders * 0.75)}</span>
                <span>{Math.floor(maxOrders * 0.5)}</span>
                <span>{Math.floor(maxOrders * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Bars */}
              <div className="flex-1 min-w-96">
                <div className="flex items-end justify-between h-80 border-b-2 border-l-2 border-[#72A5A5] pb-4">
                  {chartData.map((d) => (
                    <div key={d.id} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-gradient-to-t from-[#25AEAE] to-[#3dd4d4] rounded-t-lg w-3/4"
                        style={{
                          height: `${(d.total / maxOrders) * 300}px`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* X-axis */}
                <div className="flex justify-between mt-2">
                  {chartData.map((d) => (
                    <div
                      key={d.id}
                      className="text-center text-xs text-[#72A5A5] w-8"
                    >
                      {d.date ? d.date.slice(5) : "-"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}