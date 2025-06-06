import { Movie } from "../models/movieModel.js";

export const getTrendingMovies = async (req, res) => {
  try {
    const trendingArray = [
      "Spider-Man: No Way Home",
      "The Batman",
      "Texas Chainsaw Massacre",
      "Venom: Let There Be Carnage",
      "The Suicide Squad",
      "Avengers: Infinity War",
      "Black Widow",
      "Godzilla vs. Kong",
      "Avatar",
      "My Hero Academia: Heroes Rising",
      "The Amazing Spider-Man 2",
      "The Avengers",
      "Spider-Man: Far From Home",
      "Dragon Ball Z: Resurrection 'F'",
      "Boruto: Naruto the Movie",
    ];

    const movieDetails = await Promise.all(
      trendingArray.map(async (el) => {
        return Movie.findOne({ Title: el });
      })
    );

    res.status(200).json({ success: true, movieDetails });
  } catch (error) {
    console.error("Error fetching trending movies:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMovieTrailer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Movie.findById(id);
    if (!data || !data.videoURL) {
      return res
        .status(404)
        .json({ success: false, message: "Trailer not found" });
    }

    res.status(200).json({ videoURL: data.videoURL });
  } catch (error) {
    console.log("Error in getMovieTrailer: " + error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Movie.findById(id);

    if (!data || !data._id) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Return the complete movie data for consistency
    res.status(200).json({
      success: true,
      content: data, // Changed from 'details' to 'content' to match frontend expectations
      // Also include individual fields for backward compatibility
      details: {
        Title: data.Title,
        Poster_Url: data.Poster_Url,
        Genre: data.Genre,
        Overview: data.Overview,
        Description: data.Description || data.Overview, // Add Description field
        Language: data.Original_Language,
        Vote_Average: data.Vote_Average,
        Release_Date: data.Release_Date,
        videoURL: data.videoURL, // Include video URL
        _id: data._id
      },
    });
  } catch (error) {
    console.log("Error details", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMovieByCategory = async (req, res) => {
  try {
    const { genre } = req.params;
    const data = await Movie.find({
      Genre: { $in: [new RegExp(`^${genre}$`, "i")] },
    });

    if (data.length === 0) { // Fixed: was -1, should be 0
      return res
        .status(404)
        .json({ success: false, message: "No movies found for this category" });
    }
    res.status(200).json({
      success: true,
      Movies: {
        data,
      },
    });
  } catch (error) {
    console.log("Error in category controller");
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      success: true,
      content: movies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};