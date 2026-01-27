import { X, Trash2 } from "lucide-react";

function DeleteChapterModal({
  chapter,
  isLockedByOther,
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            Delete {chapter.isBranch ? "Branch" : "Chapter"}
          </h3>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-3 text-sm text-gray-700">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">“{chapter.title}”</span>?
          </p>

          {!chapter.isBranch && (
            <p className="text-xs text-gray-500">
              This chapter’s branches will also be deleted.
            </p>
          )}

          {isLockedByOther && (
            <p className="text-xs text-red-600">
              Locked by {chapter.lockedBy?.name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLockedByOther}
            className={`px-4 py-1.5 text-sm rounded-md flex items-center gap-2
              ${
                isLockedByOther
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            `}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteChapterModal;
