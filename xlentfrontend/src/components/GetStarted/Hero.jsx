import React, { useState } from "react";
import ContactUsCard from "../Popups/ContactUsCard";
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <>
  
    
        
<div className="desktop-only">
          <div className="justify-content-start">
            <div className="col-lg-6 py-vh-7 position-relative hero-copy" data-aos="fade-right">
             
              <button 
                onClick={() => setShowForm(true)} 
                className="btn btn-primary btn-xl shadow me-3 rounded-pill  modern-btn"
                style={{ 
                  background: 'white',
                  color: 'rgb(0, 38, 153)',
                  border: '2px solid rgb(0, 38, 153)',
                  padding: '7px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: '600'
                }}
              >
                <span className="btn-content">Get started</span>
                <span className="btn-arrow">→</span>
              </button>
              <a  className="btn btn-outline-dark btn-xl rounded-pill my-4 modern1-btn"    style={{ 
                  background: 'white',
                  color: 'rgb(100, 99, 99)',
                  border: '2px solid rgb(100, 99, 99)',
                  padding: '7px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: '600'
                }}    onClick={() => navigate('/about')}>Why XLentCar</a>
            </div>
          </div>
          </div>


      {/* Modern Animated Modal */}
      {showForm && (
                      <ContactUsCard onClose={()=> setShowForm(false)}/> 
      )}
    <style jsx>{`
  .modern-btn:hover, .modern-btn:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.95);
  }
  
  .modern1-btn:hover, .modern1-btn:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 38, 153, 0.3);
    background: rgba(255, 255, 255, 0.95);
  }
  
  .modern-btn:hover .btn-content,
  .modern-btn:active .btn-content {
    transform: translateX(-5px);
  }
  
  .modern-btn:hover .btn-arrow,
  .modern-btn:active .btn-arrow {
    transform: translateX(5px);
  }
`}</style>
    </>
  );
};

export default Hero;