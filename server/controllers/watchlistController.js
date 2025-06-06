import { Movie } from "../models/movieModel.js";
import { User } from "../models/userModel.js";

// New function to get user's watchlist
export const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("Getting watchlist for user:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select('watchlist');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("User watchlist length:", user.watchlist.length);

    res.status(200).json({
      success: true,
      watchlist: user.watchlist,
      count: user.watchlist.length
    });
  } catch (error) {
    console.error("Error in getUserWatchlist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const addItemToWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Adding movie to watchlist, ID:", id);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid movie ID format" 
      });
    }

    const movie = await Movie.findById(id);
    console.log("Found movie:", movie);

    const userId = req.user?._id;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: "Movie not found" 
      });
    }

    // Check if movie already exists in watchlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const existsInWatchlist = user.watchlist.some(
      item => item.movieId && item.movieId.toString() === id
    );

    if (existsInWatchlist) {
      return res.status(400).json({ 
        success: false, 
        message: "Movie already in watchlist" 
      });
    }

    // Create watchlist item with proper field mapping
    const watchlistItem = {
      movieId: movie._id,
      Title: movie.Title,
      Genre: Array.isArray(movie.Genre) ? movie.Genre.join(', ') : (movie.Genre || 'N/A'),
      Overview: movie.Overview || '',
      videoURL: movie.videoURL || '',
      Language: movie.Original_Language || 'N/A',
      Rating: movie.Vote_Average || 0,
      Release_Date: movie.Release_Date ? new Date(movie.Release_Date) : null,
      Poster_Url: movie.Poster_Url || '',
      Vote_Average: movie.Vote_Average || 0,
      addedAt: new Date(),
    };

    console.log("Watchlist item to add:", watchlistItem);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          watchlist: watchlistItem,
        },
      },
      { new: true }
    );

    console.log("Updated user watchlist length:", updatedUser.watchlist.length);

    res.status(200).json({
      success: true,
      message: "Movie added to watchlist successfully",
      content: movie,
      watchlistItem: watchlistItem,
    });
  } catch (error) {
    console.error("Error in addItemToWatchlist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const removeItemFromWatchlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { title } = req.params;
    
    console.log("Removing from watchlist by title:", title, "User:", userId);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decodedTitle = decodeURIComponent(title);
    console.log("Decoded title:", decodedTitle);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: { Title: { $regex: new RegExp(`^${decodedTitle}$`, "i") } }
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("Updated user watchlist length after removal:", updatedUser.watchlist.length);

    res.status(200).json({ 
      success: true, 
      message: "Movie removed from watchlist successfully" 
    });
  } catch (error) {
    console.error("Error in removeItemFromWatchlist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const removeItemFromWatchlistById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { movieId } = req.params;
    
    console.log("Removing from watchlist by ID:", movieId, "User:", userId);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Validate ObjectId format
    if (!movieId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid movie ID format" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: { movieId: movieId }
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("Updated user watchlist length after removal:", updatedUser.watchlist.length);

    res.status(200).json({ 
      success: true, 
      message: "Movie removed from watchlist successfully" 
    });
  } catch (error) {
    console.error("Error in removeItemFromWatchlistById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};