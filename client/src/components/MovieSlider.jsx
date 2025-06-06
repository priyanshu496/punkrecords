import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaPlay, FaTv } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { BACKEND_URL } from "../config.jsx";
import { useNavigate } from "react-router-dom";

export default function HeroSpotlight() {

  const navigate = useNavigate();

  const [spotlights, setSpotlights] = useState([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/api/v1/movie/all")
      .then((res) => {
        const shuffled = res.data.content.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        setSpotlights(selected);
      })
      .catch((err) => console.error("Spotlight fetch error", err));
  }, []);

  if (spotlights.length === 0) return null; // or loading spinner

  return (
   <Swiper
  modules={[Navigation, Autoplay]}
  navigation
  autoplay={{
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  loop={spotlights.length > 1}
  className="w-full min-h-[80vh] lg:min-h-[100vh]" // 💡 Ensures consistent height
>
  {spotlights.map((movie, index) => (
    <SwiperSlide key={movie._id}>
      <div
        className="w-full min-h-[80vh] lg:min-h-[100vh] flex items-center justify-between px-4 lg:px-24 relative "
        style={{
          backgroundImage: `url(${movie.Poster_Url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0" />
        <div className="relative z-10 w-full max-w-[65%] text-white space-y-5 py-10">
          <h3 className="text-yellow-400 text-lg font-medium">
            #{index + 1} Spotlight
          </h3>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            {movie.Title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-300 flex-wrap">
            <span className="flex items-center gap-1">
              <FaTv /> {movie.Genre + " "}
            </span>
            <span>{movie.Vote_Average}</span>
            <span className="flex items-center gap-1">
              <MdOutlineCalendarToday />
              {format(new Date(movie.Release_Date), "PPP")}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(movie.tags || []).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded bg-yellow-600 text-white font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {movie.Overview}
          </p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <button className="bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_8px_rgba(255,221,51,0.5)] hover:shadow-[0_0_12px_rgba(255,221,51,0.7)] font-semibold px-6 py-2 rounded-full flex items-center gap-2"
            onClick={() => navigate(`/watch/${movie._id}`)}
            >
              <FaPlay /> Watch Now
            </button>
          </div>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

  );
}
