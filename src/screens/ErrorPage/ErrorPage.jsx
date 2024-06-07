import React from 'react';
import './ErrorPage.css'; // Create this CSS file

const ErrorPage = () => {
  return (
    <div className="error-page">
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <i className="fas fa-link fa-5x"></i> {/* Broken link icon */}
        </div>
        <h2>404 - Page Not Found</h2>
        <p>
          The page you're looking for doesn't seem to exist. It might have been moved, 
          renamed, or is simply unavailable at this time.
        </p>
        <p>
          Please check the URL you entered or head back to our delicious homepage.
        </p>
        <div className="error-buttons">
          <button onClick={() => window.history.back()}>Go Back</button>
          <a href="/" className="home-button">Homepage</a> {/* Link to homepage */}
        </div>
      </div>
    </div>
    </div>

  );
};

export default ErrorPage;
