import { useNavigate } from "react-router-dom";
import { useState } from "react";
import defaultImage from "../../assets/default-story.webp";

function StoryCard({
  story,
  source,
  mode = "main", // "main" | "dashboard"
  onPublishToggle,
  onAddCollaborator,
}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const imageUrl =
    source === "internal"
      ? story.coverImage || defaultImage
      : story.formats?.["image/jpeg"] || defaultImage;

  const title = story.title;
  const author =
    source === "internal"
      ? story.author?.name
      : story.authors?.[0]?.name || "Unknown";

  const handleCardClick = () => {
    if (mode === "dashboard") return; // dashboard controls navigation via buttons

    navigate(
      `/reader/${source}/${source === "internal" ? story._id : story.id}`
    );
  };

  const handlePrimaryAction = () => {
    if (mode === "dashboard") {
      navigate(
        story.isPublished
          ? `/reader/internal/${story._id}`
          : `/editor/${story._id}`
      );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Card Header */}
      <div className="bg-gray-100 p-4 min-h-32 flex items-center justify-center border-b border-gray-300">
        <h3 className="text-2xl font-bold text-gray-800">Story Card</h3>
      </div>

      {/* Card Body */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">
            Title:{" "}
            <span className="font-normal">{story?.title || "......"}</span>
          </p>
        </div>

        {/* Action Menu Button */}
        {mode === "dashboard" && (
          <div className="relative ml-4">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="More options"
            >
              ✉️
            </button>

            {/* Dropdown Menu */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    onAddCollaborator();
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 font-medium text-gray-800"
                >
                  Add a Collaborator
                </button>
                <button
                  onClick={() => setOpenMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 font-medium text-gray-800"
                >
                  Remove a Collaborator
                </button>
                <button
                  onClick={() => {
                    onPublishToggle();
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium text-gray-800"
                >
                  Publish / Unpublish
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close menu when clicking outside */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </div>
  );
}

export default StoryCard;
