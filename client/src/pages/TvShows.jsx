import React from "react";
import Navbar from "../components/Navbar";
import TVlist from "../components/TV.jsx";
import Footer from "../components/Footer.jsx";

const TvShows = () => {
  return (
    <div>
      <Navbar />
      <div className="lg:mt-20 mt-14">
        <TVlist />
      </div>
      <Footer />
    </div>
  );
};

export default TvShows;
