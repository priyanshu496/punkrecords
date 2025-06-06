// import axios from "axios";
// import { BACKEND_URL } from "../config.jsx";
// import { create } from "zustand";
// import toast from "react-hot-toast";

// export const useSearchStore = create((set) => ({
  
//   search: async (params) => {
//     try {
//         axios.defaults.withCredentials = true;
//       const  response  = await axios.get(
//         BACKEND_URL + `api/v1/search/movie/${params}`, 
//       );
//       const data = await response.json()
//       const {Poster_Url} = data
//       console.log(Poster_Url)
//       // toast.success(response.data);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   },
// }));
