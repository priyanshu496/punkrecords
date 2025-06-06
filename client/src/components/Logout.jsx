import { useAuthStore } from "../store/authStore.jsx";
import { useNavigate } from "react-router-dom";

export default function LogoutTest() {
  const { user, logout, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const testLogout = async () => {
    console.log("=== TESTING LOGOUT ===");
    console.log("User before logout:", user);
    
    try {
      const result = await logout();
      console.log("Logout result:", result);
      console.log("User after logout:", useAuthStore.getState().user);
      
      // Navigate after logout
      setTimeout(() => {
        navigate("/login");
      }, 500);
      
    } catch (error) {
      console.error("Test logout error:", error);
    }
  };

  const testClearUser = () => {
    console.log("=== TESTING CLEAR USER ===");
    clearUser();
    console.log("User after clear:", useAuthStore.getState().user);
    navigate("/login");
  };

  return (
    <div className="fixed top-20 right-4 bg-red-600 text-white p-4 rounded-lg z-[100]">
      <h3 className="font-bold mb-2">Logout Test</h3>
      <p className="text-sm mb-2">User: {user?.email || "None"}</p>
      <div className="space-y-2">
        <button
          onClick={testLogout}
          className="block w-full bg-red-800 hover:bg-red-900 px-3 py-1 rounded text-sm"
        >
          Test Logout
        </button>
        <button
          onClick={testClearUser}
          className="block w-full bg-red-800 hover:bg-red-900 px-3 py-1 rounded text-sm"
        >
          Clear User (No API)
        </button>
      </div>
    </div>
  );
}