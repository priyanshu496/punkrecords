import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  getUserWatchlist, 
  addItemToWatchlist, 
  removeItemFromWatchlist, 
  removeItemFromWatchlistById 
} from "../controllers/watchlistController.js";

const watchRouter = express.Router();

// Get user's watchlist
watchRouter.get("/", protectRoute, getUserWatchlist);

// Add movie to watchlist
watchRouter.patch("/add/:id", protectRoute, addItemToWatchlist);

// Remove movie from watchlist by title
watchRouter.patch("/remove/:title", protectRoute, removeItemFromWatchlist);

// Remove movie from watchlist by movie ID
watchRouter.patch("/remove-by-id/:movieId", protectRoute, removeItemFromWatchlistById);

export default watchRouter;