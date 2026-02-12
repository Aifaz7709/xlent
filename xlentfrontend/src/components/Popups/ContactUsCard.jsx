import React, { useState } from "react";
import XlentcarLoader from '../Loader/XlentcarLoader'; // Adjust the path as needed
import { useSnackbar } from '../Snackbar/Snackbar';
import './ContactCard.css'
import { useDispatch } from 'react-redux';
import { setCustomerInfo } from '../Redux/Slices/customerInfoSlice';

const ContactUsCard = ({onClose, title, booking1 }) => {

  const { startDate, endDate, } = booking1 || {};
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    Location: "",
    startDate: startDate || "",
    endDate: endDate || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
 
    
  // Use the snackbar hook
  const { showSuccess, showError, showWarning, showInfo, showDefault } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.phone_number.trim() || !formData.email.trim()) {
      showWarning("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showWarning("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
  
    try {
      const baseUrl =  'https://services.leadconnectorhq.com/hooks/TjM5taSPltE7LMcOsEUH/webhook-trigger/c0dafae8-d990-45a5-8f2e-35cdf13cab30';
      
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          Location: formData.Location,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      });
   
      dispatch(
        setCustomerInfo({
          customer_name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          location: formData.Location,
          startDate: formData.startDate,
          endDate: formData.endDate,
        })
      );
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save customer');
      }
  
      // Show success snackbar
      showSuccess("Thank you! We will contact you soon.", 3000);
  
      // Reset form
      setFormData({ name: "", phone_number: "", email: "" });
  
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
  
    } catch (error) {
      console.error('Error saving data:', error);
      // Show error snackbar
      showError("Something went wrong. Please try again.", 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Show loader as overlay when submitting */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <XlentcarLoader />
          </div>
        </div>
      )}

      <div className="modern-modal-overlay" onClick={onClose}>
        <div className="modern-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modern-modal-content">
            {/* Animated Background */}
            <div className="modal-bg-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            
            {/* Header */}
            <div className="modal-header">
            <h2 className="modal-title">{title || "Get started with XLent"}</h2>
            <button 
                className="modal-close-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                <span style={{paddingBottom: '5px'}}>×</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-group floating-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="floating-input"
                  placeholder=" "
                  disabled={isLoading}
                />
                <label htmlFor="name" className="floating-label">Your Name</label>
                <div className="input-underline"></div>
              </div>

              <div className="form-group floating-group">
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="floating-input"
                  placeholder=" "
                  disabled={isLoading}
                />
                <label htmlFor="phone_number" className="floating-label">WhatsApp Number</label>
                <div className="input-underline"></div>
              </div>

              <div className="form-group floating-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="floating-input"
                  placeholder=" "
                  disabled={isLoading}
                />
                <label htmlFor="email" className="floating-label">Email</label>
                <div className="input-underline"></div>
              </div>
              <div className="form-group floating-group">
                <input
                  type="text"
                  id="Location"
                  name="Location"
                  value={formData.Location}
                  onChange={handleInputChange}
                  required
                  className="floating-input"
                  placeholder=" "
                  disabled={isLoading}
                />
                <label htmlFor="Location" className="floating-label">Your Location</label>
                <div className="input-underline"></div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'submitting' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-loader"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Get Started Now</span>
                    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L14.5 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14.5 8H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="modal-footer">
              <div className="security-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1L14.5 4V7C14.5 10.5 12 13.5 8 15C4 13.5 1.5 10.5 1.5 7V4L8 1Z" fill="currentColor"/>
                </svg>
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
       
      </>
    );
  };

  export default ContactUsCard;