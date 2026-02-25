import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingPage.css";
import XlentcarLoader from "../Loader/XlentcarLoader";
import ContactUsCard from "../Popups/ContactUsCard";
import { useSelector, useDispatch } from "react-redux";

const BookingPage = ( formData) => {
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

  const handleBooking =  async (e) => {
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

    try {
      const baseUrl =  'https://services.leadconnectorhq.com/hooks/TjM5taSPltE7LMcOsEUH/webhook-trigger/c0dafae8-d990-45a5-8f2e-35cdf13cab30';
      
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: booking.startDate,
          endDate: booking.endDate,
       
        })
      });

    } catch (error) {
      console.error('Error saving data:', error);
      // Show error snackbar
      showError("Something went wrong. Please try again.", 4000);
    } finally {
      setShowUserForm(true);

    }

  };
  const handleBooking1 =  (e) => {
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
// After booking confirmation in BookingPage
localStorage.setItem("latestBooking", JSON.stringify({
  car: car,
  booking: booking,
  total: total,
  customer: customerData
}));

 
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
               onClick={handleBooking1}
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
            booking1={booking}
            onClose={() => {
              setShowUserForm(false);
              setIsConfirmed(true);

              // showWarning("Booking process cancelled", 3000);
            }}
            onSuccess={() => {
              // This would be called from ContactUsCard after successful submission
              setShowUserForm(false);
              setIsProcessing(true);
              handleBooking();

              setTimeout(() => {
                setIsProcessing(false);
                showSuccess("Booking confirmed successfully! 🎉", 2000);
              }, 1000);
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
              <XlentcarLoader />
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