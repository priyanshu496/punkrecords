import Navbar from "../components/Navbar.jsx";
import MovieList from "../components/MovieList.jsx";
import Footer from "../components/Footer.jsx";

const Movies = () => {
  return (
    <div>
      <Navbar />

      <div className="lg:mt-20 mt-14">
        <MovieList />
      </div>

      <Footer />
    </div>
  );
};

export default Movies;
