"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ChevronRight } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  idNumber: string;
  description: string;
  status: "active" | "inactive";
  phone?: string;
  email?: string;
  vehicle?: string;
  joinDate?: string;
}

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Driver | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  // Mock data - nanti akan diganti dengan data dari CouchDB
  useEffect(() => {
    fetchDrivers();
  }, []);

const fetchDrivers = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/driver");
    const data = await res.json();

    setDrivers(data);
  } catch (err) {
    setError("Gagal mengambil data driver");
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditForm({ ...driver });
    setShowForm(true);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm) return;

    try {
      setLoading(true);

      setDrivers(
        drivers.map((driver) => (driver.id === id ? editForm : driver))
      );
      setEditingId(null);
      setEditForm(null);
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan"
      );
      console.error("Error saving driver:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const driver = drivers.find((d) => d.id === id);
    setDriverToDelete(driver || null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;
    try {
      setLoading(true);
      // DELETE logic
      setDrivers(drivers.filter((driver) => driver.id !== driverToDelete.id));
      setShowDeleteModal(false);
      setDriverToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus driver");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setShowForm(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#25AEAE] mb-2">Driver</h1>
          <p className="text-[#72A5A5]">
            Kelola identitas dan data driver Anda
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg font-medium transition"
        >
          + Tambah Driver
        </button>
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-[#25AEAE]">
          <h2 className="text-2xl font-bold text-[#25AEAE] mb-6">
            {editingId ? "Edit Driver" : "Tambah Driver Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Nomor ID / KTP
              </label>
              <input
                type="text"
                value={editForm?.idNumber || ""}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, idNumber: e.target.value } : null
                  )
                }
                placeholder="Nomor identitas driver"
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
                disabled={editingId !== null}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Nama Driver
              </label>
              <input
                type="text"
                value={editForm?.name || ""}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, name: e.target.value } : null
                  )
                }
                placeholder="Nama lengkap driver"
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={editForm?.phone || ""}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, phone: e.target.value } : null
                  )
                }
                placeholder="Nomor telepon"
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              />
            </div>


            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Kendaraan (Motor 2 Roda)
              </label>
              <input
                type="text"
                value={editForm?.description || ""}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, description: e.target.value } : null
                  )
                }
                placeholder="Contoh: Honda CB150R"
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Status
              </label>
              <select
                value={editForm?.status || "active"}
                onChange={(e) =>
                  setEditForm(
                    editForm
                      ? {
                          ...editForm,
                          status: e.target.value as "active" | "inactive",
                        }
                      : null
                  )
                }
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Deskripsi
              </label>
              <textarea
                value={editForm?.description || ""}
                onChange={(e) =>
                  setEditForm(
                    editForm
                      ? { ...editForm, description: e.target.value }
                      : null
                  )
                }
                placeholder="Deskripsi atau catatan tentang driver"
                rows={4}
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleSaveEdit(editForm?.id || "")}
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              Simpan
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Drivers List */}
      <div className="space-y-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#25AEAE] hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              {/* Left Content */}
              <div className="flex-1">
                {/* Name and ID */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-[#25AEAE]">
                    {driver.name}
                  </h3>
                  <p className="text-sm text-[#72A5A5] mt-1">ID: {driver.id}</p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Phone */}
                  <div>
                    <p className="text-xs text-[#72A5A5] font-medium mb-1">
                      Telepon
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {driver.phone}
                    </p>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <p className="text-xs text-[#72A5A5] font-medium mb-1">
                      Kendaraan
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {driver.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-[#72A5A5] font-medium mb-1">
                      Status
                    </p>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex flex-col gap-3 ml-6">
                {/* Detail Button */}
                <Link href={`/dashboard/driver/${driver.id}`}>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg font-medium transition whitespace-nowrap">
                    Detail
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(driver)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(driver.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {drivers.length === 0 && !loading && (
        <div className="text-center p-12">
          <p className="text-gray-500 text-lg mb-4">Belum ada data driver</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg font-medium transition"
          >
            Tambah Driver Pertama
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hapus Driver"
        message={
          <>
            Apakah Anda yakin ingin menghapus driver{" "}
            <span className="font-semibold text-[#25AEAE]">
              {driverToDelete?.name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={loading}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDriverToDelete(null);
        }}
      />
    </div>
  );
}
