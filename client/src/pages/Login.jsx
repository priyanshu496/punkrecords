import { useState } from "react";
import { useAuthStore } from "../store/authStore.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { searchParams } = new URL(document.location);
  const emailValue = searchParams.get("email");

  const [email, setEmail] = useState(emailValue || "");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    console.log("Login: Starting login process...");
    
    try {
      const error = await login({ email: email.trim(), password });
      
      if (error) {
        console.log("Login: Login failed with error:", error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      } else {
        console.log("Login: Login successful");
        // The App.jsx will handle the redirect automatically when user state changes
      }
    } catch (error) {
      console.log("Login: Login exception:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 w-screen overflow-hidden">
      <div className="bg-cover bg-center bg-[url('/src/assets/movie_bg.jpg')] absolute inset-0 z-0 blur-[1.5px] brightness-35"></div>

      <div className="flex flex-col relative justify-center items-center z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Login Form Container */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg w-full text-white">
          {/* Title */}
          <h1 className="drop-shadow-2xl text-xl sm:text-2xl md:text-3xl text-transparent bg-clip-text mb-4 sm:mb-6 text-center font-bold bg-gradient-to-r from-pink-300 via-yellow-300 to-purple-400">
            Continue Your Binge Journey
          </h1>
          
          {/* Login/Register Toggle Buttons */}
          <div className="flex gap-2 mb-4 sm:mb-6">
            <button
              className="flex-1 bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded text-sm sm:text-base cursor-pointer transition duration-300 ease-in-out"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 text-white bg-transparent py-2 sm:py-2.5 px-3 sm:px-4 rounded text-sm sm:text-base cursor-pointer border border-gray-300 hover:bg-white/10 transition duration-300 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)]"
            >
              Register
            </button>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
                className="w-full p-2.5 sm:p-3 pr-10 border border-gray-300 rounded text-white bg-black/20 backdrop-blur-sm placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                placeholder="example@email.com"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded">
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
                  />
                </svg>
              </div>
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="w-full p-2.5 sm:p-3 pr-10 border border-gray-300 rounded text-white bg-black/20 backdrop-blur-sm placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                placeholder="Password"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded">
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
                  />
                </svg>
              </div>
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-left">
              <p
                onClick={() => navigate("/")}
                className="text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm font-normal cursor-pointer hover:underline"
              >
                Forgot password?
              </p>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full transition duration-300 ease-in-out bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold text-white py-2.5 sm:py-3 rounded cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Submit"
              )}
            </button>
            
            {/* Register Link */}
            <p className="text-yellow-400 font-normal text-xs sm:text-sm text-center">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#55ed20] hover:text-[#79f04f] hover:underline font-bold cursor-pointer"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
