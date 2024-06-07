import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Fotor from '../../components/Fotor/Fotor';

const SignupUser= () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
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
    <div className="signup">
    <div className="signup-container">
      <h2><img src="/Images/logo.png" alt="" />Signup for Rising</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="input-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            id="cpassword"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="name">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.naaddressme}
            onChange={handleChange}
            required
          />
        </div>

        {/* ... (other input fields: email, password, address) */}

        <button type="submit">Sign Up</button>
      </form>
      <p className="login-link">Already have an account? <Link to="/loginuser">Login</Link></p>
    </div>
    </div>
    <Fotor/>
    </>
  );
};

export default SignupUser;
