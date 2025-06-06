import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaPlay,
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaFilm
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoPunk.png";

export default function Footer() {
    const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription here
    console.log("Newsletter signup:", email);
    setEmail("");
    // You can add your newsletter API call here
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] text-white">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-fuchsia-400 via-purple-500 to-fuchsia-400"></div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-20 h-10 rounded-lg flex items-center justify-center">
                <img
                              src={logo}
                              alt="Logo"
                              className="h-12 sm:h-16 md:h-18 lg:h-22 w-auto cursor-pointer"
                              draggable={false}
                              onClick={() => navigate("/home")}
                            />
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your ultimate destination for movies and entertainment. Discover, watch, and enjoy thousands of movies and TV shows from around the world.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaFilm className="text-fuchsia-400" />
              Quick Links
            </h4>
            <nav className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Movies", path: "/movies" },
                { label: "TV Shows", path: "/tv-shows" },
                { label: "Watchlist", path: "/watchlist" }
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="block text-gray-300 hover:text-fuchsia-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support & Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaUser className="text-fuchsia-400" />
              Support
            </h4>
            <nav className="space-y-3">
              {[
                { label: "Help Center", path: "/help" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" }
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="block text-gray-300 hover:text-fuchsia-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaHeart className="text-fuchsia-400" />
              Stay Updated
            </h4>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Subscribe to get updates on new movies and features.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder-gray-400 transition-all duration-300"
                  />
                  <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:shadow-[0_0_20px_rgba(196,131,255,0.4)] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FaPhone className="text-fuchsia-400" />
                <span>+12345678987</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FaEnvelope className="text-fuchsia-400" />
                <span>hello@Punkrecords.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FaMapMarkerAlt className="text-fuchsia-400" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; 2025 Punkrecords. All rights reserved.</p>
              <p className="mt-1">Made with <FaHeart className="inline text-red-500 mx-1" /> for movie lovers</p>
            </div>
            
            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:shadow-[0_0_20px_rgba(196,131,255,0.6)] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </footer>
  );
}
