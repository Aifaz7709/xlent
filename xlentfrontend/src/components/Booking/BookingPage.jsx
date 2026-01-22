import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingPage.css";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  const [booking, setBooking] = useState({
    startDate: "", startTime: "10:00",
    endDate: "", endTime: "10:00"
  });
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
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
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 2500);
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
          <button className="nav-btn" onClick={() => navigate(-1)}>BACK</button>
          <div className="status-light"><span></span> SYSTEM ACTIVE</div>
        </div>

        <div className="main-content1">
          <div className="visual-panel1">
            <div className="car-id">REF: #CAR-{car.id}00X</div>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              className="hologram-container1"
            >
              <div className="car-glow"></div>
              <span className="big-emoji">🚗</span>
            </motion.div>
            <div className="car-info-box">
              <h2>{car.name} <br/><span>{car.model}</span></h2>
              <div className="price-tag-neon1">₹{car.dailyRate} <small>/24H</small></div>
            </div>
          </div>

          <div className="interface-panel1">
            <h3 className="panel-title">Confirm Booking Details</h3>
            
            <div className="control-group">
              <label>PICKUP </label>
              <div className="input-row">
                <input type="date" className="neo-input" onChange={(e)=>setBooking({...booking, startDate: e.target.value})} style={{color:'black'}}/>
                <input type="time" className="neo-input time" onChange={(e)=>setBooking({...booking, startTime: e.target.value})} style={{color:'black'}}/>
              </div>
            </div>

            <div className="control-group">
              <label>RETURN </label>
              <div className="input-row">
                <input type="date" className="neo-input" onChange={(e)=>setBooking({...booking, endDate: e.target.value})} style={{color:'black'}}/>
                <input type="time" className="neo-input time" onChange={(e)=>setBooking({...booking, endTime: e.target.value})} style={{color:'black'}}/>
              </div>
            </div>

            <div className="calculation-module">
              <div className="calc-row"><span>Unit Price</span><span>₹{car.dailyRate}</span></div>
              <div className="calc-row"><span>Time Delta</span><span>{total/car.dailyRate || 0} Days</span></div>
              <div className="total-display">
                <label>TOTAL COST</label>
                <div className="amount">₹{total || car.dailyRate}</div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="execute-btn"
              onClick={handleBooking}
            >
              INITIALIZE BOOKING
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="system-overlay">
            <div className="scanner-line"></div>
            <div className="loading-text">Almost Done...</div>
          </motion.div>
        )}

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
                <p>VEHICLE <span>{car.name}</span></p>
                <p>PICKUP <span>{booking.startDate || 'TBD'}</span></p>
                <p>TIME <span>{booking.startTime}</span></p>
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
    </div>
  );
};

export default BookingPage;