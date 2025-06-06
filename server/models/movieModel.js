import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  Release_Date: String,
  Title: {
    type: String,
    required: true,
  },
  Overview: String,
  Popularity: Number,
  Vote_Count: Number,
  Vote_Average: Number,
  Original_Language: String,
  Genre: [String],
  Poster_Url: String,
  videoURL: String,
});

export const Movie = mongoose.model("Movie", movieSchema);
