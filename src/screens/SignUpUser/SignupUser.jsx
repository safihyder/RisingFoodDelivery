import { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import Fotor from '../../components/Fotor/Fotor';
import { useNavigate } from 'react-router-dom'
import AuthService from "../../appwrite/auth";
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
const SignupUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [passShow, setPassShow] = useState(false);
  // const [response, setResponse] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    const { name, email, password, cpassword } = formData;
    e.preventDefault();
    if (name === "") {
      alert("Enter your name");
    } else if (email === "") {
      alert("Enter your email");
    } else if (password === '') {
      alert("Enter your password");
    } else if (cpassword === "") {
      alert("Confirm you password");
    } else if (password.length < 6) {
      alert("Password must be atleast 6 character")
    } else if (cpassword.length < 6) {
      alert("Password must be atleast 6 character")
    } else {
      const userData = await AuthService.createAccount(name, email, password);
      if (userData) {
        const userData = await AuthService.getCurrentUser()
        console.log(userData);
        if (userData) dispatch(login({ userData }));
        navigate("/");
      }
    }
  }


  return (
    <>
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
            <button type="submit">Sign Up</button>
          </form>
          <p className="login-link">Already have an account? <Link to="/loginuser">Login</Link></p>
        </div>
      </div>
      <Fotor />
    </>
  );
};
export default SignupUser;
