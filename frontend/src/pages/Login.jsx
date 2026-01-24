import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import Logo from "../components/BrandLogo"
function Login() {
  const { Login, signup, loading, isAuthenticated } = useAuth();
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

  // ✅ Google auth setup
  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "outline",
      size: "large",
      width: 300,
    });
  }, []);

  // ✅ redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleGoogleLogin = async (response) => {
    try {
      await googleLogin(response.credential);
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

    try {
      isSignup ? await signup(form) : await Login(form);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          (isSignup ? "Signup failed" : "Invalid email or password")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* ✅ Top Heading */}
        <div className="text-center mb-6">
 <div className="w-full flex justify-center mb-8">
  <div
    className="
      flex items-center gap-4
      px-6 py-3
      bg-white
      border border-gray-200/70
      rounded-2xl
      shadow-[0_8px_24px_rgba(15,23,42,0.06)]
    "
  >
    {/* Logo Box */}
    <div
      className="
        w-12 h-12
        flex items-center justify-center
        rounded-xl
        bg-gradient-to-br from-emerald-50 to-white
        border border-gray-200/60
        shadow-sm
        shrink-0
      "
    >
      <div className="w-8 h-8">
        {/* <Logo /> */}
      </div>
    </div>

    {/* Brand Text */}
    <div className="flex flex-col">
      <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-5 tracking-tight">
        Story<span className="text-emerald-600">Builder</span>
      </h1>

      <p className="text-[12px] sm:text-[13px] text-slate-500 leading-5">
        Collaborative Story Platform
      </p>
    </div>
  </div>
</div>




          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isSignup
              ? "Sign up to start writing and collaborating."
              : "Login to continue to StoryBuilder."}
          </p>
        </div>

        {/* ✅ Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7">
          {/* Error */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* ✅ Google button */}
          <div className="flex justify-center">
            <div id="googleBtn" className="w-full flex justify-center" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-5 text-center text-sm text-gray-600">
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

        {/* Bottom tiny note */}
        <p className="mt-5 text-center text-xs text-gray-400">
          Secure login powered by StoryBuilder.
        </p>
      </div>
    </div>
  );
}

export default Login;
