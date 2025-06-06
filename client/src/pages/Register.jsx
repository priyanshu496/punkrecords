
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
const Register = () => {
  const navigate = useNavigate();
  const { searchParams } = new URL(document.location);
  const emailValue = searchParams.get("email");

  const [email, setEmail] = useState(emailValue || "");
  const [password, setPassword] = useState("");

  const { register, isRegistered } = useAuthStore(); //object destructuring
  const handleRegister = (e) => {
    e.preventDefault();
    register({ email, password });
    navigate("/login")
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 w-screen overflow-hidden">
      <div className="bg-cover bg-center bg-[url('/src/assets/movie_bg.jpg')] absolute inset-0 z-0 blur-[1.5px] brightness-35"></div>

      <div className="flex flex-col relative justify-center items-center z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Logo */}
         <img 
            onClick={() => navigate("/home")} 
            src="/src/assets/logoPunk.png" 
            alt="Logo" 
            className="h-16 sm:h-20 md:h-24 lg:h-37 w-auto cursor-pointer" 
            draggable={false}
          />
        
        {/* Registration Form Container */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg w-full text-white">
          {/* Title */}
          <h1 className="drop-shadow-2xl text-xl sm:text-2xl md:text-3xl text-transparent bg-clip-text mb-4 sm:mb-6 text-center font-bold bg-gradient-to-r from-pink-300 via-yellow-300 to-purple-400">
            Start Your Binge Journey
          </h1>
          
          {/* Login/Register Toggle Buttons */}
          <div className="flex gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 text-white bg-transparent py-2 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] sm:py-2.5 px-3 sm:px-4 rounded text-sm sm:text-base cursor-pointer border border-gray-300 hover:bg-white/10 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1  bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded text-sm sm:text-base cursor-pointer transition duration-300 ease-in-out"
            >
              Register
            </button>
          </div>
          
          {/* Registration Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 sm:p-3 pr-10 border border-gray-300 rounded text-white bg-black/20 backdrop-blur-sm placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="example@email.com"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 "><svg 
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
                  </svg></div>
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 sm:p-3 pr-10 border border-gray-300 rounded text-white bg-black/20 backdrop-blur-sm placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded"><svg 
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
                  </svg></div>
            </div>
            
            {/* Submit Button */}
            <button 
              onClick={handleRegister}
              className="w-full transition duration-300 ease-in-out  bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold text-white py-2.5 sm:py-3 rounded cursor-pointer text-sm sm:text-base "
            >
              {isRegistered ? "Please login" : "Submit"}
            </button>
            
            {/* Login Link */}
            <p className="text-yellow-400 font-normal text-xs sm:text-sm text-center">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#55ed20] hover:text-[#79f04f] hover:underline font-bold cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;