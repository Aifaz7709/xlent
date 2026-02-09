import React, { useState, useEffect, createContext, useContext } from 'react';
import './Snackbar.css';

// Create a context for snackbar management
const SnackbarContext = createContext();

// Base color and derived colors
const BASE_COLOR = 'rgb(2, 40, 124)';
const COLOR_VARIANTS = {
  default: BASE_COLOR,
  success: 'rgb(15, 110, 15)',
  error: 'rgb(180, 10, 10)',
  warning: 'rgb(180, 100, 10)',
  info: 'rgb(10, 100, 180)'
};

// Snackbar Provider Component
export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const addSnackbar = (message, type = 'default', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newSnackbar = {
      id,
      message,
      type,
      duration
    };
    
    setSnackbars(prev => [...prev, newSnackbar]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeSnackbar(id);
    }, duration);
    
    return id;
  };

  const removeSnackbar = (id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  };

  const showSuccess = (message, duration) => {
    return addSnackbar(message, 'success', duration);
  };

  const showError = (message, duration) => {
    return addSnackbar(message, 'error', duration);
  };

  const showWarning = (message, duration) => {
    return addSnackbar(message, 'warning', duration);
  };

  const showInfo = (message, duration) => {
    return addSnackbar(message, 'info', duration);
  };

  const showDefault = (message, duration) => {
    return addSnackbar(message, 'default', duration);
  };

  return (
    <SnackbarContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showDefault,
      removeSnackbar
    }}>
      {children}
      <div className="snackbar-container">
        {snackbars.map(snackbar => (
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => removeSnackbar(snackbar.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

// Individual Snackbar Component
const Snackbar = ({ message, type = 'default', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / 5000) * 50; // Update every 50ms
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '●';
    }
  };

  return (
    <div className={`snackbar snackbar-${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="snackbar-icon">{getIcon()}</div>
      <div className="snackbar-content">
        <p>{message}</p>
      </div>
      <button className="snackbar-close" onClick={handleClose}>
        ×
      </button>
      <div 
        className="snackbar-progress" 
        style={{ 
          width: `${progress}%`,
          backgroundColor: COLOR_VARIANTS[type]
        }}
      ></div>
    </div>
  );
};

export default Snackbar;