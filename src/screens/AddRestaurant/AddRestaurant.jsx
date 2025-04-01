import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import AppwriteResService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom';
import { restaurants } from '../../store/restSlice';
import axios from 'axios';
import Pricing from '../../components/Pricing/Pricing';

const AddRestaurant = ({ restaurant }) => {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    description: restaurant?.description || '',
  });
  const [img, setImg] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 2px #ff6b6b",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 1px #ddd",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 5px 15px rgba(211, 47, 47, 0.3)"
    },
    tap: { scale: 0.98 },
    disabled: {
      opacity: 0.7,
      cursor: "not-allowed"
    }
  };

  // Update form data if restaurant prop changes
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        description: restaurant.description || '',
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const setimgfile = (e) => {
    setImg(e.target.files[0])
  }

  const navigate = useNavigate()
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setFormError('');
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (formError || formSuccess) {
      const timer = setTimeout(() => {
        setFormError('');
        setFormSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formError, formSuccess]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Check form validity
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      if (restaurant) {
        // Update existing restaurant
        const file = img ? await AppwriteResService.uploadFile(img) : null
        if (file) {
          AppwriteResService.deleteFile(restaurant.image)
        }
        const dbRest = await AppwriteResService.updateDetail(restaurant.$id, {
          ...formData,
          image: file ? file.$id : undefined
        })
        if (dbRest) {
          setFormSuccess('Restaurant updated successfully!');
          setTimeout(() => {
            navigate(`/restaurant/${restaurant.$id}`);
          }, 1500);
        }
      } else {
        // Create new restaurant
        if (!selectedPlan) {
          setFormError('Please select a subscription plan');
          setIsSubmitting(false);
          return;
        }

        setFormSuccess('Processing payment...');
        try {
          console.log(selectedPlan)
          const response = await axios.post('https://67b5a11ac39fc1a21470.appwrite.global/create_order', {
            amount: 1,
            currency: 'INR',
            receipt: 'receipt#1',
            notes: [
              `plan:${selectedPlan.plan}`,
              `billingCycle:${selectedPlan.billingCycle}`
            ],
          });

          const order = await response.data;
          console.log('Order created successfully:', order);

          const options = {
            key: 'rzp_test_SKvWaxTYYZYvIC',
            amount: order.amount,
            currency: order.currency,
            name: 'AlQaim Developers',
            description: `${selectedPlan.plan.charAt(0).toUpperCase() + selectedPlan.plan.slice(1)} Plan - ${selectedPlan.billingCycle}`,
            order_id: order.id,
            callback_url: 'http://localhost:5174/payment-success',
            prefill: {
              name: 'Safi Hyder',
              email: 'safihaider0987@gmail.com',
              contact: '+91-7889365127'
            },
            theme: {
              color: '#F37254'
            },
            handler: async function (response) {
              try {
                setFormSuccess('Verifying payment...');

                const verificationResult = await axios.post('https://67b5a11ac39fc1a21470.appwrite.global/verify-payment', {
                  razorpay_order_id: order.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verificationResult.data.status === 'success') {
                  setFormSuccess('Payment verified! Creating restaurant...');
                  try {
                    const file = await AppwriteResService.uploadFile(img);
                    if (file) {
                      const fileId = file.$id;
                      formData.image = fileId;
                    }
                    const session = await AppwriteResService.AddRestaurant({
                      ...formData,
                      userId: userData.$id,
                      subscriptionPlan: selectedPlan.plan,
                      billingCycle: selectedPlan.billingCycle
                    });

                    const dbPost = await AppwriteResService.getRestaurant(session.$id);
                    if (dbPost) {
                      dispatch(restaurants({ restaurant: dbPost }));
                      setFormSuccess('Restaurant created successfully!');
                      setTimeout(() => {
                        navigate(`/restaurant/${dbPost.$id}`);
                      }, 1500);
                    }
                  } catch (error) {
                    console.error('Error creating restaurant:', error);
                    setFormError('Payment was successful but there was an error creating your restaurant. Please contact support.');
                    setIsSubmitting(false);
                  }
                } else {
                  setFormError('Payment verification failed. Please try again.');
                  setIsSubmitting(false);
                }
              } catch (error) {
                console.error('Payment verification error:', error.response?.data || error.message);
                setFormError('Error verifying payment. Please try again or contact support.');
                setIsSubmitting(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();

          // Reset submission state when Razorpay modal is closed
          rzp.on('payment.failed', function () {
            setFormError('Payment failed. Please try again.');
            setIsSubmitting(false);
          });

          rzp.on('modal.closed', function () {
            setIsSubmitting(false);
          });
        } catch (error) {
          console.error('Error creating Razorpay order:', error);
          setFormError('Error processing payment. Please try again.');
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-orange-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
        <motion.div
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-8 py-6">
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img src="/Images/logo.png" alt="" className="h-16 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                {restaurant ? 'Update Restaurant' : 'Add Your Restaurant'}
              </h2>
            </motion.div>

            <AnimatePresence>
              {(formError || formSuccess) && (
                <motion.div
                  className={`mb-6 p-4 rounded-lg text-center ${formError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {formError || formSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <motion.label
                  htmlFor="name"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'name' ? '#d32f2f' : '#374151' }}
                >
                  Restaurant Name
                </motion.label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  variants={inputVariants}
                  animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                />
              </div>

              <div>
                <motion.label
                  htmlFor="address"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'address' ? '#d32f2f' : '#374151' }}
                >
                  Restaurant Full Address
                </motion.label>
                <motion.input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  variants={inputVariants}
                  animate={focusedField === 'address' ? 'focused' : 'unfocused'}
                />
              </div>

              <div>
                <motion.label
                  htmlFor="description"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'description' ? '#d32f2f' : '#374151' }}
                >
                  Restaurant Description
                </motion.label>
                <motion.textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  variants={inputVariants}
                  animate={focusedField === 'description' ? 'focused' : 'unfocused'}
                />
              </div>

              <div>
                <motion.label
                  htmlFor="image"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'image' ? '#d32f2f' : '#374151' }}
                >
                  Restaurant Image
                </motion.label>
                <motion.input
                  type="file"
                  id="image"
                  name="image"
                  onChange={setimgfile}
                  required={!restaurant}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  onFocus={() => setFocusedField('image')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </form>
          </div>
        </motion.div>

        {!restaurant && (
          <div className="w-full max-w-xl">
            <Pricing
              onSelectPlan={handlePlanSelect}
              initialPlan={selectedPlan ? selectedPlan.plan : null}
            />
          </div>
        )}

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isSubmitting ? "disabled" : ""}
          >
            {isSubmitting ? (
              <>
                <motion.svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </motion.svg>
                <span>{restaurant ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              restaurant ? "Update Restaurant" : "Add Restaurant"
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
AddRestaurant.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    $id: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default AddRestaurant;