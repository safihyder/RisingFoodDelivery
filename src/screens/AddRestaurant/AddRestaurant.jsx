import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './AddRestaurant.css';
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
    <>
      <div className="addrestaurant">
        <div className="add-restaurant-form-container">
          <h2><img src="/Images/logo.png" alt="" />Add Your Restaurant</h2>

          {formError && <div className="form-message error">{formError}</div>}
          {formSuccess && <div className="form-message success">{formSuccess}</div>}

          <form ref={formRef} onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
            <div className="input-group">
              <label htmlFor="name">Restaurant Name</label>
              <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} required />
            </div>
            <div className="input-group">
              <label htmlFor="address">Restaurant Full Address</label>
              <input type="text" id="address" name="address" onChange={handleChange} value={formData.address} required />
            </div>
            <div className="input-group">
              <label htmlFor="description">Restaurant Description</label>
              <textarea cols={10} rows={4} type="text" id="description" name="description" onChange={handleChange} value={formData.description} required />
            </div>
            <div className="input-group">
              <label htmlFor="image">Restaurant Image</label>
              <input type="file" id="image" name="image" onChange={setimgfile} required={!restaurant} />
            </div>
          </form>
        </div>

        {!restaurant && <Pricing
          onSelectPlan={handlePlanSelect}
          initialPlan={selectedPlan ? selectedPlan.plan : null}
        />}

        <div className="submit-button-container">
          <button
            type="button"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                <span className="sr-only">{restaurant ? "Updating..." : "Adding..."}</span>
              </>
            ) : restaurant ? "Update Restaurant" : "Add Restaurant"}
          </button>
        </div>
      </div>
    </>
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