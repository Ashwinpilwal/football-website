// src/api/foursquare.js

import axios from "axios";

const foursquare = axios.create({
  baseURL: "https://api.foursquare.com/v3",
  headers: {
    Authorization: import.meta.env.VITE_FOURSQUARE_API_KEY,
    Accept: "application/json",
  },
});

export default foursquare;