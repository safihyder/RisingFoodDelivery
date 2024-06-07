import React, { useState } from 'react';
import './AddRestaurant.css'; // Import the CSS file
import Navbar from '../../components/navbar/Navbar';
const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    phoneNumber: '',
    website: '',
    logo: null,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // const { name, value, files } = e.target;

    // if (name === 'logo') {
    //   setFormData({ ...formData, logo: files[0] });
    // } else {
    //   setFormData({ ...formData, [name]: value });
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await fetch('/api/restaurants', { 
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        console.log('Restaurant added successfully!');
        // Reset the form (optional)
        setFormData({
            resname: '',
            address: '',
            desc: '',
            name: '',
            number: '',
            email: null,
        });
      } else {
        console.error('Failed to add restaurant:', response.statusText);
        // Handle error (e.g., display an error message to the user)
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      // Handle error
    }
  };

  return (
    <>
    <Navbar position="relative"/>
    <div className="addrestaurant">
    <div className="add-restaurant-form-container">
      <h2><img src="/Images/logo.png" alt="" />Add Your Restaurant</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* ... your input fields (name, cuisine, address, phoneNumber, website, description) ... */}

        <div className="input-group">
          <label htmlFor="resname">Restaurant Name</label>
          <input type="text" id="resname" name="resname" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="address">Restaurant Full Address</label>
          <input type="text" id="address" name="address" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="desc">Restaurant Description</label>
          <input type="text" id="desc" name="desc" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="resimg">Restaurant Image</label>
          <input type="file" id="resimg" name="resimg" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="name">Owner's Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="number">Owner's Number</label>
          <input type="number" id="number" name="number" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="email">Owner's Email Address</label>
          <input type="email" id="email" name="email" onChange={handleChange} />
        </div>

        <button type="submit">Add Restaurant</button>
      </form>
    </div>
   

    </div>
    </>
  );
};

export default AddRestaurant;
