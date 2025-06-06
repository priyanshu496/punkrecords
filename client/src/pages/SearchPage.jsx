import React from "react";
import Navbar from "../components/Navbar.jsx";
import SearchResults from "../components/SearchResults.jsx";
import Footer from "../components/Footer.jsx";

const SearchPage = () => {
  return (
    <div className="text-white min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] via-[#1e1b4b] to-[#3b0764] pt-16 lg:pt-20">
      <Navbar />
      <SearchResults />
      <Footer />
    </div>
  );
};

export default SearchPage;
