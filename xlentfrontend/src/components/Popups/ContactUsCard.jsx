import React, { useState } from "react";
import XlentcarLoader from '../Loader/XlentcarLoader'; // Adjust the path as needed

const ContactUsCard = ({onClose}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email:''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://xlent-production.up.railway.app';
      
      const response = await fetch(`${baseUrl}/api/customer_inquiries`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save customer')
      }
  
      // Show success message
      showNotification("Thank you! We will Contact You Soon.")
  
      // Reset form
      setFormData({ name: "", phone_number: "", email: "" })
  
      // Close modal after delay
      setTimeout(() => {
        onClose()
      }, 2000)
  
    } catch (error) {
      console.error('Error saving data:', error)
      showNotification("Something went wrong. Please try again.", "error")
    } finally {
       setIsLoading(false)
    }
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement('div');
    notification.className = `notification-toast show ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${type === "success" ? "✓" : "!"}</div>
        <div class="notification-text">${message}</div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
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
              <h2 className="modal-title">Get started with XLent</h2>
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
                <label htmlFor="phone_number" className="floating-label">Phone Number</label>
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

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'submitting' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button"></div>
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
    
      <style jsx>{`
        /* Color Variables */
        :root {
          --primary-white: #ffffff;
          --secondary-blue: rgb(0, 38, 153);
          --secondary-blue-light: rgb(0, 82, 204);
          --secondary-blue-lighter: rgba(0, 38, 153, 0.1);
        }

        /* Loader Overlay */
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 25, 41, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        
        .loader-content {
          text-align: center;
          color: white;
          padding: 40px;
          background: transparent;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          min-width: 300px;
        }
        
        .loading-text {
          margin-top: 20px;
          font-size: 1.2rem;
          color: #87ceeb;
          font-weight: 300;
          letter-spacing: 1px;
        }
        
        .button-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Modern Modal Styles */
        .modern-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .modern-modal-container {
          background: var(--secondary-blue);
          border-radius: 20px;
          padding: 0;
          max-width: 440px;
          width: 90%;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 38, 153, 0.4);
          animation: slideUp 0.4s ease-out;
        }

        .modal-bg-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: -30px;
          right: -30px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          bottom: 20px;
          left: -20px;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 40px;
          height: 40px;
          top: 50%;
          right: 30px;
          animation-delay: 4s;
        }

        .modern-modal-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .modal-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .modal-close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: white;
          border: none;
          color: var(--secondary-blue);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          font-weight: 300;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-close-btn:hover:not(:disabled) {
          background: var(--secondary-blue-light);
          color: white;
          transform: rotate(90deg);
        }

        .modal-close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Form Styles */
        .modern-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .floating-input {
          width: 100%;
          padding: 1rem 0;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .floating-input:focus:not(:disabled) {
          outline: none;
          border-bottom-color: white;
        }

        .floating-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .floating-input::placeholder {
          color: transparent;
        }

        .floating-label {
          position: absolute;
          top: 1rem;
          left: 0;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          pointer-events: none;
          font-size: 1rem;
        }

        .floating-input:focus + .floating-label,
        .floating-input:not(:placeholder-shown) + .floating-label {
          top: -0.5rem;
          font-size: 0.8rem;
          color: white;
          font-weight: 600;
        }

        .input-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: white;
          transition: width 0.3s ease;
        }

        .floating-input:focus ~ .input-underline {
          width: 100%;
        }

        .submit-btn {
          background: white;
          color: var(--secondary-blue);
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
        }

        .submit-btn:hover:not(.submitting):not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.95);
        }

        .submit-btn.submitting,
        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.8);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid var(--secondary-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
          color: var(--secondary-blue);
        }

        .submit-btn:hover:not(.submitting) .btn-arrow {
          transform: translateX(3px);
        }

        /* Modal Footer */
        .modal-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 10px;
        }

        /* Notification Toast */
        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          color: var(--secondary-blue);
          padding: 1rem 1.5rem;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 38, 153, 0.3);
          transform: translateX(400px);
          transition: transform 0.3s ease;
          z-index: 10001;
          border: 2px solid var(--secondary-blue);
        }

        .notification-toast.error {
          border-color: #ff4444;
          color: #ff4444;
        }

        .notification-toast.show {
          transform: translateX(0);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notification-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* White Glow Effect */
        .modern-modal-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3));
          border-radius: 22px;
          z-index: -1;
          animation: glow 3s ease-in-out infinite alternate;
        }

        @keyframes glow {
          0% {
            opacity: 0.3;
            filter: blur(15px);
          }
          100% {
            opacity: 0.6;
            filter: blur(25px);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modern-modal-container {
            width: 95%;
            margin: 1rem;
          }
          
          .modern-modal-content {
            padding: 2rem 1.5rem;
          }
          
          .modal-title {
            font-size: 1.3rem;
          }
          
          .loader-content {
            padding: 30px 20px;
            min-width: 280px;
          }
          
          .loading-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ContactUsCard;