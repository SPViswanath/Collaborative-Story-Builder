import { useState, useEffect } from "react";
import { createStory } from "../../api/storyApi";
import { useAuth } from "../../context/AuthContext";

function CreateStoryModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ mobile info popup
  const [infoOpen, setInfoOpen] = useState(false);

  const { isAuthenticated, loading: authLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (authLoading) {
      setError("Session is initializing. Please wait a second.");
      return;
    }

    if (!isAuthenticated) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      await createStory({ title, description });
      onCreated(title);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setInfoOpen(false);
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Left: Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create a New Story
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Start with a title and a short description.
              </p>
            </div>

            {/* ✅ Mobile Info button */}
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              title="Info"
            >
              i
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Story Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError("");
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                placeholder="Eg: The Lost Kingdom"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError("");
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                placeholder="A short summary about your story..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

             <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2.5 rounded-xl border font-medium transition ${
                  loading
                    ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                    : "border-gray-300 text-gray-800 hover:bg-gray-50"
                }`}
              >
                {loading ? "Creating..." : "Create Story"}
              </button>

            </div>
          </form>
        </div>

        {/* ✅ Right: Info panel only on DESKTOP */}
        <div className="hidden lg:block bg-gradient-to-br from-white to-indigo-50 border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900">
            What happens next?
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="font-medium text-gray-900">1) Add chapters</p>
              <p className="mt-1">
                Create chapters and start writing your story content.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="font-medium text-gray-900">2) Branch story paths</p>
              <p className="mt-1">
                Add branches to build interactive storytelling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="font-medium text-gray-900">3) Publish when ready</p>
              <p className="mt-1">
                Keep it private until you’re ready to publish.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Info Popup */}
      {infoOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
            onClick={() => setInfoOpen(false)}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[92%] max-w-sm lg:hidden">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <p className="font-semibold text-gray-900">What happens next?</p>
                <button
                  type="button"
                  onClick={() => setInfoOpen(false)}
                  className="px-2 py-1 rounded-lg hover:bg-gray-100 transition text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-3 text-sm text-gray-700">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-900">1) Add chapters</p>
                  <p className="mt-1 text-gray-600">
                    Create chapters and start writing your story content.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-900">
                    2) Branch story paths
                  </p>
                  <p className="mt-1 text-gray-600">
                    Add branches to build interactive storytelling.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-900">
                    3) Publish when ready
                  </p>
                  <p className="mt-1 text-gray-600">
                    Keep it private until you’re ready to publish.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateStoryModal;
