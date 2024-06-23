import axios from "axios";
const { headers } = require("next/headers");

const apiKey = process.env.NEXT_PUBLIC_STRAPI_API;


const params = {
  headers: {
    Authorization: `Bearer ${apiKey}`, // Replace with your API key
    "Content-Type": "application/json", // Replace with your content type
  },
};

export const fetchDataFormApi = async (url) => {
  const { data } = await axios.get("http://localhost:1337" + url, params);

  return data;
};

