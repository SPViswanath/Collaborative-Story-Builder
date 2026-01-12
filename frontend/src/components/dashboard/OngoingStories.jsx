import { useEffect, useState } from "react";
import { getOngoingStories } from "../../api/storyApi";
import StoryCard from "../story/StoryCard";
import { useAuth } from "../../context/AuthContext";

function OngoingStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth(); // Changed from useAuth to useAuth()

  useEffect(() => {
    async function fetchStories() {
      if (authLoading) return;

      // Prevent 401: Don't fetch if not authenticated
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const res = await getOngoingStories();
        setStories(res.data.stories);
      } catch (error) {
        console.error(
          "Error fetching stories:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [authLoading, isAuthenticated]); // Added isAuthenticated dependency

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        My Ongoing Stories
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No ongoing stories yet. Start creating!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              source="internal"
              mode="dashboard"
              onPublishToggle={() => publishToggle(story._id)}
              onAddCollaborator={() => openCollaboratorModal(story._id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default OngoingStories;
