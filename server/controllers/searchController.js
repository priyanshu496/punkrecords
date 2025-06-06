import { User } from "../models/userModel.js";
import { Movie } from "../models/movieModel.js";

export const searchMovie = async (req, res) => {
  try {
    const { title } = req.params;

    // Case-insensitive search
    const data = await Movie.findOne({
      Title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Movie not available in database!",
      });
    }

    // Assuming user is attached by auth middleware as req.user
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(userId, {
      $push: {
        searchHistory: {
          id: data._id,
          image: data.Poster_Url,
          Title: data.Title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ success: true, content: data });
  } catch (error) {
    console.log("Error search movie ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSearchHistory = (req, res) => {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    console.log("Error getting history");
    res.status(200).json({ success: false, message: "Internal server error!" });
  }
};

export const removeItemsFromSearchHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const data = await User.findByIdAndUpdate(userId, { searchHistory: [] });

    await data.save();
    res.status(200).json({ success: true, message: "History cleared" });
  } catch (error) {
    console.log("Error search delete ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
