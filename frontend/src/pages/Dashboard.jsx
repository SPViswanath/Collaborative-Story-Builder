import { useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import OngoingStories from "../components/dashboard/OngoingStories";
import PublishedStories from "../components/dashboard/PublishedStories";
import CreateStoryModal from "../components/story/CreateStoryModal";
import Navbar from "../components/common/Navbar";

function Dashboard() {
  const [active, setActive] = useState("ongoing");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== BODY ===== */}
      <div className="flex">
        {/* Mobile overlay for sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ===== SIDEBAR ===== */}
        <DashboardSidebar
          active={active}
          setActive={setActive}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-6 md:p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-800">
              {successMessage}
            </div>
          )}

          {/* Ongoing Stories */}
          {active === "ongoing" && <OngoingStories />}

          {/* Published Stories */}
          {active === "published" && <PublishedStories />}

          {/* Create Story Page */}
          {active === "create" && (
            <div className="flex justify-center pt-10">
              <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Create a New Story
                </h1>

                <CreateStoryModal
                  onCreated={(storyTitle) => {
                    setActive("ongoing");

                    const trimmed =
                      storyTitle.length > 40
                        ? storyTitle.slice(0, 40) + "…"
                        : storyTitle;

                    setSuccessMessage(
                      `Story "${trimmed}" created successfully.`
                    );

                    setTimeout(() => {
                      setSuccessMessage("");
                    }, 3000);
                  }}
                  onClose={() => setActive("ongoing")}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
