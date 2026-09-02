'use client';

import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="bg-red-500/10 text-red-400 rounded-full p-2 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-400 text-white font-medium rounded-lg transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
