import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, updateOrder } from '../../store/orderSlice';
import { motion } from 'framer-motion';

const Card = ({ item, image }) => {
  const options = {
    Half: 100,
    Full: 200
  };

  const dispatch = useDispatch();
  const [size, setSize] = useState('Half');
  const [qty, setQty] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const foodData = useSelector(state => state.order.userorder);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
  };

  const handleAddToCart = () => {
    let food = foodData.find(foodItem => foodItem.id === item.$id);

    if (food) {
      if (food.size === size) {
        dispatch(updateOrder({ id: item.$id, qty: qty, price: finalPrice }));
      } else {
        dispatch(addOrder({
          id: item.$id,
          name: item.name,
          size: size,
          qty: qty,
          price: finalPrice,
          img: item.image
        }));
      }
    } else {
      dispatch(addOrder({
        id: item.$id,
        name: item.name,
        size: size,
        qty: qty,
        price: finalPrice,
        img: item.image
      }));
    }

    // Show added to cart state
    setIsAddedToCart(true);

    // Reset button state after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const finalPrice = options[size] * qty;

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs mx-auto h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="relative pb-[56.25%] bg-gray-100 overflow-hidden">
          <img
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
            src={image || item.image}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x225?text=Image+Not+Available";
              setImageError(true);
            }}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60">
              <span className="text-sm text-gray-500">Image not available</span>
            </div>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
          ₹{finalPrice}/-
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{item.description || "No description available"}</p>

        <div className="space-y-3 mt-auto">
          {/* Size selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <div className="flex space-x-2">
              {Object.keys(options).map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => handleSizeChange(sizeOption)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${size === sizeOption
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={() => qty > 1 && handleQtyChange(qty - 1)}
              >
                -
              </button>
              <span className="px-3 py-1 text-center min-w-[30px]">{qty}</span>
              <button
                className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={() => handleQtyChange(qty + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddedToCart}
          className={`mt-4 w-full py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isAddedToCart
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
            } text-white`}
        >
          {isAddedToCart ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Card;