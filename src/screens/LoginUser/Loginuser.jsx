// LoginForm.jsx
import { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Reset messages
    setFormError('');
    setFormSuccess('');

    if (email === "") {
      setFormError("Please enter your email");
      return;
    } else if (password === "") {
      setFormError("Enter your password");
      return;
    } else if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setFormSuccess('Logging in...');

    try {
      const session = await AuthService.login(email, password);
      if (session) {
        console.log(session);
        setFormSuccess('Login successful!');

        const userData = await AuthService.getCurrentUser();
        if (userData) dispatch(login({ userData }))
        console.log(userData);

        setTimeout(() => {
          navigate("/");
          setFormData({ ...formData, email: "", password: "" });
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="login">
        <div className="form-container">
          <h2><img src="./Images/logo.png" alt="" />Welcome Back to Rising</h2>

          {formError && <div className="form-message error">{formError}</div>}
          {formSuccess && <div className="form-message success">{formSuccess}</div>}

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
            <button
              type="submit"
              className={isSubmitting ? 'submitting' : ''}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span className="sr-only">Logging in...</span>
                </>
              ) : 'Login'}
            </button>
          </form>
          <p className="login-link">New to Delicious Deliveries? <Link to="/signupuser">Sign Up</Link></p>
        </div>
      </div>
      <Fotor />
    </>
  );
};

export default Loginuser;

