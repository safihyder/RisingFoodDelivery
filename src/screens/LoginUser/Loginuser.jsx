// LoginForm.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Fotor from '../../components/Fotor/Fotor';
import AuthService from "../../appwrite/auth"
import { login as authLogin } from "../../store/authSlice"
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
  const [focusedField, setFocusedField] = useState(null);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData)
  const handleBlur = (fieldName) => {
    setFocusedField(null);
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
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
    // Mark all fields as touched on submit
    setTouchedFields({
      email: true,
      password: true
    });
    // Validate all fields
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {

      const session = await AuthService.login(formData.email, formData.password);
      if (session) {
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          setFormSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    } catch (error) {
      console.log("Login Error:", error);
      setFormError(error.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 2px #ff6b6b",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 1px #ddd",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 5px 15px rgba(211, 47, 47, 0.3)"
    },
    tap: { scale: 0.98 },
    disabled: {
      opacity: 0.7,
      cursor: "not-allowed"
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-orange-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-8 py-12">
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img src="./Images/logo.png" alt="" className="h-16 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome Back to Rising
              </h2>
            </motion.div>

            <AnimatePresence>
              {(formError || formSuccess) && (
                <motion.div
                  className={`mb-6 p-4 rounded-lg text-center ${formError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {formError || formSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <motion.label
                  htmlFor="email"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'email' ? '#d32f2f' : '#374151' }}
                >
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </motion.label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${touchedFields.email && !formData.email ? 'border-red-500' : ''
                    }`}
                  variants={inputVariants}
                  animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                />
                <AnimatePresence>
                  {touchedFields.email && !formData.email && (
                    <motion.p
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      Email is required
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <motion.label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'password' ? '#d32f2f' : '#374151' }}
                >
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </motion.label>
                <motion.input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => handleBlur('password')}
                  required
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${touchedFields.password && !formData.password ? 'border-red-500' : ''
                    }`}
                  variants={inputVariants}
                  animate={focusedField === 'password' ? 'focused' : 'unfocused'}
                />
                <AnimatePresence>
                  {touchedFields.password && !formData.password && (
                    <motion.p
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      Password is required
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                animate={isSubmitting ? "disabled" : ""}
              >
                {isSubmitting ? (
                  <>
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </motion.svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-6 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              New to Rising Food Delivery?{' '}
              <motion.span whileHover={{ color: '#ff4b4b' }}>
                <Link to="/signupuser" className="font-medium text-red-600 hover:text-red-500">
                  Sign Up
                </Link>
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
      <Fotor />
    </>
  );
};
export default Loginuser;

