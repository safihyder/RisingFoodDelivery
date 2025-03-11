import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./MultiCarousel.css";
import PropTypes from "prop-types";
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
    breakpoint: { max: 767, min: 300 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const MultiCarousel = ({ title, items, url }) => {
  console.log(items)
  return (
    <div className="parent">
      <h1 className="mb-5 text-2xl font-bold">{title}</h1>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {items ? items.map((item, index) => {
          return (
            <Link key={index} to={`${url}/${item.$id}`}>
              <div className="slider  shadow-card" key={index}>
                <img src={item.image} alt="item" loading="lazy" />
                <div className="label">
                  <h2 className="text-2xl font-bold">{(item.name).length > 20 ? (item.name).slice(0, 20) + "..." : item.name}</h2>
                  <p>{(item.description).length > 70 ? (item.description).slice(0, 70) + "..." : item.description}</p>
                </div>
              </div>
            </Link>
          )
        })
          : <div />
        }
      </Carousel>
    </div>
  );
};
MultiCarousel.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  }))
};

export default MultiCarousel;
