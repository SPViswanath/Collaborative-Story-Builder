import { useEffect, useMemo, useState } from "react";
import defaultImage from "../../assets/default-story.webp";

function EditStoryModal({ open, story, onClose, onConfirm }) {
  const [title, setTitle] = useState("");
  //coverimg states
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(story?.title || "");
    setCoverPreview(story?.coverImage?.url || defaultImage);
    setCoverFile(null);
  }, [open, story]);

  const titleChanged = title.trim() !== (story?.title || "").trim();
  const coverChanged = !!coverFile;

  const hasChanges = titleChanged || coverChanged;

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  //clean-up effect
  useEffect(() => {
    return () => {
      if (typeof coverPreview === "string" && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);


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
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img
              src={coverPreview || defaultImage}
              alt="cover-preview"
              onError={(e) => {
                e.currentTarget.src = defaultImage;
              }}
              className="absolute inset-0 w-full h-full object-cover"
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

          <div>
            <label className="text-sm font-medium text-gray-800">
              Cover image
            </label>

            {/* Drop zone */}
            <label
              htmlFor="cover-upload"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (!file) return;

                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }}
              className="mt-2 flex flex-col items-center justify-center
                        border-2 border-dashed border-gray-300
                        rounded-lg h-32 cursor-pointer
                        hover:border-gray-400 transition text-sm text-gray-600"
            >
              {coverPreview ? (
                <span>Change image</span>
              ) : (
                <>
                  <span className="font-medium">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-1">
                    or drag & drop
                  </span>
                </>
              )}
            </label>

            {/* Hidden file input */}
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />

            <p className="text-xs text-gray-500 mt-1">
              JPG / PNG / WEBP • Max 5MB
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
                const formData = new FormData();
                formData.append("title", title.trim());

                if (coverFile) {
                  formData.append("image", coverFile);
                }

                await onConfirm(formData);
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
