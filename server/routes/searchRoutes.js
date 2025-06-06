import express from "express";
import {
  getSearchHistory,
  removeItemsFromSearchHistory,
  searchMovie,
} from "../controllers/searchController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const searchRouter = express.Router();

searchRouter.get("/:title", protectRoute, searchMovie);
searchRouter.get("/history", protectRoute, getSearchHistory);
searchRouter.patch("/history/:id", protectRoute, removeItemsFromSearchHistory);

export default searchRouter;
