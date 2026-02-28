import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Logo from "../assets/lat.png";

function Login() {
  const { Login, signup, loading, isAuthenticated, googleLoginSuccess } =
    useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Google Button Responsive Width
  const [googleBtnWidth, setGoogleBtnWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setGoogleBtnWidth(Math.min(360, window.innerWidth - 40));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // ✅ Google auth setup (re-render on width change)
  useEffect(() => {
    /* global google */
    if (!window.google || !googleBtnWidth) return;

    const el = document.getElementById("googleBtn");
    if (!el) return;

    el.innerHTML = "";

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(el, {
      theme: "outline",
      size: "large",
      width: googleBtnWidth,
    });

    console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }, [googleBtnWidth]);

  // ✅ redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleGoogleLogin = async (response) => {
    try {
      await googleLogin(response.credential);
      await googleLoginSuccess();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Google login failed. Try again.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const action = isSignup ? signup : Login;
    const result = await action(form);

    if (result && !result.success) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-start justify-center bg-gray-50 px-2 pt-2 -mx">
      <div className="w-full max-w-md">
        {/* ✅ Top Heading */}
        <div className="text-center mb-2 sm:mb-5">
          {/* ✅ Logo */}
          <div className="w-full flex justify-center">
            <img
              src={Logo}
              alt="StoryBuilder Logo"
              className="w-24 h-24 sm:w-40 sm:h-40 object-contain -mt-2 sm:-mt-5"
            />
          </div>

          <h1 className="-mt-1 sm:mt-0 text-2xl font-bold text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isSignup
              ? "Sign up to start writing and collaborating."
              : "Login to continue to StoryBuilder."}
          </p>
        </div>

        {/* ✅ Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-7">
          {/* ✅ Error */}
          {errorMsg && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* ✅ Google button */}
          <div className="w-full flex justify-center">
            <div
              id="googleBtn"
              className="w-full flex justify-center overflow-hidden"
            />
          </div>

          {/* ✅ Divider */}
          <div className="flex items-center gap-3 my-3 sm:my-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name */}
            {isSignup && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autocomplete="email"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-80 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
              {!loading && (isSignup ? "Sign Up" : "Login")}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-4 sm:mt-5 text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="ml-2 font-semibold text-gray-900 hover:underline"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorMsg("");
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>

        {/* Bottom note (hide on mobile to prevent scroll) */}
        <p className="hidden sm:block mt-5 text-center text-xs text-gray-400">
          Secure login powered by StoryBuilder.
        </p>
      </div>
    </div>
  );
}

export default Login;
