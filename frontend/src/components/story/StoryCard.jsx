import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default-story.webp";

function StoryCard({ story, source }) {
  const navigate = useNavigate();

  const imageUrl =
    source === "internal"
      ? story.coverImage || defaultImage
      : story.formats?.["image/jpeg"] || defaultImage;

  const title = story.title;
  const author =
    source === "internal"
      ? story.author?.name
      : story.authors?.[0]?.name || "Unknown";

  const handleClick = () => {
    navigate(`/reader/${source}/${source === "internal" ? story._id : story.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded overflow-hidden cursor-pointer hover:shadow transition"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover"
      />

      <div className="p-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>

        {source === "external" && (
          <span className="inline-block mt-2 text-xs bg-gray-200 px-2 py-1 rounded">
            Public Domain
          </span>
        )}
      </div>
    </div>
  );
}

export default StoryCard;
