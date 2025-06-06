import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.jsx";
import { FaPlay, FaStar, FaTv } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function TVlist() {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [watchMovie, setWatchMovie] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(BACKEND_URL + "/api/v1/movie/all");
        const allMovies = res.data?.content || [];
        const limitedMovies = allMovies.slice(0, 50);
        setMovies(limitedMovies);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieInteraction = (movieId) => {
    setHoveredMovie(movieId);
  };

  const handleMovieLeave = () => {
    setHoveredMovie(null);
  };

  const handleWatch = () =>{
    setWatchMovie(true);
    
  }


  if (loading) {
    return <div className="text-white text-center mt-10 cursor-progress">Loading...</div>;
  }

  return (
    <div className="px-4 md:px-6 py-6 md:py-8 bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 ">All TV Shows</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="relative group bg-white/5 rounded-xl overflow-hidden shadow-md hover:shadow-fuchsia-600 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => handleMovieInteraction(movie._id)}
            onMouseLeave={handleMovieLeave}
            onTouchStart={() => handleMovieInteraction(movie._id)}
            onClick={() => handleMovieInteraction(movie._id)}
          >
            {/* Poster Image */}
            <img
              src={movie.Poster_Url}
              alt={movie.Title}
              className="w-full h-60 md:h-80 object-cover transition-transform duration-300 group-hover:scale-104"
            />

            {/* Overlay */}
            <div
              className={`
                absolute inset-0 text-white 
                transition-all duration-300 p-3 flex flex-col justify-between
                bg-black/80 backdrop-blur-sm
                ${hoveredMovie === movie._id 
                  ? 'opacity-100 visible' 
                  : 'opacity-0 invisible sm:group-hover:opacity-100 sm:group-hover:visible'
                }
              `}
            >
              {/* Top Info */}
              <div>
                <div className="flex items-center gap-2 text-yellow-400 mb-2 text-sm">
                  <FaStar /> <span>{movie.Vote_Average || "N/A"}</span>
                  <span className="ml-auto px-2 py-0.5 text-xs bg-yellow-500 text-black rounded">
                    HD
                  </span>
                  <FaTv className="ml-2 text-white" />
                </div>

                <h3 className="text-lg font-semibold line-clamp-1 mb-1">{movie.Title}</h3>
                <p className="text-sm text-gray-300 line-clamp-4">
                  Released: {format(new Date(movie.Release_Date), "PPP") || "Unknown"} <br />
                  Genres: {movie.Genre + " " || "N/A"}
                </p>
              </div>

              {/* Watch Now Button */}
              <button 
                className="cursor-pointer mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/watch/${movie._id}`);
                  handleWatch;
                  {
                    watchMovie === true &&
                    console.log(movie.Title)
                  }

                  
                  console.log('Watch movie:', movie.Title);
                }}
              >
                <FaPlay /> Watch Now
              </button>
            </div>

            {/* Close button for mobile */}
            {hoveredMovie === movie._id && (
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

      {/* Background overlay to close mobile overlay */}
      {hoveredMovie && (
        <div 
          className="fixed inset-0 bg-transparent z-0 sm:hidden"
          onClick={handleMovieLeave}
        />
      )}
    </div>
  );
}