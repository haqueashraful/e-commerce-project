import axios from "axios";

const { headers } = require("next/headers");

const apiKey = process.env.NEXT_PUBLIC_STRAPI_API;

const params = {
  headers: {
    Authorization: `Bearer ${apiKey}`, 
    "Content-Type": "application/json", 
  },
};

export const fetchDataFormApi = async (url) => {
  const { data } = await axios.get("http://localhost:1337" + url, params);

  return data;
};

export const postData = async (url, formData) => {
  const { res } =  axios.post(
    "http://localhost:1337" + url,
    formData,
    params
  );
  return res;
};

export const deleteData = async (url) => {
  const { res } =  axios.delete(
    "http://localhost:1337" + url,
    params
  );
  return res;
}

export const updateData = async (url, formData) => {
  const { res } =  axios.patch(
    "http://localhost:1337" + url,
    formData,
    params
  );
  return res;
}