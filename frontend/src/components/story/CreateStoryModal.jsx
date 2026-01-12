import { useState, useEffect} from "react";
import { createStory } from "../../api/storyApi";
import { useAuth } from "../../context/AuthContext";

function CreateStoryModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, loading: authLoading } = useAuth(); // Changed from useAuth to useAuth()

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
      onCreated(title); // refresh / switch view
      onClose(); // close modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);


  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center"
       onClick={onClose} >

        {/* Modal */}
        <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 z-50" onClick={(e)=>e.stopPropagation()}>
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create a New Story
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError("");
                  }}

                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter story title"
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
                  className="w-full border rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of your story"
                />

              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white 
                    ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
                  `}
                >
                  {loading ? "Creating..." : "Save"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateStoryModal;
