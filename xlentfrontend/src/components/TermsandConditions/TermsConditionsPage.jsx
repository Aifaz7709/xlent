import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Shield,
  AlertCircle,
  Clock,
  Car,
  CreditCard,
  CheckCircle,
  Upload,
  X,
  Eye,
  FileCheck,
  Lock,
  UserCheck,
  ThumbsUp
} from 'lucide-react';
import './Terms.css'
import Footer from '../Footer/Footer';
const TermsConditionsPage = () => {
  const [agreementText, setAgreementText] = useState('');
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [files, setFiles] = useState({
    drivingLicense: null,
    aadhaarFront: null,
    aadhaarBack: null
  });

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!agreeChecked || agreementText !== 'I AGREE') {
      alert('Please type "I AGREE" and check the confirmation box');
      return;
    }

    if (!files.drivingLicense || !files.aadhaarFront || !files.aadhaarBack) {
      alert('Please upload all required documents');
      return;
    }

    // Process form submission
    alert('Terms accepted! Proceeding to payment...');
    // Here you would typically handle form submission to backend
  };

  const terms = [
    {
      icon: <CreditCard size={20} className="text-primary" />,
      title: "Advance Payment",
      content: "A 50% advance amount is required to book a vehicle. The advance amount is non-refundable after payment."
    },
    {
      icon: <Car size={20} className="text-primary" />,
      title: "Driving Conduct",
      content: "Do not drink and drive in the rented vehicle. The remaining balance must be cleared at the time of vehicle pickup."
    },
    {
      icon: <UserCheck size={20} className="text-primary" />,
      title: "Vehicle Pickup Requirements",
      content: "Present your original Driving License and PAN card. Make a two-wheeler deposit as per company policy."
    },
    {
      icon: <AlertCircle size={20} className="text-primary" />,
      title: "Damage Liability",
      content: "Any scratches, dents, or damages to the vehicle will be charged and must be paid immediately."
    },
    {
      icon: <Clock size={20} className="text-primary" />,
      title: "Speed Limit Policy",
      content: "The speed limit is 100 km/h. Exceeding this limit will result in a one-time charge of ₹1000."
    },
    {
      icon: <Clock size={20} className="text-primary" />,
      title: "Extra Hours Policy",
      content: "Extra hours beyond the agreed rental time will be charged at ₹400 per hour."
    },
    {
      icon: <Shield size={20} className="text-primary" />,
      title: "Safety & Driving Rules",
      content: "Seat belts are compulsory for all passengers. No rash driving is allowed."
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
    

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Agreement Header */}
            <div className="text-center mb-5">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                <FileText size={48} className="text-primary" />
              </div>
              <h1 className="display-6 fw-bold text-dark mb-3">
                Xlentcar Car Rental Agreement
              </h1>
              <div className="alert alert-primary d-inline-flex align-items-center px-4 py-2">
                <CreditCard size={20} className="me-2" />
                <span className="fw-bold">Booking Advance Amount: ₹500.00</span>
              </div>
            </div>

            {/* Introduction */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="alert alert-info border-0">
                  <p className="mb-0 fw-semibold">
                    By submitting this form and agreeing to the terms below, you acknowledge that you have read, 
                    understood, and agree to abide by the rules and conditions of Xlentcar's car rental services.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="card border-0 shadow-sm mb-5">
              <div className="card-header bg-primary text-white">
                <h3 className="h4 mb-0">
                  <FileText size={20} className="me-2" />
                  Rules and Regulations
                </h3>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {terms.map((term, index) => (
                    <div key={index} className="col-12 col-md-6">
                      <div className="d-flex">
                        <div className="me-3 mt-1">
                          {term.icon}
                        </div>
                        <div>
                          <h5 className="h6 text-dark fw-bold mb-2">
                            {index + 1}. {term.title}
                          </h5>
                          <p className="text-muted mb-0">{term.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agreement Form */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="h4 mb-0">
                  <FileCheck size={20} className="me-2" />
                  Agreement Acknowledgment
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Agreement Confirmation */}
                  <div className="mb-4">
                    <div className="alert alert-warning">
                      <p className="mb-0 fw-semibold">
                        By continuing, you confirm that you have read and understood the above terms and conditions, 
                        and you agree to comply with them throughout the rental period.
                      </p>
                    </div>
                  </div>

                  {/* Type I AGREE */}
                  <div className="mb-4">
                    <label htmlFor="agreementText" className="form-label fw-bold">
                      Please Type "I AGREE" Below to Confirm: *
                    </label>
                    <input
                      type="text"
                      id="agreementText"
                      className={`form-control form-control-lg ${agreementText === 'I AGREE' ? 'is-valid' : agreementText && 'is-invalid'}`}
                      value={agreementText}
                      onChange={(e) => setAgreementText(e.target.value.toUpperCase())}
                      placeholder="Type I AGREE here..."
                      required
                    />
                    <div className="form-text">
                      Must type exactly "I AGREE" in capital letters
                    </div>
                    {agreementText === 'I AGREE' && (
                      <div className="valid-feedback d-flex align-items-center">
                        <CheckCircle size={16} className="me-2" />
                        Agreement text confirmed
                      </div>
                    )}
                    {agreementText && agreementText !== 'I AGREE' && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle size={16} className="me-2" />
                        Please type exactly "I AGREE"
                      </div>
                    )}
                  </div>

                  {/* Documents Upload Section */}
                  <div className="mb-5">
                    <h5 className="h6 fw-bold mb-4">Required Documents *</h5>
                    
                    {/* Driving License */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Driving License: *
                      </label>
                      <div className="border rounded p-3">
                        {!files.drivingLicense ? (
                          <div className="text-center py-4">
                            <label htmlFor="drivingLicense" className="btn btn-outline-primary btn-lg cursor-pointer">
                              <Upload size={20} className="me-2" />
                              Upload Driving License
                            </label>
                            <input
                              type="file"
                              id="drivingLicense"
                              className="d-none"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileUpload(e, 'drivingLicense')}
                            />
                            <p className="text-muted small mt-2 mb-0">
                              Accepted formats: JPG, PNG, PDF (Max 5MB)
                            </p>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <FileText size={24} className="text-primary me-3" />
                              <div>
                                <div className="fw-bold">{files.drivingLicense.name}</div>
                                <div className="text-muted small">
                                  {(files.drivingLicense.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile('drivingLicense')}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Aadhaar Card Front */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Aadhaar Card (Front): *
                      </label>
                      <div className="border rounded p-3">
                        {!files.aadhaarFront ? (
                          <div className="text-center py-4">
                            <label htmlFor="aadhaarFront" className="btn btn-outline-primary btn-lg cursor-pointer">
                              <Upload size={20} className="me-2" />
                              Upload Aadhaar Front
                            </label>
                            <input
                              type="file"
                              id="aadhaarFront"
                              className="d-none"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileUpload(e, 'aadhaarFront')}
                            />
                            <p className="text-muted small mt-2 mb-0">
                              Clear image of Aadhaar card front side
                            </p>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <FileText size={24} className="text-primary me-3" />
                              <div>
                                <div className="fw-bold">{files.aadhaarFront.name}</div>
                                <div className="text-muted small">
                                  {(files.aadhaarFront.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile('aadhaarFront')}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Aadhaar Card Back */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Aadhar Card (Back): *
                      </label>
                      <div className="border rounded p-3">
                        {!files.aadhaarBack ? (
                          <div className="text-center py-4">
                            <label htmlFor="aadhaarBack" className="btn btn-outline-primary btn-lg cursor-pointer">
                              <Upload size={20} className="me-2" />
                              Upload Aadhaar Back
                            </label>
                            <input
                              type="file"
                              id="aadhaarBack"
                              className="d-none"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileUpload(e, 'aadhaarBack')}
                            />
                            <p className="text-muted small mt-2 mb-0">
                              Clear image of Aadhaar card back side
                            </p>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <FileText size={24} className="text-primary me-3" />
                              <div>
                                <div className="fw-bold">{files.aadhaarBack.name}</div>
                                <div className="text-muted small">
                                  {(files.aadhaarBack.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile('aadhaarBack')}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="finalAgreement"
                        checked={agreeChecked}
                        onChange={(e) => setAgreeChecked(e.target.checked)}
                        required
                      />
                      <label className="form-check-label fw-semibold" htmlFor="finalAgreement">
                        I hereby confirm that all information provided is true and accurate. 
                        I understand that providing false information may result in cancellation 
                        of my booking and forfeiture of the advance amount.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3"
                      disabled={!agreeChecked || agreementText !== 'I AGREE' || 
                               !files.drivingLicense || !files.aadhaarFront || !files.aadhaarBack}
                    >
                      <ThumbsUp size={20} className="me-2" />
                      Accept Terms & Proceed to Payment (₹500)
                    </button>
                    <Link to="/" className="btn btn-outline-secondary">
                      Cancel and Return Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-4">
              <div className="alert alert-light border">
                <h6 className="fw-bold mb-3">
                  <AlertCircle size={18} className="me-2 text-warning" />
                  Important Notes:
                </h6>
                <ul className="mb-0 ps-3">
                  <li className="mb-2">The ₹500 advance will be adjusted against your final rental charges</li>
                  <li className="mb-2">Documents will be verified at the time of vehicle pickup</li>
                  <li className="mb-2">Original documents must be presented during vehicle pickup</li>
                  <li>For any queries, contact our support at +91 86828 *****</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default TermsConditionsPage;