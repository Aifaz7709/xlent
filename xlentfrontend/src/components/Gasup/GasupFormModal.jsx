// GasupFormModal.jsx
import React from "react";
import "./AutomateForm.css"

const GasupFormModal = ({ onClose }) => {
  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <iframe
          src="https://app.gasup.ai/widget/form/ao6hNzF1xcJ6ZNjcL6Uk"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Book Your Ride"
        />
      </div>
    </div>
  );
};

export default GasupFormModal;
