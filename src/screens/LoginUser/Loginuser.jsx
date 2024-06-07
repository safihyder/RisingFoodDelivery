// LoginForm.jsx
import React, { useState } from 'react';
import './Loginuser.css'; // Shared styles for both forms
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Fotor from '../../components/Fotor/Fotor';

const Loginuser = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to your backend)
    console.log(formData); // Replace with actual submission logic
  };

  return (
    <>
    <Navbar position="relative"/>
    <div className="login">
    <div className="form-container">
      <h2><img src="./Images/logo.png" alt="" />Welcome Back to Rising</h2>
      <form onSubmit={handleSubmit}>
      <div className="input-group">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      <div className="input-group">
          <label htmlFor="name">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="login-link">New to Delicious Deliveries? <Link to="/signupuser">Sign Up</Link></p>
    </div>
    </div>
    <Fotor/>
    </>

  );
};

export default Loginuser;

