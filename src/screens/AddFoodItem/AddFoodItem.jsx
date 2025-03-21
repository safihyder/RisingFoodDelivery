import { useState, useEffect } from 'react';
import './AddFoodItem.css';
import PropTypes from 'prop-types';
import AppwriteItemService from '../../appwrite/itemsconfig'
import AppwriteResService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
const AddFoodItem = ({ foodItem }) => {
  const userData = useSelector(state => state.auth.userData)
  const [restaurant, setrestaurant] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    AppwriteResService.getRestaurants([Query.contains('userId', userData.$id)])
      .then((data) => {
        if (data) {
          setrestaurant(data.documents[0])
        }
      })
  }, [userData])

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: foodItem?.name || '',
    description: foodItem?.description || '',
    price: foodItem?.price || 0,
    category: foodItem?.category || '',
    image: foodItem?.image || null,
    status: foodItem?.status || 'active',
    // File input for image upload
    // ... other relevant fields (e.g., dietary restrictions, ingredients)
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setFormError('');
    setFormSuccess('');

    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!formData.image && !foodItem) {
      setFormError('Please upload an image for the food item');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(formData);

      if (foodItem) {
        setFormSuccess('Updating food item...');
        const file = formData.image ? await AppwriteItemService.uploadFile(formData.image) : null
        if (file) {
          AppwriteItemService.deleteFile(foodItem.image)
        }
        const dbItem = await AppwriteItemService.updateDetail(foodItem.$id, {
          ...formData,
          image: file ? file.$id : undefined
        })
        if (dbItem) {
          setFormSuccess('Food item updated successfully!');
          setTimeout(() => {
            navigate(`/`);
          }, 1500);
        }
      } else {
        setFormSuccess('Adding new food item...');
        const file = await AppwriteItemService.uploadFile(formData.image);
        if (file) {
          const fileId = file.$id;
          formData.image = fileId;
        }
        const dbPost = await AppwriteItemService.addItem({ ...formData, resid: restaurant.$id })
        console.log(dbPost);
        if (dbPost) {
          setFormSuccess('Food item added successfully!');
          setTimeout(() => {
            navigate(`/restaurant/${restaurant.$id}`);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="addFoodItem">
        <div className="add-food-item-container">
          <h2>{foodItem ? 'Update Food Item' : 'Add a New Food Item'}</h2>

          {formError && <div className="form-message error">{formError}</div>}
          {formSuccess && <div className="form-message success">{formSuccess}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="input-group">
              <label htmlFor="name">Item Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="vegetarian">Vegetarian</option>
                <option value="nonVegetarian">Non-Vegetarian</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                {/* Add more options as needed */}
              </select>
            </div>
            {/* Image Upload */}
            <div className="input-group">
              <label htmlFor="image">Item Image</label>
              <input type="file" id="image" name="image" onChange={handleChange} required={!foodItem} />
            </div>

            {/* ... (other input fields for dietary restrictions, ingredients, etc.) */}

            <button
              type="submit"
              className={isSubmitting ? 'submitting' : ''}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span className="sr-only">{foodItem ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (foodItem ? 'Update Item' : 'Add Item')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
AddFoodItem.propTypes = {
  foodItem: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    image: PropTypes.string,
    status: PropTypes.string,
    $id: PropTypes.string,
  }),
};

export default AddFoodItem;
