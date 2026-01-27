import { useEffect, useMemo, useState } from "react";
import { updateProfileApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

function ProfileModal({ open, onClose, user }) {
  const { updateUserInContext } = useAuth();

  const initialName = useMemo(() => user?.name || "", [user?.name]);

  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ✅ when modal opens, load fresh values
  useEffect(() => {
    if (!open) return;
    setName(user?.name || "");
    setPassword("");
    setMsg("");
  }, [open, user?.name]);

  if (!open) return null;

  const nameChanged = name.trim() !== (user?.name || "").trim();
  const passwordChanged = password.trim().length > 0;

  const canConfirm = nameChanged || passwordChanged;

  const handleConfirm = async () => {
    if (!canConfirm) return;

    setLoading(true);
    setMsg("");

    try {
      const payload = {};

      if (nameChanged) payload.name = name.trim();
      if (passwordChanged) payload.password = password.trim();

      const res = await updateProfileApi(payload);

      // ✅ update navbar name immediately
      updateUserInContext(res.data.user);

      setMsg("Profile updated ✅");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Email (readonly) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={user?.email || ""}
              readOnly
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              placeholder="Enter your name"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Edit Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty if you don’t want to change.
            </p>
          </div>

          {/* Message */}
          {msg && (
            <div className="text-sm text-center text-gray-600">{msg}</div>
          )}

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className={`w-full py-2.5 rounded-xl font-semibold transition ${
              !canConfirm || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {loading ? "Updating..." : "Confirm Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
