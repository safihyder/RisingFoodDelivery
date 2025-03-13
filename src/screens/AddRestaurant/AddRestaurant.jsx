import { useState } from 'react';
import PropTypes from 'prop-types';
import './AddRestaurant.css';
import { useDispatch, useSelector } from 'react-redux';
import AppwriteResService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom';
import { restaurants } from '../../store/restSlice';
import axios from 'axios';
const AddRestaurant = ({ restaurant }) => {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)
  const [formData, setFormData] = useState({
    name: restaurant?.name,
    address: restaurant?.address || '',
    description: restaurant?.description || '',
  });
  const [img, setImg] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(value)
  };
  const setimgfile = (e) => {
    setImg(e.target.files[0])
    console.log(img)
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
    if (restaurant) {
      console.log(restaurant)
      const file = img ? await AppwriteResService.uploadFile(img) : null
      if (file) {
        AppwriteResService.deleteFile(restaurant.image)
      }
      const dbRest = await AppwriteResService.updateDetail(restaurant.$id, {
        ...formData,
        image: file ? file.$id : undefined
      })
      if (dbRest) {
        navigate(`/restaurant/${restaurant.$id}`)
      }
    } else {
      //Creation of order
      const response = await axios.post('https://67b5a11ac39fc1a21470.appwrite.global/create_order', {
        amount: 2000,
        currency: 'INR',
        receipt: 'receipt#1',
        notes: {},
      })
      const order = await response.data;
      console.log(order)
      const options = {
        key: 'rzp_test_SKvWaxTYYZYvIC', // Replace with your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: 'http://localhost:5174/payment-success', // Your success URL
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
            const verificationResult = await axios.post('https://67b5a11ac39fc1a21470.appwrite.global/verify-payment', {
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult.data.status === 'success') {
              alert('Payment verified successfully');
              // Only proceed with restaurant creation after successful payment
              try {
                const file = await AppwriteResService.uploadFile(img);
                if (file) {
                  const fileId = file.$id;
                  formData.image = fileId;
                }
                const session = await AppwriteResService.AddRestaurant({ ...formData, userId: userData.$id });
                console.log('Restaurant creation session:', session);
                const dbPost = await AppwriteResService.getRestaurant(session.$id);
                if (dbPost) {
                  dispatch(restaurants({ restaurant: dbPost }));
                  navigate(`/restaurant/${dbPost.$id}`);
                }
              } catch (error) {
                console.error('Error creating restaurant:', error);
                alert('Payment was successful but there was an error creating your restaurant. Please contact support.');
              }
            } else {
              alert('Payment verification failed. Please try again.');
            }
          } catch (error) {
            console.error('Payment verification error:', error.response?.data || error.message);
            alert('Error verifying payment. Please try again or contact support.');
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  }
  return (
    <>
      <div className="addrestaurant">
        <div className="add-restaurant-form-container">
          <h2><img src="/Images/logo.png" alt="" />Add Your Restaurant</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* ... your input fields (name, cuisine, address, phoneNumber, website, description) ... */}

            <div className="input-group">
              <label htmlFor="name">Restaurant Name</label>
              <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} />
            </div>
            <div className="input-group">
              <label htmlFor="address">Restaurant Full Address</label>
              <input type="text" id="address" name="address" onChange={handleChange} value={formData.address} />
            </div>
            <div className="input-group">
              <label htmlFor="description">Restaurant Description</label>
              <textarea cols={10} rows={5} type="text" id="description" name="description" onChange={handleChange} value={formData.description} />
            </div>
            <div className="input-group">
              <label htmlFor="image">Restaurant Image</label>
              <input type="file" id="image" name="image" onChange={setimgfile} />
            </div>
            <button type="submit">{restaurant ? "Update Restaurant" : "Add Restaurant"}</button>
          </form>
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
// export default AddRestaurant;
export default AddRestaurant;