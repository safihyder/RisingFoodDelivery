import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";

const responsive = {
  desktop: {
    breakpoint: { max: 1536, min: 1024 },
    items: 4,
    slidesToSlide: 2
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 767, min: 640 },
    items: 2,
    slidesToSlide: 1
  },
  smallMobile: {
    breakpoint: { max: 639, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

// Custom arrow component prop types
const CustomArrowPropTypes = {
  onClick: PropTypes.func
};

// Custom dot component prop types
const CustomDotPropTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool
};

const MultiCarousel = ({ title, items, url }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Custom arrow components
  const CustomRightArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute right-0 -mr-4 z-10 p-1 md:p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 focus:outline-none"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };

  CustomRightArrow.propTypes = CustomArrowPropTypes;

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-0 -ml-4 z-10 p-1 md:p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };

  CustomLeftArrow.propTypes = CustomArrowPropTypes;

  // Custom dot component
  const CustomDot = ({ onClick, active }) => {
    return (
      <button
        className={`mx-1 h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${active ? "bg-red-600 w-4 md:w-6" : "bg-gray-300"
          }`}
        onClick={onClick}
      />
    );
  };

  CustomDot.propTypes = CustomDotPropTypes;

  return (
    <div className="px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative">
          {title}
          <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-red-600 to-orange-500"></span>
        </h2>
        <Link to={url} className="text-red-600 hover:text-red-700 font-medium flex items-center transition-colors">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {items && items.length > 0 ? (
        <Carousel
          responsive={responsive}
          swipeable={true}
          draggable={true}
          // showDots={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="transform 500ms ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["smallMobile"]}
          dotListClass="custom-dot-list-style flex justify-center mt-6"
          itemClass="px-2 md:px-3 h-full"
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          renderDotsOutside={true}
          customDot={<CustomDot />}
        >
          {items.map((item, index) => (
            <div key={index} className="h-full">
              <Link
                to={`${url}/${item.$id}`}
                className="block h-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 h-full ${hoveredIndex === index ? "transform scale-[1.03]" : ""
                    }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative pb-[60%] bg-gray-200 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                      }}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white h-1/2 transition-all duration-300">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className={`text-sm text-gray-200 transition-all duration-300 ${hoveredIndex === index ? "opacity-100 line-clamp-2" : "opacity-70 line-clamp-1"
                          }`}>
                          {item.description || "No description available"}
                        </p>
                      </div>
                      <div className={`mt-2 inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full transition-all duration-300 w-fit ${hoveredIndex === index
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-4"
                        }`}>
                        View Details
                      </div>
                    </div>
                  </div>
                  {item.price && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
                      ₹{item.price}
                    </div>
                  )}
                </motion.div>
              </Link>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <p className="mt-2 text-gray-500">No items available</p>
          </div>
        </div>
      )}
    </div>
  );
};

MultiCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  url: PropTypes.string.isRequired
};

export default MultiCarousel;
