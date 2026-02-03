import React, { useState } from 'react'
import XlentcarLoader from '../Loader/XlentcarLoader'
const UserData = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "", 
    email: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    console.log('button clicked');
    
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://xlent-production.up.railway.app';
      
      // CHANGE: Send as JSON instead of FormData
      const response = await fetch(`${baseUrl}/api/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Add this header
        },
        body: JSON.stringify({
          customer_name: formData.name,      // Must match backend field name
          phone_number: formData.phone_number,
          email: formData.email
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save customer')
      }
  
      // Show success message
      showNotification("Thank you! Your information has been saved.")
  
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
    const notification = document.createElement('div')
    notification.className = `notification-toast show ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${type === "success" ? "✓" : "!"}</div>
        <div class="notification-text">${message}</div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  return (
    <div>
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
                />
                <label htmlFor="name" className="floating-label">Your Name</label>
                <div className="input-underline"></div>
              </div>

              <div className="form-group floating-group">
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="floating-input"
                  placeholder=" "
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
                    <XlentcarLoader />
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
      {/* Add CSS for loader overlay */}
      <style jsx>{`
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
          z-index: 9999;
        }
        
        .loader-container {
          text-align: center;
          color: white;
          padding: 40px;
          background: rgba(2, 40, 124, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 144, 226, 0.3);
        }
        
        .loader-text {
          margin-top: 20px;
          font-size: 1.2rem;
          color: #87ceeb;
          font-weight: 300;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  )
}

export default UserData