import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, updateOrder } from '../../store/orderSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Card = ({ item, image, isManager }) => {
  const options = {
    Half: 100,
    Full: 200
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [size, setSize] = useState('Half');
  const [qty, setQty] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showDifferentRestaurantMessage, setShowDifferentRestaurantMessage] = useState(false);
  const foodData = useSelector(state => state.order.userorder);
  const userData = useSelector(state => state.auth.userData);
  // console.log(foodData[0]?.resid)
  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
  };
  const handleAddToCart = () => {
    if (!userData) {
      navigate('/loginuser');
      return;
    }

    let food = foodData.find(foodItem => foodItem.id === item.$id);

    // Check if cart is empty or if the item belongs to the same restaurant as items in cart
    if (foodData.length === 0 || foodData[0]?.resid === item.resid) {
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
            img: item.image,
            resid: item.resid
          }));
        }
      } else {
        dispatch(addOrder({
          id: item.$id,
          name: item.name,
          size: size,
          qty: qty,
          price: finalPrice,
          img: item.image,
          resid: item.resid
        }));
      }

      // Show added to cart state
      setIsAddedToCart(true);
      setShowDifferentRestaurantMessage(false);

      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);
    } else {
      // Show different restaurant message on the button
      setShowDifferentRestaurantMessage(true);

      // Reset the message after 3 seconds
      setTimeout(() => {
        setShowDifferentRestaurantMessage(false);
      }, 3000);
    }
  };

  const handleEditItem = () => {
    navigate(`/item/edit/${item.$id}`);
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
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%236b7280'%3EImage not available%3C/text%3E%3C/svg%3E";
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

        {!isManager && (
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
        )}

        {/* Action button */}
        <button
          onClick={isManager ? handleEditItem : handleAddToCart}
          disabled={!isManager && (isAddedToCart || showDifferentRestaurantMessage)}
          className={`mt-4 w-full py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isManager
            ? 'bg-blue-600 hover:bg-blue-700'
            : isAddedToCart
              ? 'bg-green-600 hover:bg-green-700'
              : showDifferentRestaurantMessage
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
        >
          {isManager ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>Edit Food Item</span>
            </>
          ) : isAddedToCart ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Added to Cart</span>
            </>
          ) : showDifferentRestaurantMessage ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Clear cart first</span>
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