import { useState, useRef, useEffect } from "react";

function CreateChapterModal({
  titleText = "Create Chapter",
  placeholder = "Enter chapter title",
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    try {
      await onCreate(trimmed);
      setTitle("");
    } catch (err) {
      // Extract error message from API response
      const errorMessage = err.response?.data?.message || err.message || "Failed to create";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    // Use mousedown to catch it earlier than click
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="absolute top-1/2 left-1/2 mr-30 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[100%] md:w-[250px]">
      <div 
        ref={modalRef}
        className="w-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {titleText}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 text-xl font-semibold"
            title="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="p-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default CreateChapterModal;
