import React, { useState, useEffect } from 'react';
import { Clock, LogIn, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SNOOZE_KEY = 'xlent_trial_snooze';

const TrialExpiredModal = ({ show, timeRemaining }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show modal when trial expires, but respect snooze stored in localStorage
  useEffect(() => {
    if (!show || timeRemaining > 0) return;

    const snooze = parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10);
    const now = Date.now();

    // If snoozed and still within snooze period, do not show
    if (snooze && now < snooze) {
      console.log('TrialExpiredModal: Snoozed until', new Date(snooze).toISOString());
      setIsVisible(false);
      return;
    }

    // Otherwise show modal
    setIsVisible(true);
  }, [show, timeRemaining]);

  // Poll to re-show modal when snooze expires
  useEffect(() => {
    if (!show || timeRemaining > 0) return;

    const interval = setInterval(() => {
      const snooze = parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10);
      const now = Date.now();
      if (snooze && now >= snooze) {
        // Clear snooze so modal can show
        localStorage.removeItem(SNOOZE_KEY);
        setIsVisible(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [show, timeRemaining]);

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // Snooze for 5 minutes
    const snoozeUntil = Date.now() + 5 * 60 * 1000;
    localStorage.setItem(SNOOZE_KEY, snoozeUntil.toString());
    setIsVisible(false);
    console.log('TrialExpiredModal: Snoozed until', new Date(snoozeUntil).toISOString());
  };

  // Do not render if trial not expired or modal hidden
  if (!show || timeRemaining > 0 || !isVisible) return null;

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'auto'
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        style={{ 
          maxWidth: '500px', 
          width: '90%', 
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          margin: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          style={{ 
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
          aria-label="Close modal"
        >
          <X size={24} color="#333" strokeWidth={2} />
        </button>

        <div style={{ padding: '40px 30px', textAlign: 'center', paddingTop: '50px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Clock size={48} color="rgb(2, 40, 124)" style={{ display: 'inline-block', marginBottom: '15px' }} />
          </div>
          
          <h4 style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px', fontSize: '20px' }}>
            Free Trial Expired
          </h4>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
            Your 10-minute free trial has ended. Please log in to continue browsing our amazing car rental options.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              to="/login"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                padding: '12px 20px',
                background: 'rgb(2, 40, 124)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <LogIn size={18} style={{ marginRight: '8px' }} />
              Log In
            </Link>
            <Link 
              to="/register"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                padding: '12px 20px',
                background: 'white',
                color: 'rgb(2, 40, 124)',
                border: '2px solid rgb(2, 40, 124)',
                textDecoration: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Sign Up
            </Link>
            <button
              type="button"
              onClick={handleClose}
              style={{ 
                padding: '12px 20px',
                background: 'none',
                color: '#666',
                border: 'none',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Continue Browsing (Remind me in 5 mins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredModal;
