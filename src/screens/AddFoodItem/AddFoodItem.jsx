import React, { useState } from 'react';
import './AddFoodItem.css';
import Navbar from '../../components/navbar/Navbar';

const AddFoodItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null, // File input for image upload
    // ... other relevant fields (e.g., dietary restrictions, ingredients)
  });

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

    // 1. Create FormData Object
    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      // 2. Send data to your backend (replace with your API endpoint)
      const response = await fetch('/api/food-items', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        // 3. Handle successful submission (e.g., reset form, show confirmation)
        console.log('Food item added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: null,
          // ... other fields
        });
      } else {
        // 4. Handle errors
        console.error('Failed to add food item:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  return (
    <>
    <Navbar position="relative"/>
    <div className="addFoodItem">
    <div className="add-food-item-container">
      <h2>Add a New Food Item</h2>
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
            <option value="">Select Category</option>
            <option value="appetizer">Appetizer</option>
            <option value="main-course">Main Course</option>
            <option value="dessert">Dessert</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Image Upload */}
        <div className="input-group">
          <label htmlFor="image">Item Image</label>
          <input type="file" id="image" name="image" onChange={handleChange} required />
        </div>

        {/* ... (other input fields for dietary restrictions, ingredients, etc.) */}

        <button type="submit">Add Item</button>
      </form>
    </div>
    </div>
    </>

  );
};

export default AddFoodItem;
