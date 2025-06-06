import React from "react";
import Navbar from "../components/Navbar.jsx";
import MovieList from "../components/MovieList.jsx";
import MovieSlider from "../components/MovieSlider.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <div className="text-white min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] pt-16 lg:pt-20">
      <Navbar />
      <MovieSlider />
      <MovieList />
      <Footer />
    </div>
  );
};

export default Home;
