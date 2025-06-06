import { useState, useRef,  } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import logo from "../assets/logoPunk.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user,   logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [title, setTitle] = useState("");
  
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    navigate(`/search?q=${encodeURIComponent(title.trim())}`);
  };

  const handleLogout = async () => {
    try {
      console.log("Navbar: Attempting logout...");
      const error = await logout();
      
      if (error) {
        console.error("Navbar: Logout failed:", error);
        // Even if logout fails on server, we should still redirect
        // to prevent user from being stuck
        setIsProfileOpen(false);
        navigate("/login");
      } else {
        console.log("Navbar: Logout successful");
        setIsProfileOpen(false);
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
    } catch (error) {
      console.error("Navbar: Logout error:", error);
      // Force navigation even on error
      setIsProfileOpen(false);
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    console.log("Navbar: Profile clicked");
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Movies", path: "/movies" },
    { name: "TV Shows", path: "/tv-shows" },
    { name: "Watchlist", path: "/watchlist" },
  ];

  // Function to check if current path matches nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Debug logging
  console.log("Navbar: Current user:",user); 
  console.log("Navbar: Profile dropdown open:", isProfileOpen);

  return (
    <nav className="opacity-90 fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#0a0a0a] border-b border-white/5 shadow-[0_4px_12px_rgba(128,0,255,0.2)] backdrop-blur-lg">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-7">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex-shrink-0 mr-4 sm:mr-6 lg:mr-8">
            <img
              src={logo}
              alt="Logo"
              className="h-12 sm:h-16 md:h-18 lg:h-22 w-auto cursor-pointer"
              draggable={false}
              onClick={() => navigate("/home")}
            />
          </div>

          {/* Desktop Navigation*/}
          <div className="hidden xl:flex items-center space-x-8 flex-1 justify-start lg:ml-12">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`transition-colors duration-200 font-medium tracking-wide text-lg cursor-pointer ${
                      isActive(item.path)
                        ? "text-fuchsia-300"
                        : "text-white hover:text-fuchsia-300"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <form onSubmit={handleSearch}>
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Search movies..."
                  className="border border-white/30 bg-transparent w-full h-10 rounded-xl text-white placeholder-white/60 pl-10 pr-4 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400"
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
            {/* Desktop Profile Dropdown */}
            <div className="hidden md:flex ml-4 lg:ml-4 relative">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileDropdown}
                className="w-11 h-11 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] flex items-center justify-center cursor-pointer transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 lg:w-7 lg:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white/70">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email || user?.username || "User"}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile controls */}
            <div className="flex xl:hidden items-center space-x-3">
              {/* Mobile Profile Button */}
              <button
                ref={profileButtonRef}
                onClick={toggleProfileDropdown}
                className="md:hidden w-9 h-9 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_6px_rgba(255,221,51,0.5)] flex items-center justify-center cursor-pointer ml-2 relative"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Mobile Profile Dropdown */}
              {isProfileOpen && (
                <div
                  ref={profileDropdownRef}
                  className="md:hidden absolute right-2 top-16 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white/70">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email || user?.username || "User"}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Hamburger Menu */}
              <button
                onClick={toggleMenu}
                className="text-white hover:text-fuchsia-300 transition-colors duration-200 p-1"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="xl:hidden border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="md:hidden px-3 py-2">
                <div className="relative">
                  <form onSubmit={handleSearch}>
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      placeholder="Search movies..."
                      className="border border-white/30 bg-transparent w-full h-10 rounded-xl text-white placeholder-white/60 pl-10 pr-4 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400"
                    />
                  </form>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md transition-all duration-200 font-medium text-lg ${
                    isActive(item.path)
                      ? "text-fuchsia-300 bg-white/10"
                      : "text-white hover:text-fuchsia-300 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}