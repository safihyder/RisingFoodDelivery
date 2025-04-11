import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Fotor = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const email = "risingfooddelivery0987@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const socialIcons = [
    { name: "WhatsApp", icon: "/Images/whatsapp.png", color: "bg-green-500" },
    { name: "Instagram", icon: "/Images/instagram.png", color: "bg-pink-600" },
    { name: "Facebook", icon: "/Images/facebook.png", color: "bg-blue-600" },
    { name: "Twitter", icon: "/Images/twitter.png", color: "bg-blue-400" }
  ];

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <motion.footer
      className="bg-gradient-to-b from-gray-900 to-black text-white py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={footerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* About Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.h3
                className="text-xl font-bold text-orange-400 border-b-2 border-orange-400 inline-block pb-1"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                Our Story
              </motion.h3>
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => toggleSection('about')}
              >
                {expandedSection === 'about' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              </button>
            </div>
            <motion.div
              className={`text-gray-300 text-sm leading-relaxed ${expandedSection === 'about' || expandedSection === null ? 'block' : 'hidden md:block'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === 'about' || expandedSection === null ? 1 : 0,
                height: expandedSection === 'about' || expandedSection === null ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <p>
                From humble beginnings as a local food stand,
                Rising Food Delivery blossomed into a passion project.
                Fueled by a love for fresh, authentic flavors and a commitment to exceptional service,
                we&apos;ve grown into the go-to platform for discovering and enjoying the best culinary
                experiences your city has to offer.
              </p>
            </motion.div>
          </motion.div>

          {/* Mission Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.h3
                className="text-xl font-bold text-orange-400 border-b-2 border-orange-400 inline-block pb-1"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                Our Mission
              </motion.h3>
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => toggleSection('mission')}
              >
                {expandedSection === 'mission' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              </button>
            </div>
            <motion.div
              className={`text-gray-300 text-sm leading-relaxed ${expandedSection === 'mission' || expandedSection === null ? 'block' : 'hidden md:block'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === 'mission' || expandedSection === null ? 1 : 0,
                height: expandedSection === 'mission' || expandedSection === null ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <p>
                To connect passionate food creators with hungry hearts, delivering not just meals,
                but moments of joy and connection. We believe food is a universal language,
                and we&apos;re dedicated to making that language accessible, convenient, and unforgettable.
              </p>
            </motion.div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.h3
                className="text-xl font-bold text-orange-400 border-b-2 border-orange-400 inline-block pb-1"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                Quick Links
              </motion.h3>
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => toggleSection('links')}
              >
                {expandedSection === 'links' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              </button>
            </div>
            <motion.ul
              className={`space-y-2 ${expandedSection === 'links' || expandedSection === null ? 'block' : 'hidden md:block'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === 'links' || expandedSection === null ? 1 : 0,
                height: expandedSection === 'links' || expandedSection === null ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {['About Us', 'Terms of Service', 'Privacy Policy', 'FAQs', 'Contact Us'].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link}
                  </Link>
                </motion.li>
              ))}
              <motion.li whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link
                  to="/delivery-partner-registration"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Become a Delivery Partner
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.h3
                className="text-xl font-bold text-orange-400 border-b-2 border-orange-400 inline-block pb-1"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                Contact Us
              </motion.h3>
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => toggleSection('contact')}
              >
                {expandedSection === 'contact' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              </button>
            </div>
            <motion.div
              className={`space-y-3 ${expandedSection === 'contact' || expandedSection === null ? 'block' : 'hidden md:block'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === 'contact' || expandedSection === null ? 1 : 0,
                height: expandedSection === 'contact' || expandedSection === null ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="relative">
                  <button
                    onClick={copyEmail}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                  >
                    <span>{email}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {emailCopied && (
                    <motion.div
                      className="absolute -top-8 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Email copied!
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+91-7889365127</span>
              </div>

              <div className="pt-2">
                <div className="flex space-x-3">
                  {socialIcons.map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredIcon === index ? social.color : 'bg-gray-700'}`}
                      whileHover={{ y: -5, scale: 1.1 }}
                      onHoverStart={() => setHoveredIcon(index)}
                      onHoverEnd={() => setHoveredIcon(null)}
                    >
                      <motion.img
                        src={social.icon}
                        alt={social.name}
                        className="w-6 h-6"
                        whileHover={{ rotate: 10 }}
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.p
            whileHover={{ scale: 1.01, color: "#fff" }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            &copy; {new Date().getFullYear()} Rising Food Delivery. All rights reserved.
          </motion.p>

          <motion.div
            className="mt-4 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.a
              href="/terms-of-service"
              className="text-gray-500 hover:text-orange-400 transition-colors duration-300 text-xs"
              whileHover={{ scale: 1.05, x: 2 }}
            >
              Terms
            </motion.a>
            <motion.a
              href="/privacy-policy"
              className="text-gray-500 hover:text-orange-400 transition-colors duration-300 text-xs"
              whileHover={{ scale: 1.05, x: 2 }}
            >
              Privacy
            </motion.a>
            <motion.a
              href="/cookies"
              className="text-gray-500 hover:text-orange-400 transition-colors duration-300 text-xs"
              whileHover={{ scale: 1.05, x: 2 }}
            >
              Cookies
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Fotor;
