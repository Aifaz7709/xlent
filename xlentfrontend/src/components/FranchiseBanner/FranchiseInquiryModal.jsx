import React, { useState } from 'react';
import { X, Send, MapPin, Briefcase, IndianRupee, User, Phone, Mail } from 'lucide-react';

const FranchiseInquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    investment: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Franchise Lead Data:", formData);
    // Add your API logic here
    alert("Thank you for your interest! Our expansion team will contact you shortly.");
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <div className="row g-0">
            
            {/* Left Side: Info (Hidden on small screens) */}
            <div className="col-lg-4 d-none d-lg-flex flex-column justify-content-center p-5 text-white" 
                 style={{ background: 'linear-gradient(135deg, rgb(61, 103, 241) 0%, #1b129f 100%)' }}>
              <h3 className="fw-bold mb-4">Start Your Journey</h3>
              <p className="opacity-75 mb-4">Join Xlentcar and become a part of the mobility revolution in India.</p>
              
              <ul className="list-unstyled small">
                <li className="mb-3 d-flex align-items-center gap-2">
                  <Briefcase size={18} /> 100% Operations Support
                </li>
                <li className="mb-3 d-flex align-items-center gap-2">
                  <MapPin size={18} /> Choice of Territory
                </li>
                <li className="mb-0 d-flex align-items-center gap-2">
                  <IndianRupee size={18} /> High ROI Potential
                </li>
              </ul>
            </div>

            {/* Right Side: Form */}
            <div className="col-lg-8 bg-white p-4 p-lg-5 position-relative">
              <button 
                onClick={onClose}
                className="btn position-absolute top-0 end-0 m-3 text-muted hover-rotate"
                style={{ border: 'none', background: 'none' }}
              >
                <X size={24} />
              </button>

              <h2 className="h4 fw-bold text-dark mb-4">Franchise Inquiry</h2>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><User size={16}/></span>
                      <input type="text" className="form-control bg-light border-0" required 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Phone size={16}/></span>
                      <input type="tel" className="form-control bg-light border-0" required 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">City of Interest</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><MapPin size={16}/></span>
                      <input type="text" className="form-control bg-light border-0" required 
                        onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Investment Capacity</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><IndianRupee size={16}/></span>
                      <select className="form-select bg-light border-0" required
                        onChange={(e) => setFormData({...formData, investment: e.target.value})}>
                        <option value="">Select Range</option>
                        <option value="10-20L">10L - 20L</option>
                        <option value="20-50L">20L - 50L</option>
                        <option value="50L+">50L +</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Additional Details</label>
                    <textarea className="form-control bg-light border-0" rows="3" 
                      placeholder="Tell us about your current business or background..."
                      onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" 
                      style={{ borderRadius: '12px', backgroundColor: '#1b129f' }}>
                      Submit Application <Send size={18} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseInquiryModal;