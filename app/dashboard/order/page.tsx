"use client";
import { useState, useEffect } from "react";
import { Car, UtensilsCrossed, Package, HelpCircle, Search, Edit, Trash2 } from "lucide-react";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  type: "ride" | "food" | "send";
  driverId: string;
  driverNickname: string;
  description: string;
  status: "pending" | "completed" | "canceled";
  createdAt: string;
}

export default function OrderPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Order | null>(null);

  // Fetch orders dari CouchDB
  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const startKey = `["${selectedDate}", null]`;
      const endKey = `["${selectedDate}", {}]`;

      const response = await fetch(
        `/api/order?startKey=${startKey}&endKey=${endKey}`
      );
      if (!response.ok) throw new Error("Gagal fetch API");

      const data = await response.json();

      const transformedOrders = data.rows.map((row: any) => {
        const val = row.value;
        const d = val.orderData;

        return {
          id: row.id,
          customerId: row.key[1] || "",
          customerName: d?.nama || "",
          type: val.orderType || "ride",
          driverId: val.driverPhoneNumber || "",
          driverNickname: val.driverPhoneNumber || "",
          description: `${d?.lokasi_penjemputan || ""} → ${
            d?.lokasi_tujuan || ""
          } (${d?.waktu || ""})`,
          status: "completed",
          createdAt: row.key[0],
        };
      });

      setOrders(transformedOrders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ride":
        return <Car className="w-5 h-5 text-[#25AEAE]" />;
      case "food":
        return <UtensilsCrossed className="w-5 h-5 text-[#25AEAE]" />;
      case "send":
        return <Package className="w-5 h-5 text-[#25AEAE]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[#25AEAE]" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ride":
        return "Ride";
      case "food":
        return "Food";
      case "send":
        return "Send";
      default:
        return "Order";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Menunggu";
      case "canceled":
        return "Dibatalkan";
      default:
        return "Unknown";
    }
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setEditForm({ ...order });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm) return;

    try {
      setLoading(true);

      const username = "admin";
      const password = "your_couchdb_password"; // GANTI DENGAN PASSWORD REAL
      const credentials = btoa(`${username}:${password}`);

      // Update ke CouchDB
      const response = await fetch(`http://couchdb.dikal.my.id/seesjek/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan");
      }

      setOrders(orders.map((order) => (order.id === id ? editForm : order)));
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("Error saving order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus orderan ini?")) return;

    try {
      setLoading(true);

      const username = "admin";
      const password = "your_couchdb_password"; // GANTI DENGAN PASSWORD REAL
      const credentials = btoa(`${username}:${password}`);

      // Hapus dari CouchDB
      const response = await fetch(`http://couchdb.dikal.my.id/seesjek/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus orderan");
      }

      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("Error deleting order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#25AEAE] mb-2">Order</h1>
        <p className="text-[#72A5A5]">Kelola semua orderan Anda di sini</p>
      </div>

      {/* Date Picker */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#25AEAE] mb-2">
          Pilih Tanggal
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-8 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
          Memuat data...
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#25AEAE] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ID Orderan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tipe
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Driver
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {editingId === order.id ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.id || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? { ...editForm, id: e.target.value }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                          disabled
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm?.type || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? {
                                    ...editForm,
                                    type: e.target.value as
                                      | "ride"
                                      | "food"
                                      | "send",
                                  }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                        >
                          <option value="ride">Ride</option>
                          <option value="food">Food</option>
                          <option value="send">Send</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.customerName || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? { ...editForm, customerName: e.target.value }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.driverNickname || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? {
                                    ...editForm,
                                    driverNickname: e.target.value,
                                  }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.description || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? { ...editForm, description: e.target.value }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm?.status || ""}
                          onChange={(e) =>
                            setEditForm(
                              editForm
                                ? {
                                    ...editForm,
                                    status: e.target.value as
                                      | "pending"
                                      | "completed"
                                      | "canceled",
                                  }
                                : null
                            )
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#25AEAE]"
                        >
                          <option value="pending">Menunggu</option>
                          <option value="completed">Selesai</option>
                          <option value="canceled">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(order.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-sm transition"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={loading}
                          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded text-sm transition"
                        >
                          Batal
                        </button>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4 font-semibold text-[#25AEAE]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">
                            {getTypeIcon(order.type)}
                          </span>
                          <span>{getTypeLabel(order.type)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {order.customerName}
                          </p>
                          <p className="text-gray-500">{order.customerId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {order.driverNickname}
                          </p>
                          <p className="text-gray-500">{order.driverId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.description}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          disabled={loading}
                          className="px-3 py-1 bg-[#25AEAE] hover:bg-[#1e8a8a] disabled:bg-gray-400 text-white rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded text-sm transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              Tidak ada orderan pada tanggal ini
            </p>
          </div>
        )}
      </div>

      {/* Total Orders */}
      {orders.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-[#72A5A5]">
            Total orderan pada tanggal {selectedDate}:{" "}
            <span className="font-bold text-[#25AEAE]">
              {orders.length} orderan
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
