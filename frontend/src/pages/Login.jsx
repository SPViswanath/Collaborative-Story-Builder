import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function Login() {
  const { Login, signup, loading, isAuthenticated} = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, []);



  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isSignup ? await signup(form) : await Login(form);
  };

  
  const handleGoogleLogin = async (response) => {
    try {
      await googleLogin(response.credential);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google login failed");
      console.error(err.message);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 w-96 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded cursor-pointer"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>

        </form>

        <div className="my-4 text-center text-gray-500">OR</div>
        <div id="googleBtn" className="flex justify-center"></div>


        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            className="ml-1 text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
