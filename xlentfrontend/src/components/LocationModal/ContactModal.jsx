import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Star, Car, Bike, Clock, Shield, Zap, MessageCircle, ChevronRight 
} from 'lucide-react';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(4.5);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="contact-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="contact-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="contact-modal-close"
          >
            <X size={20} />
          </motion.button>

          {/* Header */}
          <div className="contact-modal-header">
            <div className="contact-modal-title-section">
              <h2 className="contact-modal-title">
                Need Help? Call Our
                <span className="contact-modal-gradient">Booking Experts!</span>
              </h2>
            </div>

            {/* Call CTA */}
            <div className={`contact-modal-call-cta ${pulse ? 'contact-modal-pulse' : ''}`}>
              <div className="row align-items-center">
                <div className="col-12 col-md-8 mb-3 mb-md-0">
                  <div className="d-flex align-items-center flex-wrap">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="contact-modal-phone-icon"
                    >
                      <Phone size={24} />
                    </motion.div>
                    <div className="ms-3">
                      <p className="contact-modal-subtitle mb-1">Call Now for Instant Booking</p>
                      <h3 className="contact-modal-number mb-0">+91 86828 44516</h3>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="tel:+918682844516"
                    className="contact-modal-call-btn"
                  >
                    <Phone size={18} className="me-2" />
                    Call Now
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="contact-modal-content">
            {/* Rating Section */}
            <div className="contact-modal-rating">
              <div className="row align-items-center">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <h5 className="contact-modal-rating-title">Your Experience Matters</h5>
                  <p className="contact-modal-rating-subtitle">Rate our service to help us improve</p>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-3">
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="contact-modal-star-btn"
                        >
                          <Star
                            size={24}
                            className={star <= rating ? 'contact-modal-star-filled' : 'contact-modal-star-empty'}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="contact-modal-rating-value">{rating.toFixed(1)}</div>
                      <div className="contact-modal-rating-outof">/ 5.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="contact-modal-footer">
              <div className="row align-items-center">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <p className="contact-modal-copyright">
                    © 2025 XLentCar. All rights reserved.
                  </p>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="contact-modal-secondary-btn"
                      onClick={onClose}
                    >
                      Close
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://wa.me/918682844516"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-modal-whatsapp-btn"
                    >
                      WhatsApp Us
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;