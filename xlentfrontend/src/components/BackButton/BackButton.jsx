import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./BackButton.css";

const BackButton = () => {
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Link to="/" className="back-button-container">
      <button className="back-button" title="Back to Home">
        <span className="back-icon">←</span>
        <span className="back-text">Back to Home</span>
      </button>
    </Link>
  );
};

export default BackButton;
