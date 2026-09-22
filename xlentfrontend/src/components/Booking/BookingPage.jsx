import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingPage.css";
import AppLoader from "../Loader/AppLoader";
import ContactUsCard from "../Popups/ContactUsCard";
import { useSelector } from "react-redux";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};
  

  const [booking, setBooking] = useState({
    startDate: "", 
    endDate: "", 
  });
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const customerData = useSelector((state) => state.customerInfo);

  
  // Snackbar state for BookingPage (since we can't use the hook directly)
  const [snackbar, setSnackbar] = useState(null);
  
  const [countdown, setCountdown] = useState(8);

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

  const getBookingDays = () => {
    if (!booking.startDate || !booking.endDate) return 0;
    return Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000));
  };

  const formatDate = (date) => new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`));

  const validateDates = () => {
    if (!booking.startDate || !booking.endDate) {
      showError("Choose your pickup and return dates to continue.", 4000);
      return false;
    }

    if (booking.endDate < booking.startDate) {
      showError("Your return date must be after your pickup date.", 4000);
      return false;
    }

    return true;
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!validateDates()) return;
    localStorage.setItem("latestBooking", JSON.stringify({ car, booking, total, customer: customerData }));
    showSuccess("Great choice. Tell us where to reach you next.", 3000);
    setShowUserForm(true);
  };

  useEffect(() => {
    if (booking.startDate && booking.endDate) {
      const days = getBookingDays();
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
                    src={Array.isArray(car.photos) ? car.photos[0] : car.photos}
                    alt={`${car.name || car.car_model || 'Selected car'}`}
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
              <p className="booking-eyebrow">YOUR SELECTED VEHICLE</p>
              <h2>{car.name || car.car_model || 'Selected vehicle'} <span>{car.model}</span></h2>
            </div>
          </div>

          <div className="interface-panel1">
            <div className="booking-step-heading">
              <span className="booking-step-number">1</span>
              <div>
                <p className="booking-eyebrow">STEP ONE</p>
                <h3>Choose your dates</h3>
                <p>Tell us when you need the car.</p>
              </div>
            </div>
            
            <div className="control-group">
              <label htmlFor="pickup-date">Pick-up date</label>
              <div className="input-row">
                <input 
                  id="pickup-date"
                  type="date" 
                  className="neo-input" 
                  onChange={(e) => {
                    setBooking({...booking, startDate: e.target.value});
                    if (e.target.value) {
                    }
                  }} 
                  style={{color:'black'}}
                  min={new Date().toISOString().split('T')[0]} // Disable past dates
                  required
                />
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="return-date">Return date</label>
              <div className="input-row">
                <input 
                  id="return-date"
                  type="date" 
                  className="neo-input" 
                  onChange={(e) => {
                    setBooking({...booking, endDate: e.target.value});
                    if (e.target.value) {
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
      <span>Dates</span>
      <strong>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</strong>
    </div>
    <div className="summary-item duration">
      <span>Duration:</span>
      <strong>
        {(() => {
          const days = getBookingDays();
          
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
              {!booking.startDate || !booking.endDate ? 'Choose dates to continue' : 'Continue to your details'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showUserForm && (
          <ContactUsCard
            title="Complete Your Booking"
            booking1={booking}
            onClose={() => {
              setShowUserForm(false);
              setIsConfirmed(true);

              // showWarning("Booking process cancelled", 3000);
            }}
            onSuccess={() => {
              // This would be called from ContactUsCard after successful submission
              setShowUserForm(false);
              setIsProcessing(false);
            }}
          />
        )}

        {/* Processing Overlay */}
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
              <AppLoader />
              <div className="processing-text">Processing your booking...</div>
            </motion.div>
          )}

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
                <p>CUSTOMER <span>{customerData.customer_name}</span></p>
<p>CONTACT <span>{customerData.phone_number}</span></p>
<p>EMAIL <span>{customerData.email}</span></p>

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
    
    </div>
  );
};

export default BookingPage;