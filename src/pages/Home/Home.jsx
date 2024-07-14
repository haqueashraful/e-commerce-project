"use client";

import React, { useState, useEffect, useRef, useContext } from "react";

import "./style.css";
import Banner4 from "../../assets/images/banner4.jpg";

import Slider from "react-slick";
import axios from "axios";
import Image from "next/image";
import MyContext from "@/context/ThemeContext";
import HomeSlider from "./slider";
import TopProducts from "./TopProducts";
import { fetchDataFormApi } from "@/Utils/utils";
import Product from "@/component/product";
import Banners from "@/component/banners";
import CatSlider from "@/component/catSlider";
import Loading from "@/component/Loading";
import Link from "next/link";

const HomePage = () => {
  const [prodData, setProdData] = useState([]);
  const [catArray, setCatArray] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeTabData, setActiveTabData] = useState([]);
  const [bestSells, setBestSells] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const productRow = useRef();
  const context = useContext(MyContext);

  var settings = {
    dots: false,
    infinite: context.windowWidth < 992 ? false : true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth < 992 ? false : true,
  };

  useEffect(() => {
    getData("/api/categories?populate=*");
    getBestSeller();
    window.scrollTo(0, 0);
  }, []);


  const getData = (url) => {
    fetchDataFormApi(url).then((res) => {
      setProdData(res.data);
    });
  };

  const getBestSeller = () => {
    fetchDataFormApi(`/api/products?populate=*&filters[sub_cats][title]=${encodeURIComponent("Mobiles & Tablets")}`)
      .then((res) => {
        setBestSells(res.data);
        setIsLoadingProducts(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const catArr = [];

  useEffect(() => {
    prodData.length !== 0 &&
      prodData.map((item) => {
        item.attributes.sub_cats.data.length !== 0 &&
          item.attributes.sub_cats.data.map((item_) => {
            catArr.push(item_.attributes.title);
          });
      });

    const list2 = catArr.filter(
      (item, index) => catArr.indexOf(item) === index
    );
    setCatArray(list2);
    setActiveTab(list2[0]);

    window.scrollTo(0, 0);
  }, [prodData]);

  useEffect(() => {
    filterDataBySubCat(activeTab);
  }, [activeTab]);

  const filterDataBySubCat = (subCat) => {
    const arr = [];
    fetchDataFormApi(
      `/api/products?populate=*&filters[sub_cats][title]=${encodeURIComponent(subCat)}`
    ).then((res) => {
      res.data.length !== 0 &&
        res.data.map((item) => {
          arr.push(item);
        });
      setActiveTabData(arr);

      setTimeout(() => {
        setIsLoadingProducts(false);
      }, 1000);
    });
  };

  // useEffect(() => {
  //   const arr = [];
  //   setActiveTabData(arr);
  //   prodData.length !== 0 &&
  //     prodData.map((item, index) => {
  //         console.log(item)
  //     //   item.items.map((item_, index_) => {
  //     //     if (item_.cat_name === activeTab) {
  //     //       {
  //     //         item_.products.length !== 0 &&
  //     //           item_.products.map((product) => {
  //     //             arr.push({
  //     //               ...product,
  //     //               parentCatName: item.cat_name,
  //     //               subCatName: item_.cat_name,
  //     //             });
  //     //           });

  //     //         setActiveTabData(arr);
  //     //         setTimeout(() => {
  //     //           setIsLoadingProducts(false);
  //     //         }, [1000]);
  //     //       }
  //     //     }
  //     //   });
  //     });
  // }, [prodData]);

  // const bestSellsArr = [];

  // useEffect(() => {
  //   prodData.length !== 0 &&
  //     prodData.map((item) => {
  //       console.log(item, "item");
  //       if (item.attributes.title === "electronics") {
  //         item.attributes.sub_cats.data.length !== 0 &&
  //           item.attributes.sub_cats.data.map((item_) => {
  //             console.log(item_, "item_");
  //             // item_.attributes.data.length !== 0 &&
  //             //   item_.attributes.data.map((product, index) => {
  //             //     console.log(product, "product");
  //             //     bestSellsArr.push(product);
  //             //   });
  //           });
  //       }
  //     });

  //   setBestSells(bestSellsArr);
  // }, [prodData]);


  return (
    <div style={{ display: "block" }}>
      <HomeSlider />

      {prodData.length !== 0 && prodData !== undefined && (
        <>
          <CatSlider data={prodData} />
          <Banners />

          {/* section start */}

          <section className="homeProducts homeProductWrapper">
            <div className="container-fluid">
              <div className="d-flex align-items-center homeProductsTitleWrap">
                <h2 className="hd mb-0 mt-0 res-full">Popular Products</h2>
                <ul className="list list-inline ml-auto filterTab mb-0 res-full">
                  {catArray.length !== 0 &&
                    catArray.map((cat, index) => {
                      return (
                        <li key={index} className="list list-inline-item">
                          <Link 
                          href={""}
                            // href={`/category/${cat}`}
                            className={`cursor text-capitalize 
                                                ${
                                                  activeTabIndex === index
                                                    ? "act"
                                                    : ""
                                                }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab(cat);
                              setActiveTabIndex(index);
                              // productRow.current.scrollLeft = 0;
                              setIsLoadingProducts(true);
                            }}
                          >
                            {cat}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div
                className={`productRow ${
                  isLoadingProducts === true && "loading"
                }`}
                ref={productRow}
              >
                {activeTabData.length !== 0 &&
                  activeTabData.map((item, index) => {
                    return (
                      <div className="item" key={index}>
                        <Product tag={item.type} item={item} />
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>

          <section className="homeProducts homeProductsRow2 pt-0">
            <div className="container-fluid">
              <div className="d-flex align-items-center">
                <h2 className="hd mb-0 mt-0">Daily Best Sells</h2>
              </div>

              <br className="res-hide" />
              <br className="res-hide" />
              <div className="row">
                <div className="col-md-3 pr-5 res-hide">
                  <Image alt="banner" src={Banner4} className="w-100" />
                </div>

                <div className="col-md-9">
                  <Slider {...settings} className="prodSlider">
                    {bestSells.length !== 0 &&
                      bestSells.map((item, index) => {
                        return (
                          <div className="item" key={index}>
                            <Product tag={item.type} item={item} />
                          </div>
                        );
                      })}
                  </Slider>
                </div>
              </div>
            </div>
          </section>

          <section className="topProductsSection">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <TopProducts title="Top Selling" />
                </div>

                <div className="col">
                  <TopProducts title="Trending Products" />
                </div>

                <div className="col">
                  <TopProducts title="Recently added" />
                </div>

                <div className="col">
                  <TopProducts title="Top Rated" />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* <Banners />

      <section className="homeProducts homeProductWrapper">
        <div className="container-fluid">
          <div className="d-flex align-items-center homeProductsTitleWrap">
            <h2 className="hd mb-0 mt-0 res-full">Popular Products</h2>
            <ul className="list list-inline ml-auto filterTab mb-0 res-full">
              {catArray.length !== 0 &&
                catArray.map((cat, index) => {
                  return (
                    <li className="list list-inline-item">
                      <a
                        className={`cursor text-capitalize 
                                                ${
                                                  activeTabIndex === index
                                                    ? "act"
                                                    : ""
                                                }`}
                        onClick={() => {
                          setActiveTab(cat);
                          setActiveTabIndex(index);
                          productRow.current.scrollLeft = 0;
                          setIsLoadingProducts(true);
                        }}
                      >
                        {cat}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>

          <div
            className={`productRow ${isLoadingProducts === true && "loading"}`}
            ref={productRow}
          >
            {activeTabData.length !== 0 &&
              activeTabData.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <Product tag={item.type} item={item} />
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <section className="homeProducts homeProductsRow2 pt-0">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <h2 className="hd mb-0 mt-0">Daily Best Sells</h2>
          </div>

          <br className="res-hide" />
          <br className="res-hide" />
          <div className="row">
            <div className="col-md-3 pr-5 res-hide">
              <Image src={Banner4} className="w-100" />
            </div>

            <div className="col-md-9">
              <Slider {...settings} className="prodSlider">
                {bestSells.length !== 0 &&
                  bestSells.map((item, index) => {
                    return (
                      <div className="item" key={index}>
                        <Product tag={item.type} item={item} />
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      <section className="topProductsSection">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <TopProducts title="Top Selling" />
            </div>

            <div className="col">
              <TopProducts title="Trending Products" />
            </div>

            <div className="col">
              <TopProducts title="Recently added" />
            </div>

            <div className="col">
              <TopProducts title="Top Rated" />
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
