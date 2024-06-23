"use client";

import React, { useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import bannerImg from "../../assets/images/banner1.jpg";
import { useParams } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import MyContext from "@/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import { fetchDataFormApi } from "@/Utils/utils";

function valuetext(value) {
  return `${value}°C`;
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Sidebar = (props) => {
  const [value, setValue] = useState([100, 60000]);
  const [value2, setValue2] = useState(0);
  const [brandFilters, setBrandFilters] = useState([]);
  const [ratingsArr, setRatings] = useState([]);
  const [totalLength, setTotalLength] = useState([]);
  const [catData, setCatData] = useState([]);
  const [categories, setCategories] = useState([]);

  const context = useContext(MyContext);

  let { id } = useParams();

  useEffect(() => {
    getCatData();
    window.scrollTo(0, 0);
  }, []);

  const getCatData = async () => {
    fetchDataFormApi("/api/categories?populate=*").then((res) => {
      setCatData(res.data);
      const cat = [];
      {
        res.data !== undefined &&
          res.data.length !== 0 &&
          res.data.map((item, index) => {
            cat.push(item);
          });
      }

      const list = cat.filter((item, index) => {
        return cat.indexOf(item) === index;
      });

      setCategories(list);
    });
  };

  var brands = [];
  var ratings = [];

  var catLength = 0;
  var lengthArr = [];
  useEffect(() => {
    catData.length !== 0 &&
      catData.map((item, index) => {
        catLength += item.attributes.products.data.length;
        lengthArr.push(catLength);
        catLength = 0;
      });

    const list = lengthArr.filter(
      (item, index) => lengthArr.indexOf(item) === index
    );
    setTotalLength(list);
  }, [catData]);

  useEffect(() => {
    brands = [];
    ratings = [];
    props.data.length !== 0 &&
      props.data.map((item) => {
        brands.push(item.attributes.brand);
        ratings.push(parseFloat(item.attributes.rating));
      });

    const brandList = brands.filter(
      (item, index) => brands.indexOf(item) === index
    );
    setBrandFilters(brandList);

    const ratings_ = ratings.filter(
      (item, index) => ratings.indexOf(item) === index
    );
    setRatings(ratings_);
  }, [id]);

  const filterByBrand = (keyword) => {
    props.filterByBrand(keyword);
  };

  const filterByRating = (keyword) => {
    props.filterByRating(parseFloat(keyword));
  };

  const changeValue = (val) => {
    setValue(val);
    props.filterByPrice(val[0], val[1]);
  };

  return (
    <>
      <div className={`sidebar ${context.isOpenFilters === true && "open"}`}>
        <div className="card border-0 shadow res-hide">
          <h3>Category</h3>
          <div className="catList">
            {categories.length !== 0 &&
              categories.map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={`/category/${item.attributes.title.toLowerCase()}`}
                  >
                    <div className="catItem d-flex align-items-center">
                      <span className="img">
                        <img
                          src={`http://localhost:1337${item.attributes.img.data.attributes.url}`}
                          width={30}
                          //   height={30}
                        />
                      </span>
                      <h4 className="mb-0 ml-3 mr-3 text-capitalize">
                        {item.attributes.title}
                      </h4>
                      <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
                        {totalLength[index]}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="card border-0 shadow">
          <h3>Fill by price</h3>

          <RangeSlider
            value={value}
            onInput={changeValue}
            min={100}
            max={60000}
            step={5}
          />

          <div className="d-flex pt-2 pb-2 priceRange">
            <span>
              From: <strong className="text-success">Rs: {value[0]}</strong>
            </span>
            <span className="ml-auto">
              From: <strong className="text-success">Rs: {value[1]}</strong>
            </span>
          </div>

          <div className="filters pt-5">
            <h5>Filter By Brand</h5>

            <ul className="mb-0">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {brandFilters.length !== 0 &&
                  brandFilters.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByBrand(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="filters pt-0">
            <h5>Filter By Ratings</h5>
            <ul>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {ratingsArr.length !== 0 &&
                  ratingsArr.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByRating(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="d-flex filterWrapper">
            <Button
              className="btn btn-g w-100"
              onClick={() => context.openFilters()}
            >
              <FilterAltOutlinedIcon /> Filter
            </Button>
          </div>
        </div>

        <Image alt="banner" src={bannerImg} className="w-100" />
      </div>
    </>
  );
};

export default Sidebar;
