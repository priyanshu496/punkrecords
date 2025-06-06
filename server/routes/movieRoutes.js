import express from "express";
import {
  getAllMovies,
  getMovieByCategory,
  getMovieDetails,
  getMovieTrailer,
  getTrendingMovies,
} from "../controllers/movieController.js";
const movieRouter = express.Router();

movieRouter.get("/trending", getTrendingMovies);
movieRouter.get("/trailer/:id", getMovieTrailer);
movieRouter.get("/details/:id", getMovieDetails);
movieRouter.get("/category/:genre", getMovieByCategory);
movieRouter.get("/all", getAllMovies);

export default movieRouter;
