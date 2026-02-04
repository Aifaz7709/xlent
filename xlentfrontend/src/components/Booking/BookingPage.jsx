import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingPage.css";
import XlentcarLoader from "../Loader/XlentcarLoader";

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

  const handleBooking = () => {
    // Show user form first instead of processing immediately
    setShowUserForm(true);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save user data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    
    // Close the user form and start processing booking
    setShowUserForm(false);
    
    // Show processing overlay
    setIsProcessing(true);
    
    // Simulate booking processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 2000);
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="booking-glass-card1"
      >
        <div className="glass-header">
          <button className="nav-btn11" style={{borderRadius: '100px',margin:'5px'}} onClick={() => navigate(-1)}>BACK</button>
          <div className="status-light"><span></span> SYSTEM ACTIVE</div>
        </div>

        <div className="main-content1">
          <div className="visual-panel1">
            {/* <div className="car-id">REF: #CAR-{car.id}00X</div> */}
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
            </motion.div>)}
            </div>
            <div className="car-info-box" style={{marginTop: '10px'}}>
              <h2>{car.name} <br/><span>{car.model}</span></h2>
              {/* <div className="price-tag-neon1">₹{car.dailyRate} <small>/24H</small></div> */}
            </div>
          </div>

          <div className="interface-panel1">
            <h3 className="panel-title">Confirm Booking Details</h3>
            
            <div className="control-group">
              <label>PICKUP </label>
              <div className="input-row">
                <input 
                 id="pickup-date"
                  type="date" 
                  color="black"
                  className="neo-input" 
                  onChange={(e)=>setBooking({...booking, startDate: e.target.value})} 
                  style={{color:'black'}}
                  required
                />
                {/* <input 
                  type="time" 
                  className="neo-input time" 
                  onChange={(e)=>setBooking({...booking, startTime: e.target.value})} 
                  style={{color:'black'}}
                  required
                /> */}
              </div>
            </div>

            <div className="control-group">
              <label>RETURN </label>
              <div className="input-row">
                <input 
                  type="date" 
                  className="neo-input" 
                  onChange={(e)=>setBooking({...booking, endDate: e.target.value})} 
                  style={{color:'black'}}
                  required
                />
                {/* <input 
                  type="time" 
                  className="neo-input time" 
                  onChange={(e)=>setBooking({...booking, endTime: e.target.value})} 
                  style={{color:'black'}}
                  required
                /> */}
              </div>
            </div>

            {/* <div className="calculation-module">
              <div className="calc-row">
                <span>Unit Price</span>
                <span>₹{car.dailyRate}</span>
              </div>
              <div className="calc-row">
                <span>Time Delta</span>
                <span>{total/car.dailyRate || 0} Days</span>
              </div>
              <div className="total-display">
                <label>TOTAL COST</label>
                <div className="amount">₹{total || car.dailyRate}</div>
              </div>
            </div> */}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="execute-btn"
              onClick={handleBooking}
              disabled={!booking.startDate || !booking.endDate}
            >
              INITIALIZE BOOKING
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {/* User Data Form Modal */}
        {showUserForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modern-modal-overlay2"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modern-modal-container2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modern-modal-content2">
                {/* Animated Background */}
                <div className="modal-bg-shapes2">
                  <div className="shape shape-1"></div>
                  <div className="shape shape-2"></div>
                  <div className="shape shape-3"></div>
                </div>
                
                {/* Header */}
                <div className="modal-header">
                  <h2 className="modal-title2">Complete Your Booking</h2>
                  <button 
                    className="modal-close-btn"
                    onClick={() => setShowUserForm(false)}
                  >
                    <span style={{paddingBottom: '5px'}}>×</span>
                  </button>
                </div>


                {/* Form */}
                <form onSubmit={handleUserFormSubmit} className="modern-form">
                  <div className="form-group floating-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      required
                      className="floating-input"
                      placeholder=" "
                    />
                    <label htmlFor="name" className="floating-label">Your Name</label>
                    <div className="input-underline"></div>
                  </div>

                  <div className="form-group floating-group">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      required
                      className="floating-input"
                      placeholder=" "
                    />
                    <label htmlFor="phone" className="floating-label">Phone Number</label>
                    <div className="input-underline"></div>
                  </div>

                  <div className="form-group floating-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="floating-input"
                      placeholder=" "
                    />
                    <label htmlFor="email" className="floating-label">Email Address</label>
                    <div className="input-underline"></div>
                  </div>

                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>Confirm Booking</span>
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
            </motion.div>
          </motion.div>
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

              <button className="back-home-btn" onClick={() => navigate('/Payment')}>
          PAY & EXIT
              </button>
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
  );
};

export default BookingPage;