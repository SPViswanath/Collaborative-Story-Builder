import { Trash2 } from "lucide-react";
import { useRef, useEffect } from "react";

function DeleteChapterModal({ chapter, onClose, onConfirm }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92%] md:w-[240px]">
      <div 
        ref={modalRef}
        className="w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Delete {chapter.isBranch ? "Branch" : "Chapter"}
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          {chapter.isBranch
            ? "This branch will be permanently deleted."
            : "This chapter and all its branches will be permanently deleted."}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 size={14} className="inline mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteChapterModal;
