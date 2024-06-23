"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import "../header/header.css";
import Logo from "../../assets/images/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import IconCompare from "../../assets/images/icon-compare.svg";
import IconHeart from "../../assets/images/icon-heart.svg";
import IconCart from "../../assets/images/icon-cart.svg";
import IconUser from "../../assets/images/icon-user.svg";
import Button from "@mui/material/Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener"; // Corrected import

import Nav from "./nav/nav";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MyContext from "@/context/ThemeContext";
import Select from "../selectDrop/select";
import Link from "next/link";
import Image from "next/image";
import Loading from "../Loading";
import { fetchDataFormApi } from "@/Utils/utils";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const Header = (props) => {
  const [catData, setCatData] = useState([]);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [isOpenAccDropDown, setIsOpenAccDropDown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isOpenSearch, setOpenSearch] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const headerRef = useRef();
  const searchInput = useRef();
  const context = useContext(MyContext);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const countryList = [];

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
    getCatData();
  }, []);

  const cat = [];
  const getCatData = async () => {
    fetchDataFormApi("/api/categories?populate=sub_cats").then((res) => {
      setCatData(res);
      {
        res.data !== undefined &&
          res.data.length !== 0 &&
          res.data.map((item, index) => {
            cat.push(item.attributes.title);
          });
      }

      const list = cat.filter((item, index) => {
        return cat.indexOf(item) === index;
      });

      setCategories(list);
    });
  };

  const getCountry = async (url) => {
    try {
      const res = await axios.get(url);
      if (res !== null) {
        res.data.data.forEach((item) => {
          countryList.push(item.country);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let position = window.pageYOffset;
      if (position > 100) {
        headerRef.current.classList.add("fixed");
      } else {
        headerRef.current.classList.remove("fixed");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signOut = () => {
    context.signOut();
    router.push("/");
  };

  const openSearch = () => {
    setOpenSearch(true);
    searchInput.current.focus();
  };

  const closeSearch = () => {
    setOpenSearch(false);
    searchInput.current.blur();
    searchInput.current.value = "";
  };

  const openNav = () => {
    setIsOpenNav(true);
    context.setIsOpenNavigation(true);
  };

  const closeNav = () => {
    setIsOpenNav(false);
    setIsOpenAccDropDown(false);
    context.setIsOpenNavigation(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    context.setSearchValue(event.target.value);
  };

  // const searchTrigger = () => {
  //   let params;

  //   if (selectCategoriesData !== "" && selectCategoriesData !== undefined) {
  //     params = `/api/products?populate=*&[filters][categories][title]=${selectCategoriesData}&[filters][name][$contains]=${searchValue}`;
  //   } else {
  //     params = `/api/products?populate=*&[filters][name][$contains]=${searchValue}`;
  //   }
  //   console.log(params, "search params");
  //   fetchDataFormApi(params).then((res) => {
  //     console.log(res.data, "search data");
  //     context.setSearchData(res.data);
  //     context.setSearchKeyWord(searchValue);
  //     router.push('/blank');
  //     setTimeout(() => {
  //       router.push(`/search?query=${searchValue}`);
  //     }, 100);
  //   });
  // };

  useEffect(() => {
    console.log(context.selectCategoriesData);
    console.log(context.searchValue);
  },[ context.selectCategoriesData, context.searchValue]);


  if (!context) {
    return <p>Loading.....</p>;
  }

  return (
    <>
      <header className="headerWrapper" ref={headerRef}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2 part1 d-flex align-items-center">
              <Link href="/">
                <Image src={Logo} className="logo" alt="logo" />
              </Link>
              {windowWidth < 992 && (
                <div className="ml-auto d-flex align-items-center">
                  <div className="navbarToggle mr-0" onClick={openSearch}>
                    <SearchIcon />
                  </div>
                  <ul className="list list-inline mb-0 headerTabs pl-0 mr-4">
                    <li className="list-inline-item">
                      <span>
                        <Link href={"/cart"}>
                          <Image src={IconCart} alt="cart" />
                          <span className="badge bg-success rounded-circle">
                            {context.cartItems.length}
                          </span>
                        </Link>
                      </span>
                    </li>
                  </ul>
                  <div className="navbarToggle mr-2" onClick={openNav}>
                    <MenuIcon />
                  </div>
                  {context.isLogin && (
                    <div
                      className="myAccDrop"
                      onClick={() => setIsOpenAccDropDown(!isOpenAccDropDown)}
                    >
                      <PersonOutlineOutlinedIcon />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/*headerSearch start here */}
            <div className="col-sm-5 part2">
              <div
                className={`headerSearch d-flex align-items-center ${
                  isOpenSearch ? "open" : ""
                }`}
              >
                {windowWidth < 992 && (
                  <div className="closeSearch" onClick={closeSearch}>
                    <ArrowBackIosIcon />
                  </div>
                )}
                {categories.length !== 0 && (
                  <Select
                    // setSelectCategoriesData={context.setSelectCategoriesData}
                    data={categories}
                    placeholder={"All Categories"}
                    icon={false}
                  />
                )}
                <div className="search">
                  <input
                    type="text"
                    placeholder="Search for items..."
                    ref={searchInput}
                    onChange={handleChange}
                  />
                  <SearchIcon
                    className="searchIcon cursor"
                    onClick={context.searchTrigger}
                  />
                </div>
              </div>
            </div>
            {/*headerSearch start here */}

            <div className="col-sm-5 d-flex align-items-center part3 res-hide">
              <div className="ml-auto d-flex align-items-center">
                <div className="countryWrapper">
                  <Select
                    data={countryList}
                    placeholder={"Your Location"}
                    icon={<LocationOnOutlinedIcon style={{ opacity: "0.5" }} />}
                  />
                </div>
                <ClickAwayListener onClickAway={() => setIsOpenDropDown(false)}>
                  <ul className="list list-inline mb-0 headerTabs">
                    <li className="list-inline-item">
                      <span>
                        <Image src={IconCompare} alt="compare" />
                        <span className="badge bg-success rounded-circle">
                          3
                        </span>
                        Compare
                      </span>
                    </li>
                    <li className="list-inline-item">
                      <span>
                        <Image src={IconHeart} alt="wishlist" />
                        <span className="badge bg-success rounded-circle">
                          3
                        </span>
                        Wishlist
                      </span>
                    </li>
                    <li className="list-inline-item">
                      <span>
                        <Link href={"/cart"}>
                          <Image src={IconCart} alt="cart" />
                          <span className="badge bg-success rounded-circle">
                            {context.cartItems.length}
                          </span>
                          Cart
                        </Link>
                      </span>
                    </li>
                    {context.isLogin ? (
                      <li className="list-inline-item">
                        <span
                          onClick={() => setIsOpenDropDown(!isOpenDropDown)}
                        >
                          <Image src={IconUser} alt="account" />
                          Account
                        </span>
                        {isOpenDropDown && (
                          <ul className="dropdownMenu">
                            <li>
                              <Button className="align-items-center">
                                <Person2OutlinedIcon /> My Account
                              </Button>
                            </li>
                            <li>
                              <Button>
                                <LocationOnOutlinedIcon /> Order Tracking
                              </Button>
                            </li>
                            <li>
                              <Button>
                                <FavoriteBorderOutlinedIcon /> My Wishlist
                              </Button>
                            </li>
                            <li>
                              <Button>
                                <SettingsOutlinedIcon /> Setting
                              </Button>
                            </li>
                            <li>
                              <Button onClick={signOut}>
                                <LogoutOutlinedIcon /> Sign out
                              </Button>
                            </li>
                          </ul>
                        )}
                      </li>
                    ) : (
                      <li className="list-inline-item">
                        <Link href={"/signIn"}>
                          <Button className="btn btn-g">Sign In</Button>
                        </Link>
                      </li>
                    )}
                  </ul>
                </ClickAwayListener>
              </div>
            </div>
          </div>
        </div>

        {catData.length !== 0 && (
          <Nav data={catData} openNav={isOpenNav} closeNav={closeNav} />
        )}
      </header>
      <div className="afterHeader"></div>
      {isOpenAccDropDown && (
        <>
          <div className="navbarOverlay" onClick={closeNav}></div>
          <ul className="dropdownMenu dropdownMenuAcc" onClick={closeNav}>
            <li>
              <Button className="align-items-center">
                <Link href="#">
                  <Person2OutlinedIcon /> My Account
                </Link>
              </Button>
            </li>
            <li>
              <Button className="align-items-center">
                <Link href="#">
                  {" "}
                  <Image src={IconCompare} alt="compare" />
                  Compare
                </Link>
              </Button>
            </li>
            <li>
              <Button className="align-items-center">
                <Link href="#">
                  {" "}
                  <Image src={IconCart} alt="cart" />
                  Cart
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link href="#">
                  <LocationOnOutlinedIcon /> Order Tracking
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link href="#">
                  <FavoriteBorderOutlinedIcon /> My Wishlist
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link href="#">
                  <SettingsOutlinedIcon /> Setting
                </Link>
              </Button>
            </li>
            <li>
              <Button onClick={signOut}>
                <Link href="#">
                  <LogoutOutlinedIcon /> Sign out
                </Link>
              </Button>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default Header;
