'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import {ConfirmModal} from '@/components/ConfirmModal';

interface Customer {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function UserPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Customer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch customers saat component mount
  useEffect(() => {
    fetchCustomers();
  }, [page]);

const fetchCustomers = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/user?page=' + page + '&limit=' + limit, );
    if (!response.ok) throw new Error('Gagal mengambil data customer');

    const data = await response.json();

    setCustomers(data.data); // langsung isi

    setTotalPages(data.totalPages);
    setPage(data.page);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Gagal mengambil data");
  } finally {
    setLoading(false);
  }
};


  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditForm({ ...customer });
    setShowForm(true);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm) return;

    try {
      setLoading(true);

      setCustomers(
        customers.map((customer) => (customer.id === id ? editForm : customer))
      );
      setEditingId(null);
      setEditForm(null);
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal menyimpan perubahan'
      );
      console.error('Error saving customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    setCustomerToDelete(customer || null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      setLoading(true);
      // DELETE logic
      setCustomers(
        customers.filter((customer) => customer.id !== customerToDelete.id)
      );
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus customer');
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
          <h1 className="text-4xl font-bold text-[#25AEAE] mb-2">Customer</h1>
          <p className="text-[#72A5A5]">Kelola data customer dan pengguna</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setEditForm({
              id: '',
              name: '',
              phone: '',
              status: 'active',
            });
            setShowForm(!showForm);
          }}
          className="px-6 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg font-medium transition"
        >
          + Tambah Customer
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
            {editingId ? 'Edit Customer' : 'Tambah Customer Baru'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Nama Customer
              </label>
              <input
                type="text"
                value={editForm?.name || ''}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, name: e.target.value } : null
                  )
                }
                placeholder="Nama lengkap customer"
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
                value={editForm?.phone || ''}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, phone: e.target.value } : null
                  )
                }
                placeholder="Nomor telepon"
                className="w-full px-4 py-2 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#25AEAE] mb-2">
                Status
              </label>
              <select
                value={editForm?.status || 'active'}
                onChange={(e) =>
                  setEditForm(
                    editForm
                      ? {
                          ...editForm,
                          status: e.target.value as 'active' | 'inactive',
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
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleSaveEdit(editForm?.id || '')}
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

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-[#72A5A5]" />
        <input
          type="text"
          placeholder="Cari customer berdasarkan nama, telepon, atau ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-[#72A5A5] rounded-lg focus:outline-none focus:border-[#25AEAE] bg-white text-gray-900"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
<thead className="bg-[#25AEAE] text-white">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-semibold">ID Customer</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Nama</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Nomor Telepon</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Aksi</th>
  </tr>
</thead>

<tbody>
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer) => (
      <tr key={customer.id} className="border-b hover:bg-gray-50 transition">
        <td className="px-6 py-4 font-semibold text-[#25AEAE]">
          {customer.id}
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900">
          {customer.name}
        </td>
        <td className="px-6 py-4 text-gray-700">
          {customer.phone}
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              customer.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
        </td>

        {/* Aksi */}
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <Link href={`/dashboard/user/${customer.id}`}>
              <button className="px-3 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg text-sm font-medium transition flex items-center gap-1">
                Detail
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>

            <button
              onClick={() => handleEdit(customer)}
              disabled={loading}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(customer.id)}
              disabled={loading}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition"
            >
              Hapus
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
        Tidak ada data customer yang sesuai
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t text-sm text-gray-600">
          Menampilkan {filteredCustomers.length} dari {customers.length} customer
        </div>
      </div>

      {/* PAGINATION */}
<div className="flex justify-center items-center gap-3 mt-6">
  <button
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
    className="px-4 py-2 bg-gray-300 disabled:bg-gray-200 rounded-lg"
  >
    Previous
  </button>

  {/* Page Numbers */}
  <span className="px-4 py-2 bg-white border rounded-lg">
    Halaman {page} dari {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
    disabled={page === totalPages}
    className="px-4 py-2 bg-gray-300 disabled:bg-gray-200 rounded-lg"
  >
    Next
  </button>
</div>



      {/* Empty State */}
      {customers.length === 0 && !loading && (
        <div className="text-center p-12">
          <p className="text-gray-500 text-lg mb-4">Belum ada data customer</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-[#25AEAE] hover:bg-[#1e8a8a] text-white rounded-lg font-medium transition"
          >
            Tambah Customer Pertama
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hapus Customer"
        message={
          <>
            Apakah Anda yakin ingin menghapus customer{' '}
            <span className="font-semibold text-[#25AEAE]">
              {customerToDelete?.name}
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
          setCustomerToDelete(null);
        }}
      />
    </div>
  );
}