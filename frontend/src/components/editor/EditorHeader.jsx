import { useEffect, useRef, useState } from "react";
import CreateChapterModal from "./CreateChapterModal";
import { createChapter } from "../../api/chapterApi";
import {useAuth} from "../../context/AuthContext"
function EditorHeader({
  storyId,
  selectedChapter,
  onOpenSidebar,
  metaContent,
  storyTitle,
  chapterDetails,
  onBranchCreated,
}){
  const [metaOpen, setMetaOpen] = useState(false);
  const metaBtnRef = useRef(null);
  const metaBoxRef = useRef(null);
  const [openCreateBranch, setOpenCreateBranch] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    function handleOutside(e) {
      if (!metaOpen) return;
  
      const insideBox = metaBoxRef.current?.contains(e.target);
      const insideBtn = metaBtnRef.current?.contains(e.target);
  
      if (!insideBox && !insideBtn) setMetaOpen(false);
    }
  
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [metaOpen]);

  return (
    <div className="px-4 py-1 flex items-center justify-between">
      {/* Left: Sidebar button + Title */}
      <div className="flex items-center gap-3">
        {/* ✅ Mobile sidebar open button */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Open Chapter List"
        >
          ☰
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">
            {storyTitle || "Story"}
          </h2>

          {chapterDetails?.isLocked &&
            chapterDetails?.lockedBy &&
            chapterDetails.lockedBy._id?.toString() !== user?.userId?.toString() && (
              <p className="text-xs font-medium text-red-600">
                Chapter is locked by{" "}
                <span className="font-semibold">
                  {chapterDetails.lockedBy.name || "another user"}
                </span>
              </p>
          )}


        </div>
  

      </div>

      {/* Right: Meta menu + Save */}
      <div className="flex items-center gap-3">
          {/* ✅ Create Branch Button */}
          <button
            onClick={() => {
              if (!selectedChapter?._id) return;
              if (selectedChapter?.isBranch) return; // only branches under chapters
              setOpenCreateBranch(true);
            }}
            disabled={!selectedChapter?._id || selectedChapter?.isBranch}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
              !selectedChapter?._id || selectedChapter?.isBranch
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
            title={
              selectedChapter?.isBranch
                ? "Branches can be created only for chapters"
                : "Create Branch"
            }
          >
            Create Branch
          </button>

          {/* ✅ Mobile meta button */}
          <div className="relative lg:hidden">
            <button
              ref={metaBtnRef}
              onClick={() => setMetaOpen((p) => !p)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Chapter info"
            >
              ⋮
            </button>

            {metaOpen && (
              <div
                ref={metaBoxRef}
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
              >
                <div className="p-3">{metaContent}</div>
              </div>
            )}
          </div>
        </div>
        {openCreateBranch && (
          <CreateChapterModal
            titleText={`Create Branch for "${selectedChapter?.title || "Chapter"}"`}
            placeholder="Enter branch title"
            onClose={() => setOpenCreateBranch(false)}
            onCreate={async (title) => {
              await createChapter(storyId, title, selectedChapter._id);
              setOpenCreateBranch(false);
              onBranchCreated?.();
            }}
          />
        )}

    </div>

  );
}

export default EditorHeader;
