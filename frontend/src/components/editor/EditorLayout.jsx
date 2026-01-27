import { useState, useEffect } from "react";
import ChapterSidebar from "./ChapterSidebar";
import EditorHeader from "./EditorHeader";
import MetaPanel from "./MetaPanel";
import TextEditor from "./TextEditor";
import { getStoryById } from "../../api/storyApi";
import Navbar from "../common/Navbar";
import { getChapterContent } from "../../api/chapterApi";
import { socket } from "../../socket";
import { useAuth } from "../../context/AuthContext";


function EditorLayout({ storyId }) {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [storyTitle, setStoryTitle] = useState("Story");
  const { user } = useAuth();
  const [canEdit, setCanEdit] = useState(true);
  // sidebar control
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const [sidebarReloadKey, setSidebarReloadKey] = useState(0);
  const storageKey = `sb_lastChapter_${user?.userId || "guest"}_${storyId}`;
  
  useEffect(() => {
    if (selectedChapter?._id) {
      localStorage.setItem(storageKey, selectedChapter._id);
    }
  }, [selectedChapter?._id, storageKey]);


  // socket connection

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const joinRoom = () => {
      socket.emit("story:join", { storyId });
    };

    socket.on("connect", joinRoom);

    // If already connected, join immediately
    if (socket.connected) joinRoom();

    return () => {
      socket.off("connect", joinRoom);
      socket.disconnect();
    };
  }, [storyId]);



  useEffect(() => {
    async function loadStoryTitle() {
      try {
        const res = await getStoryById(storyId);

        setStoryTitle(res.data.story?.title || "Story");

        // ✅ basic edit permission (author/collaborator)
        const story = res.data.story;
        const myId = user?.userId?.toString();

        const authorId =
          story?.author?._id?.toString?.() || story?.author?.toString?.();

        const collaborators = story?.collaborators || [];

        const isAuthor = myId && authorId && myId === authorId;
        const isCollaborator =
          myId && collaborators.some((id) => id.toString() === myId);

        setCanEdit(isAuthor || isCollaborator);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setStoryTitle("Story");
        setCanEdit(false);
      }
    }

    loadStoryTitle();
  }, [storyId]);

  const refreshChapterDetails = async () => {
      if (!selectedChapter?._id) return;

      try {
        const res = await getChapterContent(selectedChapter._id);
        setChapterDetails(res.data.chapter || null);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {/* ✅ Navbar fixed top */}
      <Navbar page="Editor" />

      {/* ✅ whole editor area below navbar */}
      <div className=" fixed w-full h-full">
        <div className="h-[calc(100vh-4rem)] w-full flex overflow-hidden">
          {/* ✅ Mobile overlay when sidebar open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ✅ LEFT Sidebar */}
          <aside
            className={`
              fixed md:static top-16 md:top-auto left-0 z-50
              h-[calc(100vh-4rem)]
              bg-white border-r border-gray-200
              transition-all duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
              ${collapsed ? "w-20" : "w-72"}
              overflow-visible
            `}
          >
            <div className="h-full flex flex-col">
              <ChapterSidebar
                storyId={storyId}
                storyTitle={storyTitle}
                selectedChapter={selectedChapter}
                setSelectedChapter={setSelectedChapter}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                reloadKey={sidebarReloadKey}
                onRequestReload={() => setSidebarReloadKey((p) => p + 1)}
                onChaptersLoaded={(chapters) => {
                  setSidebarLoaded(true);

                  if (chapters.length === 0) return;

                  // ✅ Restore last opened chapter on refresh
                  const savedId = localStorage.getItem(storageKey);

                  if (!selectedChapter) {
                    const found = chapters.find((c) => c._id === savedId);
                    setSelectedChapter(found || chapters[0]);
                  }
                }}
                canEdit={canEdit}

              />
            </div>
          </aside>

          {/* ✅ MAIN */}
          <section className="flex-1 h-full overflow-hidden flex flex-col bg-gray-50">
            {/* Header */}
            <div className="shrink-0 border-b border-gray-200 bg-white">
              <EditorHeader
                storyId={storyId}
                storyTitle={storyTitle}
                selectedChapter={selectedChapter}
                onOpenSidebar={() => setSidebarOpen(true)}
                metaContent={<MetaPanel chapterDetails={chapterDetails} onRefresh={refreshChapterDetails} />}
                chapterDetails={chapterDetails}
                onBranchCreated={() => setSidebarReloadKey((p) => p + 1)}
              />
            </div>

            {/* ✅ only editor content scrolls */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <TextEditor
                  storyId={storyId}
                  sidebarLoaded={sidebarLoaded}
                  selectedChapter={selectedChapter}
                  setChapterDetails={setChapterDetails}
                  chapterDetails={chapterDetails}
                />
              </div>
            </div>
          </section>

          {/* ✅ RIGHT Meta Panel (Desktop only fixed) */}
          <aside className="hidden lg:block w-72 bg-white border-l border-gray-200 h-full overflow-hidden">
            <div className="p-4">
              <MetaPanel chapterDetails={chapterDetails} onRefresh={refreshChapterDetails}/>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EditorLayout;
