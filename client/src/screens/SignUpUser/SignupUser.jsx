import { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Fotor from '../../components/Fotor/Fotor';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const SignupUser = () => {
  const navigate = useNavigate();
  // const [passShow, setPassShow] = useState(false);
  const [response, setResponse] = useState({});
  const [formData, setFormData] = useState({
    fname: '',
    email: '',
    password: '',
    cpassword: '',
    location: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    const { fname, email, password, cpassword, location } = formData;
    e.preventDefault();
    if (fname === "") {
      alert("Enter your name");
    } else if (email === "") {
      alert("Enter your email");
    } else if (location === "") {
      alert("Enter your Location");
    } else if (password === '') {
      alert("Enter you password");
    } else if (cpassword === "") {
      alert("Confirm you password");
    } else if (password.length < 6) {
      alert("Password must be atleast 6 character")
    } else if (cpassword.length < 6) {
      alert("Password must be atleast 6 character")
    } else {
      axios.post('http://localhost:3000/createuser', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          setResponse(response);
          console.log(response);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error data:', error.response.data);
            console.log('Error status:', error.response.status);
            console.log('Error headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
          }
        });
      if (response.status !== 201) {
        alert("Enter Valid Credentials")
      } else {
        navigate("/loginuser")
      }
      // const onChange=(event)=>{
      //     setcredentials({...credentials,[event.target.name]:event.target.value})
      //   }
    }
  }
  return (
    <>
      <Navbar position="relative" />
      <div className="signup">
        <div className="signup-container">
          <h2><img src="/Images/logo.png" alt="" />Signup for Rising</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fname">Full Name</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
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
            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
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
