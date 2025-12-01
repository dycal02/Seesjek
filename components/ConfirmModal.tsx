'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmColor = isDangerous 
    ? 'bg-red-500 hover:bg-red-600' 
    : 'bg-[#25AEAE] hover:bg-[#1e8a8a]';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-in fade-in zoom-in">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
          isDangerous ? 'bg-red-100' : 'bg-blue-100'
        } mb-4 mx-auto`}>
          {isDangerous ? (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 110-14 7 7 0 010 14z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 ${confirmColor} disabled:bg-gray-400 text-white rounded-lg font-medium transition`}
          >
            {isLoading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}