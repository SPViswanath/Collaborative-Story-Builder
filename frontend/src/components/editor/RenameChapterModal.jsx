import { useState } from "react";
import { X } from "lucide-react";
import { renameChapter } from "../../api/chapterApi";

function RenameChapterModal({ chapter, onClose, onSuccess }) {
  const [title, setTitle] = useState(chapter.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title cannot be empty");
      return;
    }

    if (trimmed === chapter.title) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError("");

      await renameChapter(chapter._id, trimmed);

      onSuccess();
    } catch (err) {
      if (err.response?.status === 423) {
        setError("Chapter is locked by another user");
      } else {
        setError(err.response?.data?.message || "Failed to rename chapter");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            Rename {chapter.isBranch ? "Branch" : "Chapter"}
          </h3>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            autoFocus
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Enter new title"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-1.5 text-sm rounded-md text-white
                ${loading ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"}
              `}
            >
              {loading ? "Renaming..." : "Rename"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameChapterModal;
