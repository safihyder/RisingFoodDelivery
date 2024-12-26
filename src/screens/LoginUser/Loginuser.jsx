// LoginForm.jsx
import { useState } from 'react';
import './Loginuser.css'; // Shared styles for both forms
import { Link, useNavigate } from 'react-router-dom';
import Fotor from '../../components/Fotor/Fotor';
import AuthService from "../../appwrite/auth"
import { login } from "../../store/authSlice"
import { useDispatch } from 'react-redux';
const Loginuser = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email === "") {
      alert("Please enter your email");
    } else if (password === "") {
      alert("Enter you password");
    } else if (password.length < 6) {
      alert("Password must be atleast 6 character")
    } else {
      const session = await AuthService.login(email, password);
      if (session) {
        console.log(session);
        const userData = await AuthService.getCurrentUser();
        if (userData) dispatch(login({ userData }))
        console.log(userData);

        navigate("/");
        setFormData({ ...formData, email: "", password: "" })
      }
    }
  };
  return (
    <>
      <div className="login">
        <div className="form-container">
          <h2><img src="./Images/logo.png" alt="" />Welcome Back to Rising</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
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
      <Fotor />
    </>

  );
};

export default Loginuser;

