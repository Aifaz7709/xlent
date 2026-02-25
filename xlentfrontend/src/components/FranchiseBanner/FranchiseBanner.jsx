import React, { useState } from 'react';
import { 
  Building2, 
  Handshake, 
  Coins, 
  Zap, 
  ArrowRight 
} from "lucide-react";
import FranchiseInquiryModal from "./FranchiseInquiryModal";

const FranchiseBanner = ({ onContactClick }) => {
  const benefits = [
    { icon: <Building2 size={24} />, title: "Proven Model", desc: "Established framework" },
    { icon: <Coins size={24} />, title: "High ROI", desc: "Attractive margins" },
    { icon: <Handshake size={24} />, title: "Full Support", desc: "Marketing & Ops" },
    { icon: <Zap size={24} />, title: "Tech Access", desc: "Proprietary platform" }
  ];
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  return (
    <div className="py-5" style={{background: 'linear-gradient(303deg, #1b129f 0%,rgb(78, 68, 219) 100%)', overflow: 'hidden', margin: '15px', borderRadius: '25px'  }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 text-white">
            
            {/* Header Section with Button on the Right */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-4">
              <div className="max-w-md">
                <h2 className="display-5 fw-bold mb-2 text-info">
                  Partner with <span style={{ color: 'white' }}>Xlentcar</span>
                </h2>
                <p className="lead mb-0 opacity-90">
                  Join India's fastest-growing car rental network and expand our footprint.
                </p>
              </div>

              <div className="flex-shrink-0">
                <button 
                  className="btn btn-info btn-lg px-3 py-3 fw-bold shadow-lg d-flex align-items-center gap-1"
                  onClick={() => setShowFranchiseModal(true)}                  style={{ borderRadius: '15px' , backgroundColor:'transparent', color: 'white'}}
                >
                  Inquire for Franchise <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <hr className="opacity-25 mb-5" />

            {/* Benefits Grid */}
            <div className="row g-4">
              {benefits.map((item, index) => (
                <div key={index} className="col-6 col-lg-3">
                  <div className="d-flex align-items-start">
                    <div className="text-info me-3">{item.icon}</div>
                    <div>
                      <h5 className="h6 mb-1 fw-bold">{item.title}</h5>
                      <p className="small opacity-75 mb-0">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      {showFranchiseModal && (
  <FranchiseInquiryModal 
    isOpen={showFranchiseModal} 
    onClose={() => setShowFranchiseModal(false)} 
  />
)}
    </div>
  );
};

export default FranchiseBanner;