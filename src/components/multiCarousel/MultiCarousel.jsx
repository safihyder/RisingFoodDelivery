import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./MultiCarousel.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const sliderImageUrl = [
  //First image url
  {
    url: "/Images/mc1.jpg",
    label: "Item 1"
  },
  {
    url:
      "/Images/mc2.jpg",
    label: "Item 2"
  },
  //Second image url
  {
    url:
      "/Images/mc3.jpg",
    label: "Item 3"
  },
  //Third image url
  {
    url:
      "/Images/mc4.jpg",
    label: "Item 4"
  },

  //Fourth image url

  {
    url:
      "/Images/mc5.jpg",
    label: "Item 5"
  }
];
const MultiCarousel = (props) => {
  return (
    <div className="parent">
      <h1>{props.title}</h1>
      <Link to="/selection">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        // showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {sliderImageUrl.map((imageUrl, index) => {
          return (
            <div className="slider" key={index}>
              <img src={imageUrl.url} alt="item" />
              <div className="label">
                <h2 >This is carousel label</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, non? Illo, veniam architecto.</p>
              </div>
            </div>
          );
        })}
      </Carousel>
      </Link>
    </div>
  );
};
export default MultiCarousel;
