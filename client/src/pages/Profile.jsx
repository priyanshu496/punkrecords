import { useState } from "react";
import { useAuthStore } from "../store/authStore.jsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { User, Mail, Calendar} from "lucide-react";
import Footer from "../components/Footer.jsx";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });



  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user?.username || "User Profile"}
                  </h1>
                  <p className="text-purple-100 mt-1">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Account Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      disabled={true}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member Since
                  </label>
                  <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => navigate("/watchlist")}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    View Watchlist
                  </button>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}