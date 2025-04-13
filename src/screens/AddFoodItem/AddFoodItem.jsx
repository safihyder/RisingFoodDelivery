import { useState, useEffect } from 'react';
// import './AddFoodItem.css';
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-orange-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center justify-center mb-8">
            <img src="/Images/logo.png" alt="Rising Food Delivery Logo" className="h-16 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              {foodItem ? 'Update Food Item' : 'Add a New Food Item'}
            </h2>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-lg text-center bg-red-50 text-red-700 border border-red-200">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="mb-6 p-4 rounded-lg text-center bg-green-50 text-green-700 border border-green-200">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Item Name<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="nonVegetarian">Non-Vegetarian</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Item Image<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                required={!foodItem}
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <p className="text-xs text-gray-500">
                Upload a high-quality image of your food item (JPG, PNG, or GIF)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{foodItem ? 'Updating...' : 'Adding...'}</span>
                </div>
              ) : (
                foodItem ? 'Update Item' : 'Add Item'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
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
