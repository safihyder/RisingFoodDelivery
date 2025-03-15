import { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

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
    const { name, email, password, cpassword } = formData;
    e.preventDefault();

    // Reset messages
    setFormError('');
    setFormSuccess('');

    if (name === "") {
      setFormError("Enter your name");
      return;
    } else if (email === "") {
      setFormError("Enter your email");
      return;
    } else if (password === '') {
      setFormError("Enter your password");
      return;
    } else if (cpassword === "") {
      setFormError("Confirm your password");
      return;
    } else if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    } else if (cpassword.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    } else if (password !== cpassword) {
      setFormError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setFormSuccess('Creating your account...');

    try {
      const userData = await AuthService.createAccount(name, email, password);
      if (userData) {
        setFormSuccess('Account created successfully!');
        const currentUser = await AuthService.getCurrentUser();
        console.log(currentUser);
        if (currentUser) dispatch(login({ userData: currentUser }));

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setFormError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="signup">
        <div className="signup-container">
          <h2><img src="/Images/logo.png" alt="" />Signup for Rising</h2>

          {formError && <div className="form-message error">{formError}</div>}
          {formSuccess && <div className="form-message success">{formSuccess}</div>}

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
            <button
              type="submit"
              className={isSubmitting ? 'submitting' : ''}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span className="sr-only">Signing up...</span>
                </>
              ) : 'Sign Up'}
            </button>
          </form>
          <p className="login-link">Already have an account? <Link to="/loginuser">Login</Link></p>
        </div>
      </div>
      <Fotor />
    </>
  );
};
export default SignupUser;
