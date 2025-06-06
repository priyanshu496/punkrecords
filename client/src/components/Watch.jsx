import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaStar, FaCalendar, FaLanguage, FaArrowLeft, FaTimes, FaHeart, FaCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { BACKEND_URL } from '../config.jsx';
import axios from 'axios';

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState('');

  useEffect(() => {
    fetchMovieDetails();
    fetchRecommendations();
  }, [id]);

  useEffect(() => {
    if (movie) {
      checkIfInWatchlist();
    }
  }, [movie]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching movie details for ID:', id);
      const response = await fetch(`${BACKEND_URL}/api/v1/movie/details/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Movie data received:', data);
      
      const movieData = data.content || data.details || data;
      setMovie(movieData);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/movie/all`);
      if (response.ok) {
        const data = await response.json();
        const allMovies = data.content || [];
        const shuffled = allMovies.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const checkIfInWatchlist = async () => {
    try {
      console.log('Checking if movie is in watchlist...');
      const response = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
        withCredentials: true,
      });
      
      const userWatchlist = response.data?.user?.watchlist || [];
      console.log('User watchlist:', userWatchlist);
      
      // Check by both movieId and Title for better reliability
      const movieInWatchlist = userWatchlist.some(
        (watchlistMovie) => 
          (watchlistMovie.movieId && watchlistMovie.movieId.toString() === id) ||
          (watchlistMovie.Title === movie.Title)
      );
      
      console.log('Movie in watchlist:', movieInWatchlist);
      setIsInWatchlist(movieInWatchlist);
    } catch (err) {
      console.error('Error checking watchlist:', err);
      // If there's an auth error, user might not be logged in
      if (err.response?.status === 401) {
        console.log('User not authenticated');
      }
    }
  };

  const handleAddToWatchlist = async () => {
    if (!movie) {
      console.error('No movie data available');
      return;
    }

    try {
      setIsAddingToWatchlist(true);
      setWatchlistMessage('');
      
      console.log('Current watchlist state:', isInWatchlist);
      console.log('Movie ID:', id);
      console.log('Movie Title:', movie.Title);
      
      if (isInWatchlist) {
        console.log('Removing from watchlist...');
        // Remove from watchlist - try by ID first, then by title
        try {
          const removeResponse = await axios.patch(
            `${BACKEND_URL}/api/v1/watchlist/remove-by-id/${id}`,
            {},
            { withCredentials: true }
          );
          console.log('Remove by ID response:', removeResponse.data);
        } catch (idError) {
          console.log('Remove by ID failed, trying by title:', idError.response?.data);
          // Fallback to title-based removal
          const removeResponse = await axios.patch(
            `${BACKEND_URL}/api/v1/watchlist/remove/${encodeURIComponent(movie.Title)}`,
            {},
            { withCredentials: true }
          );
          console.log('Remove by title response:', removeResponse.data);
        }
        setIsInWatchlist(false);
        setWatchlistMessage('Removed from watchlist');
      } else {
        console.log('Adding to watchlist...');
        // Add to watchlist
        const addResponse = await axios.patch(
          `${BACKEND_URL}/api/v1/watchlist/add/${id}`,
          {},
          { withCredentials: true }
        );
        
        console.log('Add to watchlist response:', addResponse.data);
        
        if (addResponse.data.success) {
          setIsInWatchlist(true);
          setWatchlistMessage('Added to watchlist');
        } else {
          throw new Error(addResponse.data.message || 'Failed to add to watchlist');
        }
      }

      // Clear message after 3 seconds
      setTimeout(() => setWatchlistMessage(''), 3000);
    } catch (err) {
      console.error('Error updating watchlist:', err);
      console.error('Error response:', err.response?.data);
      
      // Show more specific error messages
      let errorMessage = 'Error updating watchlist';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401) {
        errorMessage = 'Please log in to add to watchlist';
      } else if (err.response?.status === 400) {
        errorMessage = 'Movie already in watchlist';
      } else if (err.response?.status === 404) {
        errorMessage = 'Movie not found';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setWatchlistMessage(errorMessage);
      setTimeout(() => setWatchlistMessage(''), 5000); // Show error longer
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const handlePlayVideo = () => {
    console.log('Play button clicked');
    console.log('Movie video URL:', movie?.videoURL);
    
    if (!movie?.videoURL) {
      console.log('No video URL available');
      setVideoError(true);
      return;
    }
    
    setVideoError(false);
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
    setVideoError(false);
  };

  const handleVideoError = (e) => {
    console.error('Video playback error:', e);
    setVideoError(true);
  };

  const handleWatchRecommendation = (movieId) => {
    navigate(`/watch/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-white text-lg">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Movie Not Found</h2>
          <p className="text-gray-300 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 lg:mt-20 mt-16">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20 lg:mt-22 mt-16">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Watchlist Message */}
      {watchlistMessage && (
        <div className={`fixed top-20 right-4 z-60 px-4 py-2 rounded-lg shadow-lg text-white ${
          watchlistMessage.includes('Error') || watchlistMessage.includes('login') 
            ? 'bg-red-600' 
            : watchlistMessage.includes('Removed') 
            ? 'bg-orange-600' 
            : 'bg-green-600'
        }`}>
          {watchlistMessage}
        </div>
      )}

      {/* Video Player Modal */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={handleCloseVideo}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-10"
          >
            <FaTimes size={24} />
          </button>
          <div className="w-full h-full max-w-6xl max-h-96 md:max-h-[90vh] flex items-center justify-center">
            {movie.videoURL && !videoError ? (
              <video
                src={movie.videoURL}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
                onError={handleVideoError}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
                onPlay={() => console.log('Video started playing')}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center text-white">
                <p className="text-xl mb-4">
                  {videoError ? 'Error loading video' : 'Video not available'}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {movie.videoURL ? `URL: ${movie.videoURL}` : 'No video URL provided'}
                </p>
                <button
                  onClick={handleCloseVideo}
                  className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Movie Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={movie.Poster_Url}
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            
            {/* Movie Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {movie.Title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{movie.Vote_Average || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    <span>{movie.Release_Date ? format(new Date(movie.Release_Date), 'yyyy') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLanguage />
                    <span>{movie.Language || movie.Original_Language || 'N/A'}</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold">
                    HD
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold text-white">Genres:</span> {
                      Array.isArray(movie.Genre) 
                        ? movie.Genre.join(', ') 
                        : (movie.Genre || 'N/A')
                    }
                  </p>
                  <p className="text-gray-300 text-sm md:text-base max-w-3xl leading-relaxed">
                    {movie.Overview || movie.Description || 'No description available.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handlePlayVideo}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <FaPlay /> Play
                  </button>
                  <button 
                    onClick={handleAddToWatchlist}
                    disabled={isAddingToWatchlist}
                    className={`flex items-center gap-2 px-6 py-4 backdrop-blur-sm text-white rounded-xl transition-all ${
                      isInWatchlist 
                        ? 'bg-green-600/80 hover:bg-green-700/80' 
                        : 'bg-white/20 hover:bg-white/30'
                    } ${isAddingToWatchlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAddingToWatchlist ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isInWatchlist ? 'Removing...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {isInWatchlist ? <FaCheck /> : <FaHeart />}
                        {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                      </>
                    )}
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Like This Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">More Like This</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendations.map((recMovie) => (
              <div
                key={recMovie._id}
                className="group relative bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={recMovie.Poster_Url}
                    alt={recMovie.Title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                      {recMovie.Title}
                    </h3>
                    <div className="flex items-center gap-2 text-yellow-400 text-xs mb-3">
                      <FaStar />
                      <span>{recMovie.Vote_Average || 'N/A'}</span>
                    </div>
                    <button
                      onClick={() => handleWatchRecommendation(recMovie._id)}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FaPlay size={12} /> Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;