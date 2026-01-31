// PrivacyPolicyPage.jsx
import React, { useState } from 'react';
import './PolicyPages.css'; // Shared styling
import Footer from '../Footer/Footer';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('');

  const privacyData = [
    {
      id: 'intro',
      title: "Introduction",
      content: `XlentCar India Private Limited ("XlentCar", "we", "us", "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, mobile application, and services.`,
      details: [
        "This policy complies with the Information Technology Act, 2000 and rules thereunder.",
        "By using XlentCar, you consent to the data practices described in this policy.",
        "If you do not agree with our policies, please do not use our services."
      ]
    },
    {
      id: 'data-collection',
      title: "Information We Collect",
      content: "We collect various types of information to provide and improve our services:",
      details: [
        "Personal Information: Name, email, phone number, address, date of birth",
        "Identity Documents: Aadhaar number, Driving License details, PAN (if applicable)",
        "Vehicle Information: For hosts/dealers - RC details, insurance, PUC certificate",
        "Financial Information: Payment details, bank account information, transaction history",
        "Technical Information: IP address, device information, browser type, operating system",
        "Usage Data: Booking history, search queries, preferences, location data",
        "Communication Data: Emails, chat logs, customer support queries",
        "Biometric Data: Facial recognition data (selfie) for verification purposes"
      ]
    },
    {
      id: 'collection-methods',
      title: "How We Collect Information",
      content: "We collect information through various methods:",
      details: [
        "Directly from you: When you register, create listings, make bookings, or contact support",
        "Automatically: Through cookies, log files, and analytics tools",
        "From third parties: Payment gateways, verification agencies, partners",
        "From device permissions: Location, camera, contacts (with your consent)",
        "From public sources: Publicly available information for verification"
      ]
    },
    {
      id: 'data-use',
      title: "How We Use Your Information",
      content: "We use your information for legitimate business purposes:",
      details: [
        "Service Delivery: To process bookings, facilitate payments, verify identities",
        "Security: To prevent fraud, unauthorized access, and ensure platform safety",
        "Communication: To send booking confirmations, updates, and service alerts",
        "Marketing: To send promotional offers (with your opt-in consent)",
        "Improvements: To analyze usage patterns and enhance user experience",
        "Legal Compliance: To comply with applicable laws, regulations, and legal requests",
        "Research: To conduct market research and develop new features",
        "Customer Support: To respond to inquiries and resolve disputes"
      ]
    },
    {
      id: 'data-sharing',
      title: "Information Sharing and Disclosure",
      content: "We may share your information in limited circumstances:",
      details: [
        "With Hosts/Guests: To facilitate bookings (contact details, driving license info)",
        "With Service Providers: Payment processors, verification agencies, cloud services",
        "With Authorities: When required by law, court order, or government request",
        "Business Transfers: In case of merger, acquisition, or asset sale",
        "With Consent: When you explicitly consent to sharing",
        "Anonymized Data: Aggregated, non-personal data for analytics and research"
      ]
    },
    {
      id: 'data-security',
      title: "Data Security",
      content: "We implement robust security measures to protect your information:",
      details: [
        "Encryption: SSL/TLS encryption for data transmission",
        "Access Controls: Role-based access to sensitive data",
        "Secure Storage: Industry-standard security for data storage",
        "Regular Audits: Security assessments and vulnerability testing",
        "Employee Training: Strict confidentiality obligations for staff",
        "Incident Response: Procedures for handling data breaches"
      ]
    },
    {
      id: 'data-retention',
      title: "Data Retention",
      content: "We retain your information only as long as necessary:",
      details: [
        "Active Accounts: Until account closure or 2 years of inactivity",
        "Legal Requirements: As required by applicable laws (minimum 5 years for financial records)",
        "Dispute Resolution: Until resolution of any ongoing disputes",
        "Marketing Data: Until consent withdrawal or account closure",
        "Deletion: Secure deletion or anonymization after retention period"
      ]
    },
    {
      id: 'user-rights',
      title: "Your Rights and Choices",
      content: "You have certain rights regarding your personal information:",
      details: [
        "Access: Right to know what information we hold about you",
        "Correction: Right to correct inaccurate or incomplete information",
        "Deletion: Right to request deletion of your personal data",
        "Portability: Right to receive your data in a structured format",
        "Consent Withdrawal: Right to withdraw marketing consent",
        "Opt-out: Right to opt-out of data collection for non-essential purposes",
        "Grievance: Right to file a complaint with the grievance officer"
      ]
    },
    {
      id: 'cookies',
      title: "Cookies and Tracking Technologies",
      content: "We use cookies and similar technologies:",
      details: [
        "Essential Cookies: Required for platform functionality",
        "Analytics Cookies: To understand usage patterns and improve services",
        "Marketing Cookies: For personalized advertising (with consent)",
        "Control Options: Browser settings to manage cookie preferences",
        "Do Not Track: We respect Do Not Track signals"
      ]
    },
    {
      id: 'children',
      title: "Children's Privacy",
      content: "Our services are not intended for children:",
      details: [
        "Age Restriction: Minimum age requirement of 18 years",
        "No Collection: We do not knowingly collect data from children",
        "Removal: If we discover child data, we delete it promptly",
        "Parental Consent: Required for any minor users (if applicable)"
      ]
    },
    {
      id: 'third-party',
      title: "Third-Party Links and Services",
      content: "Our platform may contain links to third-party services:",
      details: [
        "External Links: We are not responsible for third-party privacy practices",
        "Partner Services: Payment gateways, verification agencies",
        "Review Policies: Review third-party privacy policies before use",
        "No Endorsement: Links do not imply endorsement"
      ]
    },
    {
      id: 'updates',
      title: "Policy Updates",
      content: "We may update this privacy policy:",
      details: [
        "Notification: We will notify users of material changes",
        "Review: Regular review of policy recommended",
        "Acceptance: Continued use constitutes acceptance of updates",
        "Version Control: Date of last update displayed"
      ]
    },
    {
      id: 'contact',
      title: "Contact Information",
      content: "For privacy-related inquiries:",
      details: [
        "Grievance Officer: Mr. [Name], appointed under IT Rules",
        "Email: privacy@XlentCar.in",
        "Address: XlentCar India Private Limited, Bangalore, Karnataka",
        "Response Time: We aim to respond within 30 days"
      ]
    }
  ];

  return (<>
    <div className="policy-page container py-5">
      <div className="row">
        {/* Navigation Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm sticky-sidebar">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3 text-primary">
                <i className="bi bi-shield-check me-2"></i>
                Privacy Policy
              </h5>
              
              <div className="nav flex-column" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {privacyData.map((section) => (
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
                      <i className="bi bi-chevron-right me-2 small"></i>
                      <span className="small">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top">
                <p className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
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
                <h1 className="fw-bold text-primary mb-3">
                  <i className="bi bi-shield-check me-2"></i>
                  Privacy Policy
                </h1>
                <p className="lead">XlentCar India Private Limited</p>
                <div className="alert alert-info">
                  <i className="bi bi-clock-history me-2"></i>
                  <strong>Effective Date:</strong> 1/01/2026 | 
                  <strong className="ms-2">Version:</strong> 1.0
                </div>
              </div>

              {/* Policy Content */}
              <div className="policy-content">
                {privacyData.map((section) => (
                  <section 
                    key={section.id}
                    id={section.id}
                    className="policy-section mb-5 pb-4"
                  >
                    <h2 className="h4 fw-bold mb-3 text-primary">
                      <i className="bi bi-dot me-1"></i>
                      {section.title}
                    </h2>
                    <p className="mb-3">{section.content}</p>
                    
                    {section.details && section.details.length > 0 && (
                      <div className="details ps-4">
                        {section.details.map((detail, index) => (
                          <div key={index} className="mb-2">
                            <i className="bi bi-check-circle text-success me-2"></i>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Consent Section */}
              <div className="mt-5 pt-4 border-top">
                <div className="alert alert-success">
                  <h4 className="alert-heading">
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Your Consent
                  </h4>
                  <p>
                    By using XlentCar's services, you consent to our Privacy Policy and agree to 
                    its terms. You acknowledge that you have read and understood how we collect, 
                    use, and protect your personal information.
                  </p>
                  <hr />
                  <p className="mb-0">
                    If you have any questions about this Privacy Policy, please contact our 
                    Grievance Officer at{' '}
                    <a href="mailto:privacy@XlentCar.in" className="fw-bold">
                      privacy@XlentCar.in
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div>
                  <button className="btn btn-outline-primary" onClick={() => window.print()}>
                    <i className="bi bi-printer me-2"></i>
                    Print Policy
                  </button>
                </div>
                <div className="text-muted small">
                  Document ID: PP-{new Date().getFullYear()}-{new Date().getMonth() + 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPolicyPage;