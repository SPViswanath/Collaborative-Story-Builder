import { useState } from "react";
import { lockChapter, unlockChapter } from "../../api/chapterApi";
import { useAuth } from "../../context/AuthContext";

function MetaPanel({ chapterDetails,onRefresh }){
  const [lockLoading, setLockLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  const createdBy = chapterDetails?.createdBy?.name || "-";
  const lastEditedBy = chapterDetails?.lastEditedBy?.name || "-";

  const isLocked = chapterDetails?.isLocked || false;
  const lockedBy = chapterDetails?.lockedBy?.name || "-";

  const handleLockToggle = async () => {
    if (!chapterDetails?._id) return;

    setLockLoading(true);
    setMsg("");

    try {
      if (isLocked) {
        await unlockChapter(chapterDetails._id);
        setMsg("Chapter unlocked ✅");
      } else {
        await lockChapter(chapterDetails._id);
        setMsg("Chapter locked ✅");
      }
      await onRefresh?.();
      setTimeout(() => setMsg(""), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Lock/Unlock failed");
    } finally {
      setLockLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="bg-[#a3b8aa] px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Chapter Details</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Created By: <span className="font-medium">{createdBy}</span>
            </p>

            <p className="text-sm text-gray-700">
              Last Edited By: <span className="font-medium">{lastEditedBy}</span>
            </p>

            <p className="text-sm text-gray-700">
              Status:{" "}
              <span className="font-medium">
                {isLocked ? "Locked" : "Unlocked"}
              </span>
            </p>

            {isLocked && (
              <p className="text-sm text-gray-700">
                Locked By: <span className="font-medium">{lockedBy}</span>
              </p>
            )}
            
          </div>
        </div>
    </div>
  );
}

export default MetaPanel;
