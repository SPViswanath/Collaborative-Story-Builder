import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getChapterContent, saveChapterContent } from "../../api/chapterApi";
import { useAuth } from "../../context/AuthContext";
import SpeechToTextButton from "./SpeechToTextButton";
import { socket } from "../../socket";

function TextEditor({
  selectedChapter,
  storyId,
  setChapterDetails,
  sidebarLoaded,
  chapterDetails,
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const prevChapterIdRef = useRef(null);
  const lockRequestTimeoutRef = useRef(null); // ✅ For debouncing
  const heartbeatIntervalRef = useRef(null); // ✅ Track heartbeat interval

  const quillRef = useRef(null);

  // ✅ Debounced lock request to prevent rapid-fire requests
  const requestLock = (chapterId, immediate = false) => {
    if (!storyId || !chapterId || !socket.connected) return;

    if (lockRequestTimeoutRef.current) {
      clearTimeout(lockRequestTimeoutRef.current);
    }

    if (immediate) {
      socket.emit("chapter:lock", { storyId, chapterId });
    } else {
      lockRequestTimeoutRef.current = setTimeout(() => {
        socket.emit("chapter:lock", { storyId, chapterId });
      }, 100);
    }
  };

  const isLockedByOther =
    chapterDetails?.isLocked &&
    chapterDetails?.lockedBy &&
    chapterDetails.lockedBy._id?.toString() !== user?.userId?.toString();

  // ✅ Insert speech text into editor safely
  const insertTextIntoEditor = (text) => {
    if (isLockedByOther) return;

    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;

    const range = quill.getSelection(true);
    const insertIndex =
      range?.index !== undefined ? range.index : quill.getLength();

    quill.insertText(insertIndex, text + " ");
    quill.setSelection(insertIndex + text.length + 1);

    setContent(quill.root.innerHTML);
  };

  // ✅ Load chapter content (REST API)
  useEffect(() => {
    async function loadContent() {
      if (!selectedChapter?._id) return;

      setLoading(true);
      setMsg("");

      try {
        const res = await getChapterContent(selectedChapter._id);
        setContent(res.data.chapter?.content || "");
        setChapterDetails?.(res.data.chapter || null);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setMsg("Failed to load chapter content");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [selectedChapter?._id, setChapterDetails]);

  // ✅ Lock current chapter + unlock previous (switching chapters)
  useEffect(() => {
    const currentId = selectedChapter?._id;
    const prevId = prevChapterIdRef.current;

    if (!storyId) return;
    if (!socket.connected) {
      console.warn("❌ Socket not connected, can't lock chapter");
      return;
    }

    // ✅ Clear any pending lock requests
    if (lockRequestTimeoutRef.current) {
      clearTimeout(lockRequestTimeoutRef.current);
    }

    // ✅ Clear existing heartbeat
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (prevId && prevId !== currentId) {
      socket.emit("chapter:unlock", { storyId, chapterId: prevId });
    }

    if (currentId) {
      // ✅ Request lock immediately when switching
      requestLock(currentId, true);
    }

    prevChapterIdRef.current = currentId;
  }, [selectedChapter?._id, storyId]);

  // ✅ HEARTBEAT: renew lock lease while staying in same chapter
  useEffect(() => {
    if (!selectedChapter?._id) return;
    if (!storyId) return;
    if (!socket.connected) return;

    // ✅ Clear existing interval before creating new one
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // ✅ Send heartbeat every 4 seconds (TTL is 12s, so 3x safety margin)
    heartbeatIntervalRef.current = setInterval(() => {
      if (socket.connected) {
        requestLock(selectedChapter._id, true);
      } else {
        console.warn("❌ Socket disconnected, skipping heartbeat");
      }
    }, 10000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [selectedChapter?._id, storyId]);

  // ✅ Handle socket reconnection
  useEffect(() => {
    const handleReconnect = () => {
      console.log("✅ Socket reconnected, re-locking chapter");
      if (selectedChapter?._id && storyId) {
        requestLock(selectedChapter._id, true);
      }
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [selectedChapter?._id, storyId]);

  // ✅ Listen realtime lock updates
  useEffect(() => {
    const onLockUpdated = ({ chapterId, chapter }) => {
      if (selectedChapter?._id !== chapterId) return;

      setChapterDetails?.((prev) => {
        if (!prev) return chapter;

        return {
          ...prev,
          ...chapter,
          isLocked: chapter?.isLocked ?? prev?.isLocked,
          lockedBy:
            chapter?.lockedBy === null
              ? null
              : (chapter?.lockedBy ?? prev?.lockedBy),
        };
      });

      if (chapter?.isLocked === false) {
        setMsg("");
      }
    };

    const onLockDenied = ({ chapterId, lockedBy }) => {
      if (selectedChapter?._id !== chapterId) return;
      setMsg(`Locked by ${lockedBy?.name || "another user"}`);
    };

    socket.on("chapter:lockUpdated", onLockUpdated);
    socket.on("chapter:lockDenied", onLockDenied);

    return () => {
      socket.off("chapter:lockUpdated", onLockUpdated);
      socket.off("chapter:lockDenied", onLockDenied);
    };
  }, [selectedChapter?._id, setChapterDetails]);

  // ✅ Unlock when leaving tab
  useEffect(() => {
    const chapterId = selectedChapter?._id;
    if (!chapterId || !storyId) return;

    const handleUnload = () => {
      if (socket.connected) {
        socket.emit("chapter:unlock", { storyId, chapterId });
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);

      // ✅ Cleanup timeouts
      if (lockRequestTimeoutRef.current) {
        clearTimeout(lockRequestTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      handleUnload();
    };
  }, [selectedChapter?._id, storyId]);

  const handleSave = async () => {
    if (!selectedChapter?._id) return;

    if (isLockedByOther) {
      setMsg("This chapter is locked. You can only view it.");
      return;
    }

    setMsg("Saving...");

    try {
      await saveChapterContent(selectedChapter._id, content);

      const refreshed = await getChapterContent(selectedChapter._id);
      setChapterDetails?.(refreshed.data.chapter || null);

      setMsg("Saved successfully ✅");
      setTimeout(() => setMsg(""), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Save failed");
    }
  };

  if (!sidebarLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading editor...</p>
      </div>
    );
  }

  if (!selectedChapter?._id) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Create your first chapter ✍️
          </h2>
          <p className="text-gray-600 mt-2">
            Start writing your story by creating a chapter from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* ✅ Top bar */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-white">
        <p className="text-sm text-gray-700 font-medium truncate">
          {selectedChapter?.title || "No chapter selected"}
        </p>

        <div className="flex items-center gap-2">
          <SpeechToTextButton
            disabled={isLockedByOther}
            activeChapterId={selectedChapter?._id}
            onFinalText={(txt) => insertTextIntoEditor(txt)}
          />

          <button
            onClick={handleSave}
            disabled={isLockedByOther}
            className={`px-4 py-2 rounded-md transition text-sm border ${
              isLockedByOther
                ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200"
                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* ✅ Editor Area */}
      <div className="p-3">
        {loading ? (
          <div className="text-gray-500 text-sm px-1 py-2">
            Loading editor...
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
            {/* ✅ This wrapper gives professional fixed height */}
            <div className="h-[calc(100vh-16rem)]">
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={(val) => {
                  if (isLockedByOther) return;
                  setContent(val);
                }}
                readOnly={isLockedByOther}
                theme="snow"
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* ✅ Status message */}
      {msg && (
        <div className="px-4 py-2 border-t border-gray-200 text-sm text-gray-600 bg-white">
          {msg}
        </div>
      )}
    </div>
  );

}

export default TextEditor;
