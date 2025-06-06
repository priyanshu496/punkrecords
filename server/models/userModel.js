import mongoose from "mongoose";

// Define watchlist item schema
const watchlistItemSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Genre: {
    type: String, // Store as string (comma-separated if multiple)
    default: 'N/A'
  },
  Overview: {
    type: String,
    default: ''
  },
  videoURL: {
    type: String,
    default: ''
  },
  Language: {
    type: String,
    default: 'N/A'
  },
  Rating: {
    type: Number,
    default: 0
  },
  Release_Date: {
    type: Date,
    default: null
  },
  Poster_Url: {
    type: String,
    default: ''
  },
  Vote_Average: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Fixed typo: was 'require'
    unique: true,
  },
  password: {
    type: String,
    required: true, // Fixed typo: was 'require'
  },
  searchHistory: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
      image: String,
      Title: String,
      searchType: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
    },
  ],
  watchlist: [watchlistItemSchema],
  subscription: {
    type: String,
    default: "Free plan",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);