"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import Product from "@/component/product";
import Sidebar from "@/component/Sidebar";
import Link from "next/link";
import MyContext from "@/context/ThemeContext";
import { fetchDataFormApi } from "@/Utils/utils";
import { Category } from "@mui/icons-material";
import Loading from "@/component/Loading";

const Search = ({ params }) => {
  const [isOpenDropDown, setisOpenDropDown] = useState(false);
  const [isOpenDropDown2, setisOpenDropDown2] = useState(false);
  const [showPerPage, setHhowPerPage] = useState(3);
  const [productsData, setProductsData] = useState([]);
  const [data, setData] = useState([]);
  const context = useContext(MyContext);
  const [currentId, setCurrentId] = useState();
  var itemsData = [];

    useEffect(() => {
        setData(context.searchData);
    }, []);

  useEffect(() => {
    setProductsData(context.searchData);
  }, [context.searchData]);

  //   useEffect(() => {
  //     getProductData(`/api/products?populate=*&[filters][sub_cats][id]=${encodeURIComponent(
  //             params.subcatId
  //           )}`);
  //   }, []);

  //   const getProductData = async (url) => {
  //     fetchDataFormApi(
  //       url
  //         ? url
  //         : `/api/products?populate=*`
  //     ).then((res) => {
  //     const uniqueArray = res.data.filter((item) => item.id !== parseInt(params.subcatId));
  //       setProductsData(uniqueArray);
  //     });
  //   };

  const filterByBrand = (keyword) => {
    console.log(keyword);

    context.getSearchData(`/api/products?populate=*&filters[name][contains]=${context.searchValue}&[filters][brand]=${encodeURIComponent(keyword)}`)

    // fetchDataFormApi(
    //   `/api/products?populate=*&filters[name][contains]=${context.searchValue}&[filters][brand]=${encodeURIComponent(keyword)}`
    // ).then((res) => {
    //   context.setSearchData(res.data);
    // });
  };

  const filterByPrice = (minValue, maxValue) => {
    console.log(minValue, maxValue, context.searchValue, "searchValue");
    context.getSearchData(`/api/products?populate=*&filters[name][contains]=${context.searchValue}&[filters][price][$gte]=${minValue}&[filters][price][$lte]=${maxValue}`)
    // fetchDataFormApi(
    //   `/api/products?populate=*&filters[name][contains]=${context.searchValue}&[filters][price][$gte]=${minValue}&[filters][price][$lte]=${maxValue}`
    // ).then((res) => {
    //   context.setSearchData(res.data);
    // });
  };

  const filterByRating = (keyword) => {
    console.log(keyword, context.searchValue, "searchValue");
    // fetchDataFormApi(
    //   `/api/products?populate=*&[filters][rating]=${keyword}&filters[name][contains]=${context.searchValue}`
    // ).then((res) => {
    //   context.setSearchData(res.data);
    // });
    context.getSearchData(`/api/products?populate=*&[filters][rating]=${keyword}&filters[name][contains]=${context.searchValue}`)
  };

  //   if (productsData.length === 0) {
  //     return <Loading />;
  //   }

  return (
    <>
      {context.windowWidth < 992 && (
        <>
          {context.isopenNavigation === false && (
            <Button
              className="btn-g btn-lg w-100 filterBtn"
              onClick={() => context.openFilters()}
            >
              Filters
            </Button>
          )}
        </>
      )}

      <section className="listingPage">
        <div className="container-fluid">
          {
            <div className="breadcrumb flex-column">
              <h1 className="text-capitalize">
                {sessionStorage.getItem("subCat").split("-").join(" ")}
              </h1>
              <ul className="list list-inline mb-0">
                <li className="list-inline-item">
                  <Link href={"/"}>Home </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    href={`/category/${sessionStorage.getItem("cat")}`}
                    className="text-capitalize"
                  >
                    {sessionStorage.getItem("cat")}{" "}
                  </Link>
                </li>
                {params.categoryId === "subcat" && (
                  <li className="list-inline-item">
                    <Link href={""} class="text-capitalize">
                      {sessionStorage.getItem("subCat").split("-").join(" ")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          }

          <div className="listingData">
            <div className="row">
              <div
                className={`col-md-3 sidebarWrapper ${
                  context.isOpenFilters === true && "click"
                }`}
              >
                {productsData.length !== 0 && (
                  <Sidebar
                    data={data}
                    // catData={catData}
                    // currentCatData={categories}
                    filterByBrand={filterByBrand}
                    filterByPrice={filterByPrice}
                    filterByRating={filterByRating}
                  />
                )}
              </div>

              <div className="col-md-9 rightContent homeProducts pt-0">
                <div className="topStrip d-flex align-items-center">
                  <p className="mb-0">
                    We found{" "}
                    <span className="text-success">{productsData.length}</span>{" "}
                    items for you!
                  </p>
                  <div className="ml-auto d-flex align-items-center">
                    <div className="tab_ position-relative">
                      <Button
                        className="btn_"
                        onClick={() => setisOpenDropDown(!isOpenDropDown)}
                      >
                        <GridViewOutlinedIcon /> Show: {showPerPage * 5}
                      </Button>
                      {isOpenDropDown !== false && (
                        <ul className="dropdownMenu">
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(1);
                              }}
                            >
                              5
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(2);
                              }}
                            >
                              10
                            </Button>
                          </li>

                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(3);
                              }}
                            >
                              15
                            </Button>
                          </li>

                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(4);
                              }}
                            >
                              20
                            </Button>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div className="tab_ ml-3 position-relative">
                      <Button
                        className="btn_"
                        onClick={() => setisOpenDropDown2(!isOpenDropDown2)}
                      >
                        <FilterListOutlinedIcon /> Sort by: Featured{" "}
                      </Button>
                      {isOpenDropDown2 !== false && (
                        <ul className="dropdownMenu">
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              Featured
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Price: Low to High
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Price: High to Low
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Release Date
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Avg. Rating
                            </Button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="productRow pl-4 pr-3">
                  {productsData.length !== 0 &&
                    productsData.map((item, index) => {
                      return (
                        <div className="item" key={index}>
                          <Product tag={item.type} item={item} />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
