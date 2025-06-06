import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import WatchPage from "./pages/WatchPage.jsx";
import Movies from "./pages/Movies.jsx";
import TvShows from "./pages/TvShows.jsx";
import Profile from "./pages/Profile.jsx"; // Add this import
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuthStore } from "./store/authStore.jsx";
import { useEffect, useState } from "react";
import Watchlist from "./pages/Watchlist.jsx";

function App() {
  const { user, authCheck, isCheckingAuth } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  // Check authentication on app start
  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      console.log("App: Initializing app and checking auth state...");
      try {
        await authCheck();
      } catch (error) {
        console.error("App: Initial auth check failed:", error);
      } finally {
        if (isMounted) {
          setAppReady(true);
        }
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [authCheck]);

  // Show loading during initial auth check
  if (!appReady || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={!user ? <Register /> : <Navigate to="/home" replace />} 
      />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/home" replace />} 
      />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/watch/:id" 
        element={
          <ProtectedRoute>
            <WatchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movies" 
        element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tv-shows" 
        element={
          <ProtectedRoute>
            <TvShows />
          </ProtectedRoute>
        } 
      />
     < Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
     < Route 
        path="/watchlist" 
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route - redirect based on auth status */}
      <Route 
        path="*" 
        element={<Navigate to={!user ? "/" : "/home"} replace />} 
      />
    </Routes>
  );
}

export default App;