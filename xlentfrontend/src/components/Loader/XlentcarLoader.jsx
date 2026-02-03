// XlentcarLoader.jsx
import React from 'react';
import './XlentcarLoader.css';

const XlentcarLoader = () => {
  return (
    <div className="xlentcar-loader">
      <div className="logo-container">
        <div className="logo-main">
          <span className="logo-letter x">X</span>
          <span className="logo-letter l">l</span>
          <span className="logo-letter e">e</span>
          <span className="logo-letter n">n</span>
          <span className="logo-letter t">t</span>
          <span className="logo-letter c">C</span>
          <span className="logo-letter a">a</span>
          <span className="logo-letter r">r</span>
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default XlentcarLoader;