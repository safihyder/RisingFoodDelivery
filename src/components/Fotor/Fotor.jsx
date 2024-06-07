import React from 'react';
import './Fotor.css'; // Create this file for your custom styles

const Fotor = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column about">
            <h3>Our Story</h3>
            <p>
              From humble beginnings as a local food stand, 
              Rising Food Delivery blossomed into a passion project.
              Fueled by a love for fresh, authentic flavors and a commitment to exceptional service, 
              we've grown into the go-to platform for discovering and enjoying the best culinary 
              experiences your city has to offer.
            </p>
          </div>
          <div className="footer-column mission">
            <h3>Our Mission</h3>
            <p>
              To connect passionate food creators with hungry hearts, delivering not just meals, 
              but moments of joy and connection. We believe food is a universal language, 
              and we're dedicated to making that language accessible, convenient, and unforgettable.
            </p>
          </div>

          <div className="footer-column links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column contact">
            <h3>Contact Us</h3>
            <p>
              Email: <a href="mailto:contact@yourfoodsite.com">risingfooddelivery0987@gmail.com</a><br />
              Phone: +91-7889365127
            </p>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer"><img src="/Images/whatsapp.png" alt="" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><img src="/Images/instagram.png" alt="" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><img src="/Images/facebook.png" alt="" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><img src="/Images/twitter.png" alt="" /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rising Food Delivery. All rights reserved.</p>
        </div>
      </div>
    </footer>

  );
};

export default Fotor;
