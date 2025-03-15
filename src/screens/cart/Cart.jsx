import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { removeOrder, dropOrders } from "../../store/orderSlice";
import AppwriteOrderService from '../../appwrite/orderconfig';
import { Query } from "appwrite";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const dispatch = useDispatch();
  const [dbData, setDbData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [deleteAnimation, setDeleteAnimation] = useState({ index: null, animate: false });

  const foodData = useSelector(state => state.order.userorder);
  const userEmail = useSelector(state => state.auth.userData.email);
  const totalPrice = foodData.reduce((total, food) => total + food.price, 0);

  useEffect(() => {
    AppwriteOrderService.getOrders([Query.equal("email", userEmail)]).then((data) => {
      setDbData(data?.documents[0]);
    });
  }, [userEmail]);

  const handleDelete = (index) => {
    setDeleteAnimation({ index, animate: true });

    // Delay the actual deletion to allow animation to complete
    setTimeout(() => {
      dispatch(removeOrder(index));
      setDeleteAnimation({ index: null, animate: false });
    }, 300);
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (dbData) {
        const dborderdata = dbData?.orderdata;
        const updatedData = await AppwriteOrderService.updateOrder(dbData?.$id, {
          orderdata: dborderdata,
          newdata: foodData
        });

        if (updatedData) {
          dispatch(dropOrders());
          setShowConfirmation(true);
        }
      } else {
        const dbOrder = await AppwriteOrderService.AddOrder({
          email: userEmail,
          orderdata: foodData
        });

        if (dbOrder) {
          dispatch(dropOrders());
          setShowConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: {
      x: -300,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  if (foodData.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="mb-6"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-300 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
          <motion.button
            className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-white mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Cart
      </motion.h1>

      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-orange-500">
              <tr>
                <th className="py-4 px-6 text-left">#</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Quantity</th>
                <th className="py-4 px-6 text-left">Option</th>
                <th className="py-4 px-6 text-left">Amount</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {foodData.map((food, index) => (
                  <motion.tr
                    key={index}
                    className={`border-b border-gray-700 ${hoveredRow === index ? 'bg-gray-700' : ''}`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    variants={itemVariants}
                    initial="hidden"
                    animate={deleteAnimation.index === index && deleteAnimation.animate ? "exit" : "visible"}
                    exit="exit"
                    layout
                  >
                    <td className="py-4 px-6 text-white">{index + 1}</td>
                    <td className="py-4 px-6 text-white font-medium">{food.name}</td>
                    <td className="py-4 px-6 text-white">{food.qty}</td>
                    <td className="py-4 px-6 text-white">{food.size}</td>
                    <td className="py-4 px-6 text-white">₹{food.price}</td>
                    <td className="py-4 px-6 text-center">
                      <motion.button
                        className="p-2 rounded-full bg-red-500 bg-opacity-20 hover:bg-opacity-100 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon className="text-red-500" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl text-gray-300 mb-2">Order Summary</h2>
          <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-2">
            <span className="text-white">Total Items:</span>
            <span className="text-white font-medium">{foodData.length}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-white">Total Amount:</span>
            <motion.span
              className="text-2xl font-bold text-orange-500"
              key={totalPrice}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ₹{totalPrice}
            </motion.span>
          </div>
        </div>

        <motion.button
          className={`px-8 py-3 rounded-md text-white font-medium ${isProcessing
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            } transition-colors shadow-lg flex items-center gap-2`}
          whileHover={!isProcessing ? { scale: 1.05 } : {}}
          whileTap={!isProcessing ? { scale: 0.95 } : {}}
          onClick={handleCheckOut}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Checkout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-6">Your order has been placed successfully. You can track your order in the orders section.</p>
                <motion.button
                  className="w-full py-3 px-4 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowConfirmation(false);
                    window.location.href = '/';
                  }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart