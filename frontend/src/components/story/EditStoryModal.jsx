import { useEffect, useMemo, useState } from "react";
import defaultImage from "../../assets/default-story.webp";

function EditStoryModal({ open, story, onClose, onConfirm }) {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(story?.title || "");
    setCoverImage(story?.coverImage || "");
  }, [open, story]);

  const previewImage = useMemo(() => {
    const img = coverImage?.trim();
    return img ? img : defaultImage;
  }, [coverImage]);

  const titleChanged = title.trim() !== (story?.title || "").trim();
  const coverChanged = coverImage.trim() !== (story?.coverImage || "").trim();

  const hasChanges = titleChanged || coverChanged;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit story details
            </h2>
            <p className="text-xs text-gray-500">
              Update story title and cover image link
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 text-xl font-semibold"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="cover-preview"
              onError={(e) => {
                e.currentTarget.src = defaultImage;
              }}
              className="w-full h-40 object-cover"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Story title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Cover image URL
            </label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Paste image URL (Cloudinary link later)"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              For now: paste URL. Next we’ll integrate Cloudinary upload.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            disabled={!hasChanges || saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onConfirm?.({
                  title: title.trim(),
                  coverImage: coverImage.trim(),
                });
              } finally {
                setSaving(false);
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              !hasChanges || saving
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {saving ? "Saving..." : "Confirm changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStoryModal;
