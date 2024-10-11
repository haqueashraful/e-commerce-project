"use client";

import React, { useEffect, useState } from "react";
import MyContext from "./ThemeContext";
import axios from "axios";
import data from "../../data";
import { fetchDataFormApi, postData, deleteData } from "@/Utils/utils";
import { useRouter } from "next/navigation";

export default function ThemeProvider({ children }) {
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0); // Initialize with 0
  const [isOpenNavigation, setIsOpenNavigation] = useState(false);
  const [isLogin, setIsLogin] = useState();
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [cartTotalAmount, setCartTotalAmount] = useState();
  const [searchData, setSearchData] = useState();
  const [searchKeyWord, setSearchKeyWord] = useState();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const [selectCategoriesData, setSelectCategoriesData] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (url) => {
    fetchDataFormApi("/api/categories?populate=*").then((res) => {
      setProductData(res);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this code runs only on the client-side
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // useEffect(() => {
  //   setProductData(data[0]);
  //   setCartItems(data[2]);
  // }, []);

  useEffect(() => {
    const pdata = data.productData;
    setProductData(pdata);

    const cdata = data.cartItems;
    setCartItems(cdata);
  }, []);

  useEffect(() => {
    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  // const getCartData = async (url) => {
  //   try {
  //     const response = await axios.get(url);
  //     setCartItems(response.data);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const addToCart = async (item) => {
  //   item.quantity = 1;
  //   let productId = item.id;
  //   let catId = item.attributes.category.data.id;
  //   let subCatId = item.attributes.sub_cats.data[0].id;
  //   let url = item.attributes.img.data[0].attributes.url

  //   console.log(url, "url");

  //   const cart_data = {
  //     // catId: catId,
  //     // subCatId: subCatId,
  //     productId: productId,
  //     quantity: item.quantity,
  //     // name: item.attributes.name,
  //     // price: item.attributes.price,
  //     // imageUrl: url,
  //   };
  //   console.log(cart_data, "cart_data");
  //  await postData("/api/cat-data", cart_data);
  // };

  const addToCart = async (item) => {
    const quantity = 1;

    const formData = {
      data: {
        quantity : quantity,
        catId : item.attributes.category.data.id,
        subCatId : item.attributes.sub_cats.data[0].id,
        productId : item.id,
        name : item.attributes.name,
        price : item.attributes.price,
        imageUrl : item.attributes.img.data[0].attributes.url
      }
    }
    postData("/api/carts", formData);
  };

  const removeItemsFromCart = async (id) => {
    const response = await deleteData(`/api/carts/${id}`);
    if (response !== null) {
      getCartData("http://localhost:5000/cartItems");
    }
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const signIn = () => {
    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);
  };

  const signOut = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
  };

  const openFilters = () => {
    setIsOpenFilters(!isOpenFilters);
  };

  const searchTrigger = () => {
    let params;

    if (selectCategoriesData !== "" && selectCategoriesData !== undefined) {
      params = `/api/products?populate=*&[filters][categories][title]=${selectCategoriesData}&[filters][name][$contains]=${searchValue}`;
    } else {
      params = `/api/products?populate=*&[filters][name][$contains]=${searchValue}`;
    }

    getSearchData(params);
  };

  const getSearchData = async (url) => {
    console.log(url, "search params");
    fetchDataFormApi(url).then((res) => {
      console.log(res.data, "search data");
      setSearchData(res.data);
      setSearchKeyWord(searchValue);
      router.push("/blank");
      setTimeout(() => {
        router.push(`/search?query=${searchValue}`);
      }, 100);
    });
  };

  const value = {
    cartItems,
    isLogin,
    productData,
    windowWidth,
    isOpenFilters,
    addToCart,
    removeItemsFromCart,
    emptyCart,
    signOut,
    signIn,
    openFilters,
    isOpenNavigation,
    setIsOpenNavigation,
    setCartTotalAmount,
    cartTotalAmount,
    setCartItems,
    setSearchData,
    searchData,
    setSearchKeyWord,
    searchKeyWord,
    setSearchValue,
    searchValue,
    setSelectCategoriesData,
    selectCategoriesData,
    searchTrigger,
    getSearchData,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
