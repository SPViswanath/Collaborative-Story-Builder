import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Logo from "../assets/lat.png";

function Login() {
  const { Login, signup, loading, isAuthenticated, googleLoginSuccess } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      setGoogleLoading(true);
      await googleLogin(response.credential);
      await googleLoginSuccess();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    if (errorMsg) setErrorMsg("");
    setForm({
      ...form,
      [e.target.name]: e.target.name === "email" ? e.target.value.toLowerCase() : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isSignup) {
      if (form.password.length < 6) {
        return setErrorMsg("Password must be at least 6 characters long.");
      }
      if (form.password !== form.confirmPassword) {
        return setErrorMsg("Passwords do not match.");
      }
    }

    const action = isSignup ? signup : Login;
    const result = await action(form);

    if (result && !result.success) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gray-50 px-2 sm:px-4 py-6 sm:py-8 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-center h-full sm:h-auto my-auto">
        {/* ✅ Top Heading */}
        <div className="text-center mb-1 sm:mb-4">
          {/* ✅ Logo */}
          <div className="w-full flex justify-center -mb-2 sm:-mb-4">
            <img
              src={Logo}
              alt="StoryBuilder Logo"
              className="w-12 h-12 sm:w-24 sm:h-24 object-contain -mt-1 sm:-mt-5"
            />
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-0 text-[10px] sm:text-sm text-gray-500">
            {isSignup
              ? "Sign up to start writing."
              : "Login to continue."}
          </p>
        </div>

        {/* ✅ Card */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-7">
          {/* ✅ Error */}
          {errorMsg && (
            <div className="mb-2 sm:mb-3 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* ✅ Google button */}
          <div className="w-full flex justify-center">
            <div
              id="googleBtn"
              className="w-full flex justify-center overflow-hidden scale-90 sm:scale-100 origin-center"
            />
          </div>

          {/* ✅ Divider */}
          <div className="flex items-center gap-2 sm:gap-3 my-2 sm:my-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] sm:text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
            {/* Name */}
            {isSignup && (
              <div>
                <label className="text-[11px] sm:text-sm font-medium text-gray-700 hidden sm:block">
                  Name
                </label>
                <div className="mt-0 sm:mt-1 relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                  />
                  <input
                    name="name"
                    value={form.name}
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                    className="w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-base rounded-lg sm:rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[11px] sm:text-sm font-medium text-gray-700 hidden sm:block">Email</label>
              <div className="mt-0 sm:mt-1 relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="Enter your email"
                  autoComplete="email"
                  onChange={handleChange}
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-base rounded-lg sm:rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] sm:text-sm font-medium text-gray-700 hidden sm:block">
                Password
              </label>
              <div className="mt-0 sm:mt-1 relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-base rounded-lg sm:rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Confirm Password */}
            {isSignup && (
              <div>
                <label className="text-[11px] sm:text-sm font-medium text-gray-700 hidden sm:block">
                  Confirm Password
                </label>
                <div className="mt-0 sm:mt-1 relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    required
                    className="w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-base rounded-lg sm:rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-1.5 sm:py-2.5 mt-1 sm:mt-1 rounded-lg sm:rounded-xl bg-gray-900 text-white text-xs sm:text-base font-semibold hover:bg-black transition disabled:opacity-80 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {(loading || googleLoading) && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto" />}
              {!(loading || googleLoading) && (isSignup ? "Sign Up" : "Login")}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-2 sm:mt-5 text-center text-[11px] sm:text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="ml-1 sm:ml-2 font-semibold text-gray-900 hover:underline"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorMsg("");
                setForm({ ...form, password: "", confirmPassword: "" });
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>

        {/* Bottom note (hide on mobile to prevent scroll) */}
        <p className="hidden sm:block mt-3 sm:mt-5 text-center text-xs text-gray-400">
          Secure login powered by StoryBuilder.
        </p>
      </div>
    </div>
  );
}

export default Login;
