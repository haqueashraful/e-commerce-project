"use client";

import React, { useEffect, useState } from "react";
import MyContext from "./ThemeContext";
import axios from "axios";
import data from "../../data";

export default function ThemeProvider({ children }) {
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0); // Initialize with 0

  const [isOpenNavigation, setIsOpenNavigation] = useState(false);
  const [isLogin, setIsLogin] = useState();
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [cartTotalAmount, setCartTotalAmount] = useState();

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

  const addToCart = async (item) => {
    item.quantity = 1;

    try {
      const res = await axios.post("http://localhost:5000/cartItems", item);
      if (res !== undefined) {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemsFromCart = async (id) => {
    const response = await axios.delete(`http://localhost:5000/cartItems/${id}`);
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
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
