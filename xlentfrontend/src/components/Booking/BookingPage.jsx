import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingPage.css";
import XlentcarLoader from "../Loader/XlentcarLoader";
import ContactUsCard from "../Popups/ContactUsCard";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  const [booking, setBooking] = useState({
    startDate: "", 
    startTime: "10:00",
    endDate: "", 
    endTime: "10:00"
  });
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  
  // User form state
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Snackbar state for BookingPage (since we can't use the hook directly)
  const [snackbar, setSnackbar] = useState(null);
  
  // FIX: Set to 6 to match the 6s progress bar animation
  const [countdown, setCountdown] = useState(116); 

  useEffect(() => {
    let timer;
    if (isConfirmed && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (isConfirmed && countdown === 0) {
      navigate('/');
    }
    return () => clearTimeout(timer);
  }, [isConfirmed, countdown, navigate]);

  // Snackbar functions for BookingPage
  const showSnackbar = (message, type = 'default', duration = 5000) => {
    const id = Date.now();
    setSnackbar({ id, message, type, duration });
    
    setTimeout(() => {
      setSnackbar(null);
    }, duration);
  };

  const showError = (message, duration) => showSnackbar(message, 'error', duration);
  const showWarning = (message, duration) => showSnackbar(message, 'warning', duration);
  const showSuccess = (message, duration) => showSnackbar(message, 'success', duration);
  const showInfo = (message, duration) => showSnackbar(message, 'info', duration);

  const handleBooking = (e) => {
    e.preventDefault();
  
    // Check if dates are selected
    if (!booking.startDate || !booking.endDate) {
      showError("Please select both pickup and return dates", 4000);
      return;
    }
  
    // Check if return date is before pickup date
    if (new Date(booking.endDate) < new Date(booking.startDate)) {
      showError("Return date cannot be before pickup date", 4000);
      return;
    }

    // Check if pickup date is today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(booking.startDate);
    
    if (pickupDate < today) {
      showError("Pickup date cannot be in the past", 4000);
      return;
    }
  
    // All validations passed
    showSuccess("Dates selected successfully! Please complete your details.", 3000);
    setShowUserForm(true);
  };

  useEffect(() => {
    if (booking.startDate && booking.endDate) {
      const days = Math.ceil(Math.abs(new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) || 1;
      setTotal(days * car.dailyRate);
    }
  }, [booking, car?.dailyRate]);

  if (!car) return <div className="error-state">System Error: Vehicle Data Missing</div>;

  return (
    <div className="futuristic-page1">
      <div className="grid-overlay1"></div>

      {/* Snackbar Component for BookingPage */}
      {snackbar && (
        <div className={`booking-snackbar snackbar-${snackbar.type} show`}>
          <div className="snackbar-icon">
            {snackbar.type === 'success' && '✓'}
            {snackbar.type === 'error' && '✗'}
            {snackbar.type === 'warning' && '⚠'}
            {snackbar.type === 'info' && 'ℹ'}
            {snackbar.type === 'default' && '●'}
          </div>
          <div className="snackbar-content">
            <p>{snackbar.message}</p>
          </div>
          <button className="snackbar-close" onClick={() => setSnackbar(null)}>
            ×
          </button>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="booking-glass-card1"
      >
        <div className="glass-header">
          <button 
            className="nav-btn11" 
            style={{borderRadius: '100px', margin:'5px'}} 
            onClick={() => {
              showInfo("Returning to previous page...", 2000);
              setTimeout(() => navigate(-1), 500);
            }}
          >
            BACK
          </button>
        </div>

        <div className="main-content1">
          <div className="visual-panel1">
            <div className="car-image-display">
              {car.photos ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="car-image-container"
                >
                  <img 
                    src={car.photos} 
                    alt={`${car.brand || car.name} ${car.model}`}
                    className="car-main-image"
                    loading="lazy"
                  />
                  <div className="image-overlay-glow"></div>
                </motion.div>
              ) : (
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="hologram-container1"
                >
                  <div className="car-glow"></div>
                  <span className="big-emoji">🚗</span>
                </motion.div>
              )}
            </div>
            <div className="car-info-box" style={{marginTop: '10px'}}>
              <h2>{car.name} <br/><span>{car.model}</span></h2>
            </div>
          </div>

          <div className="interface-panel1">
            <h3 style={{fontFamily:'serif'}}>Confirm Booking Dates</h3>
            
            <div className="control-group">
              <label>PICKUP </label>
              <div className="input-row">
                <input 
                  id="pickup-date"
                  type="date" 
                  className="neo-input" 
                  onChange={(e) => {
                    setBooking({...booking, startDate: e.target.value});
                    if (e.target.value) {
                      showInfo(`Pickup date: ${e.target.value}`, 2000);
                    }
                  }} 
                  style={{color:'black'}}
                  min={new Date().toISOString().split('T')[0]} // Disable past dates
                  required
                />
              </div>
            </div>

            <div className="control-group">
              <label>RETURN </label>
              <div className="input-row">
                <input 
                  type="date" 
                  className="neo-input" 
                  onChange={(e) => {
                    setBooking({...booking, endDate: e.target.value});
                    if (e.target.value) {
                      showInfo(`Return date: ${e.target.value}`, 2000);
                    }
                  }} 
                  style={{color:'black'}}
                  min={booking.startDate || new Date().toISOString().split('T')[0]} // Disable dates before pickup
                  required
                />
              </div>
            </div>

            {/* Booking summary preview */}
            {booking.startDate && booking.endDate && (
  <div className="booking-summary-preview">
    <div className="summary-item">
      <span>Booking Period:</span>
      <strong>{booking.startDate} to {booking.endDate}</strong>
    </div>
    <div className="summary-item duration">
      <span>Duration:</span>
      <strong>
        {(() => {
          const days = Math.ceil(Math.abs(new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
          
          if (days === 1) {
            return "1 Day";
          } else if (days < 7) {
            return `${days} Days`;
          } else if (days === 7) {
            return "1 Week";
          } else if (days < 30) {
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            if (remainingDays === 0) {
              return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
            } else {
              return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'} ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
            }
          } else if (days === 30 || days === 31) {
            return "1 Month";
          } else if (days < 365) {
            const months = Math.floor(days / 30);
            const remainingDays = days % 30;
            if (remainingDays === 0) {
              return `${months} ${months === 1 ? 'Month' : 'Months'}`;
            } else {
              return `${months} ${months === 1 ? 'Month' : 'Months'} ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
            }
          } else {
            const years = Math.floor(days / 365);
            const remainingDays = days % 365;
            if (remainingDays === 0) {
              return `${years} ${years === 1 ? 'Year' : 'Years'}`;
            } else {
              const months = Math.floor(remainingDays / 30);
              return `${years} ${years === 1 ? 'Year' : 'Years'} ${months} ${months === 1 ? 'Month' : 'Months'}`;
            }
          }
        })()}
      </strong>
    </div>
  </div>
)}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="execute-btn"
              onClick={handleBooking}
              disabled={!booking.startDate || !booking.endDate}
            >
              {!booking.startDate || !booking.endDate ? 'SELECT DATES FIRST' : 'INITIALIZE BOOKING'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showUserForm && (
          <ContactUsCard
            title="Complete Your Booking"
            onClose={() => {
              setShowUserForm(false);
              showWarning("Booking process cancelled", 3000);
            }}
            onSuccess={() => {
              // This would be called from ContactUsCard after successful submission
              setShowUserForm(false);
              setIsProcessing(true);
              
              setTimeout(() => {
                setIsProcessing(false);
                setIsConfirmed(true);
                showSuccess("Booking confirmed successfully! 🎉", 4000);
              }, 2000);
            }}
          />
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(10, 25, 41, 0.95)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <XlentcarLoader />
              <div className="processing-text">Processing your booking...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        {isConfirmed && (
          <div className="success-modal-wrapper"> 
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="success-modal"
            >
              <div className="check-icon">✓</div>
              <h2 className="orbitron">RESERVATION SECURED</h2>
              
              <div className="receipt-details">
                <p>VEHICLE <span>{car.name} {car.model}</span></p>
                <p>CUSTOMER <span>{userData.name}</span></p>
                <p>CONTACT <span>{userData.phone}</span></p>
                <p>EMAIL <span>{userData.email}</span></p>
                <p>PICKUP <span>{booking.startDate || 'TBD'} at {booking.startTime}</span></p>
                <p>RETURN <span>{booking.endDate || 'TBD'} at {booking.endTime}</span></p>
                <p className="total-row">TOTAL <span>₹{total || car.dailyRate}</span></p>
              </div>

              <p className="redirect-text">
                Auto-navigating in <strong>{countdown}s</strong>...
              </p>

              <button className="back-home-btn" onClick={() => navigate('/')}>
                CONFIRM & EXIT
              </button>

              <div className="modal-progress-container">
                <motion.div 
                  className="modal-progress-bar"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS Styles */}
      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 25, 41, 0.95);
          display: flex;
          flex-direction: column;
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

        .processing-text {
          color: white;
          margin-top: 20px;
          font-size: 1.1rem;
          font-family: 'Orbitron', sans-serif;
        }

        /* Booking Summary Preview */
        .booking-summary-preview {
          margin-top: 20px;
          padding: 15px;
          background: rgba(2, 40, 124, 0.05);
          border-radius: 8px;
          border-left: 4px solid rgb(2, 40, 124);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }

        .summary-item.total {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ddd;
          font-weight: bold;
        }

        /* Snackbar Styles for BookingPage */
        .booking-snackbar {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-left: 5px solid;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 16px 24px 16px 16px;
          display: flex;
          align-items: center;
          min-width: 300px;
          max-width: 350px;
          z-index: 10000;
          transform: translateX(400px);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .booking-snackbar.show {
          transform: translateX(0);
          opacity: 1;
        }

        .booking-snackbar.snackbar-success {
          border-left-color: rgb(15, 110, 15);
        }

        .booking-snackbar.snackbar-error {
          border-left-color: rgb(180, 10, 10);
        }

        .booking-snackbar.snackbar-warning {
          border-left-color: rgb(180, 100, 10);
        }

        .booking-snackbar.snackbar-info {
          border-left-color: rgb(10, 100, 180);
        }

        .booking-snackbar.snackbar-default {
          border-left-color: rgb(2, 40, 124);
        }

        .booking-snackbar .snackbar-icon {
          font-size: 20px;
          margin-right: 12px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .booking-snackbar.snackbar-success .snackbar-icon {
          color: rgb(15, 110, 15);
          background: rgba(15, 110, 15, 0.1);
        }

        .booking-snackbar.snackbar-error .snackbar-icon {
          color: rgb(180, 10, 10);
          background: rgba(180, 10, 10, 0.1);
        }

        .booking-snackbar.snackbar-warning .snackbar-icon {
          color: rgb(180, 100, 10);
          background: rgba(180, 100, 10, 0.1);
        }

        .booking-snackbar.snackbar-info .snackbar-icon {
          color: rgb(10, 100, 180);
          background: rgba(10, 100, 180, 0.1);
        }

        .booking-snackbar.snackbar-default .snackbar-icon {
          color: rgb(2, 40, 124);
          background: rgba(2, 40, 124, 0.1);
        }

        .booking-snackbar .snackbar-content {
          flex-grow: 1;
          margin-right: 8px;
        }

        .booking-snackbar .snackbar-content p {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
        }

        .booking-snackbar .snackbar-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #888;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .booking-snackbar .snackbar-close:hover {
          color: #333;
        }

        /* Execute button disabled state */
        .execute-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #999;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;