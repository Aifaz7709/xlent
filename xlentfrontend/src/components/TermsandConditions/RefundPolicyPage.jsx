// RefundPolicyPage.jsx
import React, { useState } from 'react';
import './PolicyPages.css'; // Shared styling

const RefundPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('');

  const refundData = [
    {
      id: 'overview',
      title: "Overview",
      content: "This Refund Policy outlines the circumstances under which refunds are provided for bookings made through XlentCar. This policy applies to all users (Guests, Hosts, and Dealers).",
      details: [
        "All refunds are processed in accordance with this policy and applicable laws.",
        "Refund eligibility depends on timing, reason for cancellation, and user type.",
        "XlentCar acts as an intermediary; final refund decisions involve both parties."
      ]
    },
    {
      id: 'guest-cancellations',
      title: "Guest Cancellation Refunds",
      content: "Refund amounts for guest-initiated cancellations depend on notice period:",
      table: {
        headers: ["Cancellation Time", "Refund Amount", "Service Fee", "Conditions"],
        rows: [
          ["More than 48 hours before pickup", "100% of rental amount", "Non-refundable", "Full refund excluding service fee"],
          ["24 to 48 hours before pickup", "50% of rental amount", "Non-refundable", "Half refund excluding service fee"],
          ["Less than 24 hours before pickup", "0% (No refund)", "Non-refundable", "No refund for last-minute cancellation"],
          ["No-show at pickup", "0% (No refund)", "Non-refundable", "Vehicle released after 1 hour wait"]
        ]
      },
      details: [
        "All cancellations must be made through the XlentCar platform/app.",
        "Refunds processed within 7-10 business days to original payment method.",
        "Service fees are always non-refundable once charged.",
        "Partial day rentals are not eligible for partial refunds."
      ]
    },
    {
      id: 'host-cancellations',
      title: "Host/Dealer Cancellations",
      content: "When Hosts/Dealers cancel confirmed bookings:",
      details: [
        "Full refund including service fee to guest.",
        "XlentCar will assist in finding alternative vehicles.",
        "Repeated cancellations may lead to host penalties:",
        "• First cancellation: Warning",
        "• Second cancellation: 15% penalty of booking value",
        "• Third cancellation: Temporary suspension",
        "• Multiple cancellations: Permanent removal from platform"
      ]
    },
    {
      id: 'vehicle-issues',
      title: "Vehicle Condition Issues",
      content: "Refunds due to vehicle condition or delivery issues:",
      details: [
        "Vehicle not as described: Full refund if vehicle differs significantly from listing.",
        "Vehicle not delivered: Full refund if host fails to deliver at agreed time/location.",
        "Vehicle breakdown: Pro-rata refund for unused rental period.",
        "Safety concerns: Full refund if vehicle deemed unsafe by XlentCar support.",
        "Required evidence: Photos, videos, or verification by XlentCar team."
      ]
    },
    {
      id: 'security-deposit',
      title: "Security Deposit Refunds",
      content: "Security deposits are refunded after rental completion:",
      details: [
        "Processing Time: 7-10 business days after vehicle return.",
        "Deductions: For damages, traffic fines, tolls, fuel shortfall, or cleaning fees.",
        "Notification: Detailed breakdown of any deductions provided.",
        "Disputes: Raise within 24 hours of receiving deduction notification.",
        "Clean Return: Full deposit refund if vehicle returned as per agreement."
      ]
    },
    {
      id: 'non-refundable',
      title: "Non-Refundable Situations",
      content: "No refunds will be provided in the following cases:",
      details: [
        "After trip commencement (once vehicle is picked up).",
        "For unused days in a multi-day booking if trip started.",
        "For weather conditions, natural disasters, or force majeure events.",
        "For change of plans or personal emergencies after trip start.",
        "If guest provides false information or invalid documents.",
        "For traffic fines, penalties, or violations during rental.",
        "For vehicle misuse, rule violations, or illegal activities.",
        "If vehicle is returned early without prior agreement."
      ]
    },
    {
      id: 'force-majeure',
      title: "Force Majeure Events",
      content: "Special considerations for uncontrollable events:",
      details: [
        "Definition: Natural disasters, government restrictions, pandemics, strikes, wars.",
        "Refund Policy: At host's discretion; XlentCar may mediate.",
        "Documentation: Official proof required (govt. orders, medical certificates).",
        "Travel Restrictions: No refunds unless host agrees or platform policy applies.",
        "Communication: Notify XlentCar support immediately with evidence."
      ]
    },
    {
      id: 'extension-refunds',
      title: "Extensions and Modifications",
      content: "Policy for booking extensions and modifications:",
      details: [
        "Extensions: Subject to vehicle availability and host approval.",
        "Rate Changes: Extended period charged at current rates.",
        "Modifications: Changes to booking dates/times treated as cancellation + new booking.",
        "Downgrades: No refund for moving to cheaper vehicle category.",
        "Upgrades: Pay difference for higher category vehicles."
      ]
    },
    {
      id: 'refund-process',
      title: "Refund Processing",
      content: "Steps involved in refund processing:",
      steps: [
        "Cancellation request submitted through platform.",
        "Automated calculation based on cancellation time.",
        "Approval by XlentCar (and host if applicable).",
        "Refund initiation to original payment method.",
        "Processing time: 7-10 business days for bank transfers.",
        "Notification sent via email and in-app notification."
      ]
    },
    {
      id: 'dispute-resolution',
      title: "Refund Disputes",
      content: "Process for resolving refund disputes:",
      details: [
        "Initial Resolution: Direct communication between guest and host.",
        "XlentCar Mediation: If unresolved, escalate to XlentCar support within 7 days.",
        "Evidence Required: Photos, messages, timestamps, payment receipts.",
        "Investigation: XlentCar reviews all evidence and communication.",
        "Decision: Final decision by XlentCar within 14 business days.",
        "Appeals: Limited to cases with new evidence."
      ]
    },
    {
      id: 'exceptions',
      title: "Special Cases and Exceptions",
      content: "Exceptions to standard refund policy:",
      details: [
        "Promotional Offers: May have different cancellation terms.",
        "Long-term Rentals: Custom agreements with different cancellation windows.",
        "Corporate Accounts: Subject to separate contractual terms.",
        "Loyalty Members: May receive enhanced refund benefits.",
        "Discretionary Refunds: At XlentCar's discretion for exceptional circumstances."
      ]
    },
    {
      id: 'fraud-prevention',
      title: "Fraud Prevention",
      content: "Measures to prevent refund fraud:",
      details: [
        "Verification: Identity and document verification before refund processing.",
        "Pattern Detection: Monitoring for suspicious cancellation patterns.",
        "Account Review: Accounts with multiple refund requests may be investigated.",
        "Legal Action: Fraudulent claims may lead to account termination and legal proceedings.",
        "Reporting: Suspected fraud should be reported to support@XlentCar.in"
      ]
    },
    {
      id: 'contact',
      title: "Contact for Refund Queries",
      content: "For refund-related inquiries:",
      details: [
        "Email: refunds@XlentCar.in (for queries only, not for cancellation requests)",
        "In-app Support: Use support chat for faster resolution",
        "Response Time: 24-48 hours for initial response",
        "Working Hours: 9 AM - 6 PM IST, Monday to Saturday",
        "Escalation: If unresolved, contact grievance officer"
      ]
    }
  ];

  return (
    <div className="policy-page container py-5">
      <div className="row">
        {/* Navigation Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm sticky-sidebar">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3 text-danger">
                <i className="bi bi-cash-coin me-2"></i>
                Refund Policy
              </h5>
              
              <div className="nav flex-column" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {refundData.map((section) => (
                  <button
                    key={section.id}
                    className={`nav-link text-start mb-2 ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      const element = document.getElementById(section.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-currency-rupee me-2 small"></i>
                      <span className="small">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className="alert alert-warning small p-2">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  <strong>Note:</strong> Refunds take 7-10 business days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-danger mb-3">
                  <i className="bi bi-cash-coin me-2"></i>
                  Refund & Cancellation Policy
                </h1>
                <p className="lead">XlentCar India Private Limited</p>
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-octagon me-2"></i>
                  <strong>Important:</strong> Please read this policy carefully before booking. 
                  Cancellation charges apply as per timelines below.
                </div>
              </div>

              {/* Quick Summary */}
              <div className="alert alert-info mb-5">
                <h5 className="fw-bold">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Quick Summary
                </h5>
                <div className="row mt-3">
                  <div className="col-md-4 text-center">
                    <div className="p-3 bg-light rounded">
                      <div className="text-success fw-bold">100% Refund</div>
                      <div className="small">48 hours before pickup</div>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="p-3 bg-light rounded">
                      <div className="text-warning fw-bold">50% Refund</div>
                      <div className="small">24-48 hours before pickup</div>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="p-3 bg-light rounded">
                      <div className="text-danger fw-bold">No Refund</div>
                      <div className="small"> 24 hours before pickup</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Content */}
              <div className="policy-content">
                {refundData.map((section) => (
                  <section 
                    key={section.id}
                    id={section.id}
                    className="policy-section mb-5 pb-4 border-bottom"
                  >
                    <h2 className="h4 fw-bold mb-3 text-danger">
                      <i className="bi bi-dot me-1"></i>
                      {section.title}
                    </h2>
                    <p className="mb-3">{section.content}</p>
                    
                    {section.table && (
                      <div className="table-responsive mb-4">
                        <table className="table table-bordered table-hover">
                          <thead className="table-danger">
                            <tr>
                              {section.table.headers.map((header, index) => (
                                <th key={index}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.steps && (
                      <div className="steps ps-4 mb-3">
                        {section.steps.map((step, index) => (
                          <div key={index} className="mb-2">
                            <span className="badge bg-danger me-2">{index + 1}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.details && section.details.length > 0 && (
                      <div className="details ps-4">
                        {section.details.map((detail, index) => (
                          <div key={index} className="mb-2">
                            <i className="bi bi-dash-circle text-secondary me-2"></i>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Important Notice */}
              <div className="mt-5 pt-4 border-top">
                <div className="alert alert-warning">
                  <h4 className="alert-heading">
                    <i className="bi bi-megaphone me-2"></i>
                    Important Notice
                  </h4>
                  <p>
                    This refund policy is part of our Terms and Conditions. XlentCar reserves 
                    the right to modify this policy at any time. Users will be notified of 
                    significant changes. Continued use of our services constitutes acceptance 
                    of the updated policy.
                  </p>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">For Cancellations:</h6>
                      <p className="small mb-0">Use the XlentCar app/website only</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">For Refund Status:</h6>
                      <p className="small mb-0">Check 'My Bookings' section in app</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div>
                  <a href="mailto:refunds@XlentCar.in" className="btn btn-danger">
                    <i className="bi bi-envelope me-2"></i>
                    Email Refund Team
                  </a>
                </div>
                <div className="text-muted small">
                  Policy ID: RP-{new Date().getFullYear()}-{new Date().getMonth() + 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;