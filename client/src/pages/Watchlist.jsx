import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.jsx";
import { FaPlay, FaStar, FaTv, FaTrash, FaHeart } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Watchlist() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching watchlist from:",
        BACKEND_URL + "/api/v1/watchlist"
      );
      const res = await axios.get(BACKEND_URL + "/api/v1/watchlist", {
        withCredentials: true,
      });
      console.log("Watchlist API response:", res.data);

      if (res.data.success) {
        const userWatchlist = res.data.watchlist || [];
        console.log("User watchlist:", userWatchlist);
        setWatchlist(userWatchlist);
      } else {
        console.log("Unsuccessful response");
        setWatchlist([]);
      }
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      console.error("Error details:", err.response?.data);

      // If user is not authenticated, redirect to login
      if (err.response?.status === 401) {
        console.log("User not authenticated, redirecting to login");
        navigate("/login");
        return;
      }

      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movie) => {
    try {
      setRemoving(movie.Title);
      console.log("Removing movie from watchlist:", movie);

      // Try to remove by movieId first (more reliable)
      if (movie.movieId) {
        console.log("Removing by movie ID:", movie.movieId);
        await axios.patch(
          BACKEND_URL + `/api/v1/watchlist/remove-by-id/${movie.movieId}`,
          {},
          { withCredentials: true }
        );
      } else {
        console.log("Removing by title:", movie.Title);
        // Fallback to removing by title
        await axios.patch(
          BACKEND_URL +
            `/api/v1/watchlist/remove/${encodeURIComponent(movie.Title)}`,
          {},
          { withCredentials: true }
        );
      }

      // Remove from local state
      setWatchlist((prev) => prev.filter((item) => item.Title !== movie.Title));
      console.log("Movie removed from local state");
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setRemoving(null);
    }
  };

  const handleMovieInteraction = (movieTitle) => {
    setHoveredMovie(movieTitle);
  };

  const handleMovieLeave = () => {
    setHoveredMovie(null);
  };

  const handleWatchMovie = (movie) => {
    if (movie.movieId) {
      // Use the original movie ID to navigate
      navigate(`/watch/${movie.movieId}`);
    } else {
      // Fallback: try to find the movie by title
      console.log("No movie ID available, searching by title:", movie.Title);
      // You could implement a search endpoint to find the movie by title
      // For now, show an alert
      alert(
        "Movie ID not available. Please try adding the movie to watchlist again."
      );
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown";
      return format(date, "PPP");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] pt-16 lg:pt-20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your watchlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] pt-16 lg:pt-20">
      <Navbar />

      <div className="px-4 md:px-6 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaHeart className="text-fuchsia-400 text-2xl md:text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-300 text-sm md:text-base">
            {watchlist.length === 0
              ? "Your watchlist is empty. Start adding movies to watch later!"
              : `You have ${watchlist.length} ${
                  watchlist.length === 1 ? "movie" : "movies"
                } in your watchlist`}
          </p>
        </div>

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-6xl text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover amazing movies and add them to your watchlist to keep
              track of what you want to watch.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          /* Movies Grid - Similar to MovieList.jsx layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {watchlist.map((movie, index) => (
              <div
                key={`${movie.Title}-${index}`}
                className="relative group bg-white/5 rounded-xl overflow-hidden shadow-md hover:shadow-fuchsia-600 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => handleMovieInteraction(movie.Title)}
                onMouseLeave={handleMovieLeave}
                onTouchStart={() => handleMovieInteraction(movie.Title)}
                onClick={() => handleMovieInteraction(movie.Title)}
              >
                {/* Poster Image */}
                {movie.Poster_Url ? (
                  <img
                    src={movie.Poster_Url}
                    alt={movie.Title}
                    className="w-full h-60 md:h-80 object-cover transition-transform duration-300 group-hover:scale-104"
                  />
                ) : (
                  <div className="w-full h-60 md:h-80 bg-gradient-to-br from-purple-900 to-fuchsia-900 flex items-center justify-center">
                    <div className="text-center p-4">
                      <FaTv className="text-4xl text-white/60 mb-2 mx-auto" />
                      <p className="text-white/80 font-medium text-sm line-clamp-2">
                        {movie.Title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div
                  className={`
                    absolute inset-0 text-white 
                    transition-all duration-300 p-3 flex flex-col justify-between
                    bg-black/80 backdrop-blur-sm
                    ${
                      hoveredMovie === movie.Title
                        ? "opacity-100 visible"
                        : "opacity-0 invisible sm:group-hover:opacity-100 sm:group-hover:visible"
                    }
                  `}
                >
                  {/* Top Info */}
                  <div>
                    <div className="flex items-center gap-2 text-yellow-400 mb-2 text-sm">
                      <FaStar />{" "}
                      <span>{movie.Vote_Average || movie.Rating || "N/A"}</span>
                      <span className="ml-auto px-2 py-0.5 text-xs bg-yellow-500 text-black rounded">
                        HD
                      </span>
                      <FaTv className="ml-2 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold line-clamp-1 mb-1">
                      {movie.Title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-4">
                      {movie.Release_Date && (
                        <>
                          Released: {formatDate(movie.Release_Date)} <br />
                        </>
                      )}
                      Genres: {movie.Genre || "N/A"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWatchMovie(movie);
                      }}
                    >
                      <FaPlay /> Watch Now
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(movie);
                      }}
                      disabled={removing === movie.Title}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                    >
                      {removing === movie.Title ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                          Removing...
                        </>
                      ) : (
                        <>
                          <FaTrash /> Remove
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Close button for mobile */}
                {hoveredMovie === movie.Title && (
                  <button
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center sm:hidden z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieLeave();
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Background overlay to close mobile overlay */}
        {hoveredMovie && (
          <div
            className="fixed inset-0 bg-transparent z-0 sm:hidden"
            onClick={handleMovieLeave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
