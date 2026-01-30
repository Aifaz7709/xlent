// TermsConditionsPage.jsx
import React, { useState, useEffect } from 'react';
import './Terms.css'; // Optional styling

const TermsConditionsPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Terms data - structured for easy navigation
  const termsData = [
    {
      id: 1,
      title: "Verification Timeline",
      number: "1.",
      content: "To ensure safety and legal compliance, all users must complete mandatory verification within the specified timeframe.",
      details: [
        "Required Documents: Users must submit: Aadhaar, Driving License, and live selfie .Mobile OTP verification .Hosts/Dealers: Also submit RC, insurance, PUC. Consent to KYC via authorized partners",
        "Timeline: Verification must be completed within 7 days of registration. Urgent bookings/listings may require 24-hour expedited verification. Shorter timelines may apply as per legal mandates.",
        "Notifications & Support: Reminders via SMS, email, and app. Support available for help, re-uploads, or extension requests (subject to approval)",
        "XlentCar's Rights: Revise deadlines or verification rules at any time. Deny access to non-verified users without liability. Report suspicious behavior to authorities under applicable laws",
        "Non-Compliance Consequences: Restricted access to booking/listing and payment features. Account suspension if not verified on time. Booking cancellations without refund. account removal for unverified guests. Permanent deletion after repeated non-compliance"
      ]
    },
    {
      id: 2,
      title: "Misuse of Platform",
      number: "2.",
      content: "To ensure lawful and safe usage, all XlentCar users must comply with platform Terms, Privacy Policy, and all applicable Indian laws.",
      details: [
        "What Constitutes Misuse: Includes submitting false/expired documents, using fake identities, booking vehicles for illegal acts, tampering with vehicles or GPS, listing unauthorized vehicles, abusive behavior, fraud, or bypassing platform systems",
        "Legal Violations: Breaching Indian laws may result in immediate account suspension, booking cancellation, reporting to authorities, and legal action",
        "XlentCar's Rights: May suspend/delete accounts, impose penalties, share evidence with authorities, initiate legal proceedings",
        "Reporting Misuse: Via in-app support, customer service, or email: support@XlentCar.in",
        "User Responsibilities: Submit valid info, use platform legally, follow traffic rules, treat others with courtesy",
        "Disclaimer of Liability: XlentCar is not liable for user misconduct"
      ]
    },
    {
      id: 3,
      title: "Rental Agreement Acceptance",
      number: "3.",
      content: "Booking confirmation binds Guest and Host/Dealer to these terms.",
      details: [
        "Binding Agreement: Guest agrees to vehicle use and return terms; Host/Dealer agrees to deliver as listed",
        "Consent: Booking via app, website, or authorized personnel confirms legal acceptance",
        "Pre-Trip Checklist: Vehicle condition and Guest identity verified before handover",
        "Legal Compliance: Agreement governed by Indian laws including Motor Vehicles Act (1988)",
        "Role of XlentCar: Acts only as intermediary, not owner/operator",
        "Termination: Agreement ends upon vehicle return and dues settlement",
        "Recordkeeping: XlentCar retains booking, consent, payment, and ID records"
      ]
    },
    {
      id: 4,
      title: "Valid Driving License Requirement",
      number: "4.",
      content: "Guests must hold a valid, active Driving License issued by Indian RTO or valid International Driving Permit.",
      details: [
        "License Validity: Must authorize the rented vehicle class",
        "License Verification: Upload clear copy during booking; verification via automated/manual checks",
        "Carrying License: Must carry physical or legal digital license during rental",
        "Disqualification: XlentCar can cancel bookings if underage, invalid license, or violation history",
        "Legal Compliance: Compliance with Motor Vehicles Act, 1988 is mandatory"
      ]
    },
    {
      id: 5,
      title: "Personal Use Only",
      number: "5.",
      content: "Vehicles are leased solely for lawful, personal, non-commercial use.",
      details: [
        "Personal Use Only: No taxi services, delivery, driver training, racing, or sub-leasing",
        "Legal & Insurance: Commercial use voids insurance and violates laws",
        "Guest Responsibility: Comply with policy, prevent unauthorized use",
        "Monitoring: XlentCar may monitor vehicle use via GPS, usage analysis",
        "Penalties: Booking cancellation, legal reporting, cost recovery for violations"
      ]
    },
    {
      id: 6,
      title: "Compliance with Traffic Laws",
      number: "6.",
      content: "Guests must follow all applicable traffic, transport, and parking laws.",
      details: [
        "Compliance with Laws: Follow Motor Vehicles Act, 1988 and state/municipal regulations",
        "Guest Obligations: Valid license, obey traffic rules, wear seatbelts, no intoxicated driving",
        "Liability for Violations: Guests bear full responsibility for fines, penalties, damages",
        "Violation Reporting: Acknowledge and pay penalties promptly",
        "Monitoring: GPS/telematics monitoring for safety compliance"
      ]
    },
    {
      id: 7,
      title: "Accurate User Information",
      number: "7.",
      content: "All Users must provide true, complete, and current information.",
      details: [
        "Required Info: Full name, contact info, address, Aadhaar, Driving License, profile photo",
        "Updates: Must update any changed details promptly",
        "Verification: XlentCar may verify via government databases or third-party checks",
        "Consequences: Account suspension, denial of service, or booking cancellation for false info",
        "Legal Action: Reporting to police/RTO, legal action under IPC, MV Act, or IT Act"
      ]
    },
    {
      id: 8,
      title: "Restrictions on Vehicle Use",
      number: "8.",
      content: "No off-roading, towing, commercial use, or unauthorized activities.",
      details: [
        "Prohibited Uses: No off-roading, towing, racing, intoxicated driving, subletting, illegal activities",
        "Load & Capacity: Do not exceed registered seating capacity",
        "Geographic Limits: Stay within India unless written permission",
        "Parking & Storage: Park securely in legal zones",
        "Consequences: Rental termination, full liability, account suspension, legal action"
      ]
    },
    {
      id: 9,
      title: "Personal Belongings Responsibility",
      number: "9.",
      content: "Guests are solely responsible for all personal items during rental.",
      details: [
        "User Responsibility: XlentCar, Hosts, and Dealers not liable for loss, theft, or damage",
        "No Liability for Forgotten Items: Check vehicles before return",
        "Precautions: Avoid leaving valuables visible, always lock vehicle",
        "Reporting Lost Items: Contact Host/Dealer directly",
        "No Insurance: Personal belongings not covered under vehicle insurance"
      ]
    },
    {
      id: 10,
      title: "Prohibition of Illegal Activities",
      number: "10.",
      content: "Vehicles must not be used for any illegal activities.",
      details: [
        "Illegal Use Ban: No transporting illegal substances, human trafficking, criminal acts, street racing",
        "Zero Tolerance: Immediate account suspension, reporting to law enforcement, permanent blacklisting",
        "Host & Dealer Duties: List only legal vehicles, report suspected illegal use",
        "Guest Liability: Full legal responsibility including fines and damages",
        "Insurance Void: Coverage void for illegal use"
      ]
    },
    {
      id: 11,
      title: "Account Creation and Verification",
      number: "11.",
      content: "All Users must create account and complete KYC verification.",
      details: [
        "Registration: Sign up using valid mobile number and OTP verification",
        "Mandatory KYC: Upload Aadhaar, valid Driving License, real-time selfie",
        "Dealers: Provide business registration, vehicle RCs, authorized representative details",
        "Consent to Verification: Document validation via government databases",
        "Account Security: User responsible for account confidentiality",
        "Account Denial/Termination: For document fraud, misuse, or policy violations"
      ]
    },
    {
      id: 12,
      title: "False Document Submission",
      number: "12.",
      content: "Strict prohibition of forged, altered, or misleading documents.",
      details: [
        "Violations Include: Fake, expired, or tampered documents, using another person's ID",
        "Legal Action: Criminal offense under IPC and IT Act",
        "XlentCar's Rights: Suspend/terminate account, withhold transactions, initiate investigation",
        "User Responsibility: Submit only genuine, valid documents",
        "Appeals: Appeal with original documents, video KYC verification"
      ]
    },
    {
      id: 13,
      title: "Dispute Resolution Mechanism",
      number: "13.",
      content: "Process for resolving disputes between users.",
      details: [
        "First Step: Amicable resolution through mutual discussions within 30 days",
        "Arbitration: Referred to arbitration under Arbitration and Conciliation Act, 1996",
        "Arbitrator: Sole arbitrator mutually appointed",
        "Venue: Bangalore, India, proceedings in English",
        "Jurisdiction: Courts at Bangalore, Karnataka have exclusive jurisdiction"
      ]
    },
    {
      id: 14,
      title: "Governing Law and Jurisdiction",
      number: "14.",
      content: "Terms governed by Indian law with exclusive jurisdiction in Bangalore.",
      details: [
        "Governing Law: Laws of the Republic of India",
        "Jurisdiction: Courts in Bangalore, India have exclusive jurisdiction",
        "User Agreement: Users agree to exclusive jurisdiction",
        "Legal Proceedings: Company may initiate proceedings in any appropriate jurisdiction",
        "Compliance: Terms comply with applicable Indian laws and regulations"
      ]
    },
    {
      id: 15,
      title: "Amendments to Terms",
      number: "15.",
      content: "XlentCar may update or modify Terms at any time.",
      details: [
        "Updates: May modify Terms without prior notice",
        "Effect: Changes effective immediately upon posting",
        "User Responsibility: Review Terms regularly",
        "Acceptance: Continued use means acceptance of updated Terms",
        "Compliance: All changes comply with applicable Indian laws"
      ]
    },
    {
      id: 16,
      title: "Intellectual Property Rights",
      number: "16.",
      content: "All intellectual property owned by XlentCar or licensors.",
      details: [
        "Ownership: Trademarks, logos, content, software, designs protected under Indian laws",
        "License: Limited, non-exclusive, non-transferable license for personal use",
        "Prohibited: No reproduction, modification, distribution, or reverse engineering",
        "Penalties: Civil and criminal penalties for unauthorized use",
        "Reserved Rights: All rights not granted are reserved by Company"
      ]
    },
    {
      id: 17,
      title: "Prohibition of Fraudulent Activities",
      number: "17.",
      content: "No fraudulent, deceptive, or unauthorized use of platform.",
      details: [
        "Prohibited Actions: False information, impersonation, unauthorized access, malware, illegal activities",
        "Investigation: Company may investigate, suspend accounts, report to law enforcement",
        "Legal Action: Pursue action under IPC 1860 and PMLA 2002",
        "Company Rights: Immediate action including suspension and damages claims"
      ]
    },
    {
      id: 18,
      title: "Feedback and Reviews Policy",
      number: "18.",
      content: "Policy for user feedback and reviews.",
      details: [
        "User Responsibility: Submit honest, respectful feedback",
        "Prohibited Content: No defamatory, offensive, or discriminatory content",
        "Moderation: Company may edit, hide, or remove violating reviews",
        "Intellectual Property: Users grant license for content use",
        "Legal Compliance: Complies with Consumer Protection Act, 2019"
      ]
    },
    {
      id: 19,
      title: "Indemnification Clause",
      number: "19.",
      content: "User agrees to indemnify XlentCar against claims.",
      details: [
        "Indemnity: Hold XlentCar harmless from claims, damages, losses, legal fees",
        "Coverage: Breach of Terms, content submission, third-party claims, negligence",
        "User Responsibility: Accept full responsibility for actions"
      ]
    },
    {
      id: 20,
      title: "Booking Procedures and Payment",
      number: "20.",
      content: "Process for booking vehicles and payment terms.",
      details: [
        "Booking Process: Verified account required, host approval needed for some bookings",
        "Payment Terms: Final tax-inclusive prices, multiple payment methods accepted",
        "Cancellations: Host-specific policies, refunds in 7-10 business days",
        "Disputes: Resolve directly between Host and Guest",
        "Chargebacks: Account suspension for fraudulent payments"
      ]
    },
    {
      id: 21,
      title: "Accident/Incident Notification",
      number: "21.",
      content: "Immediate reporting required for accidents or incidents.",
      details: [
        "Immediate Reporting: Notify within 1 hour to Host, XlentCar, law enforcement",
        "Details Required: Time, location, description, photos, contact info",
        "Post-Incident: Remain at scene, follow instructions, do not admit fault",
        "Consequences: Insurance denial, full liability for non-reporting",
        "XlentCar Support: Assistance with towing, insurance guidance"
      ]
    },
    {
      id: 22,
      title: "No Vehicle Modification",
      number: "22.",
      content: "No modification or tampering with vehicle.",
      details: [
        "No Modifications: Altering structure, paint, accessories, engine, software",
        "No Tampering: GPS, dashcams, locks, alarms, emission devices",
        "Penalties: Financial liability, insurance denial, platform ban",
        "Vehicle Inspections: Hosts must inspect before and after rental",
        "Exceptions: Pre-approved modifications with written consent"
      ]
    },
    {
      id: 23,
      title: "XlentCar's Limited Liability",
      number: "23.",
      content: "XlentCar acts as intermediary with limited liability.",
      details: [
        "Platform Role: Technology intermediary only, not vehicle owner/operator",
        "No Guarantees: No guarantee on vehicle condition, availability, safety",
        "Limitation: Not liable for damages, disputes, accidents",
        "User Disputes: Not party to rental agreements",
        "No Warranties: Services provided 'as-is'"
      ]
    },
    {
      id: 24,
      title: "User Data Privacy",
      number: "24.",
      content: "Privacy policy for user data collection and use.",
      details: [
        "Data Collected: Personal info, identity docs, vehicle details, usage data",
        "Purpose: Verification, service delivery, compliance, marketing",
        "User Consent: Consent to collection and third-party sharing",
        "User Rights: Access, correct, delete data",
        "Data Security: Encryption and safeguards in place"
      ]
    },
    {
      id: 25,
      title: "Communication Preferences",
      number: "25.",
      content: "Communication channels and user preferences.",
      details: [
        "Types: Transactional, account, promotional, service updates, surveys",
        "Channels: Email, SMS, in-app notifications, push notifications",
        "Preferences: Opt-in/out of promotional messages",
        "Essential Messages: Cannot opt out of booking confirmations, security alerts",
        "Contact: support@XlentCar.in for concerns"
      ]
    },
    {
      id: 26,
      title: "Account Termination",
      number: "26.",
      content: "Grounds for account suspension or termination.",
      details: [
        "Reasons: Violating Terms, false info, illegal activities, fraudulent payments",
        "Suspension: Temporary during investigations",
        "Termination: Permanent for severe violations",
        "Appeals: Within 7-14 days, decisions final",
        "Voluntary Closure: Users may close accounts after settling obligations"
      ]
    },
    {
      id: 27,
      title: "User (Guest) Terms",
      number: "27.",
      content: "Specific terms for Guest users.",
      details: [
        "Eligibility: Age and license requirements",
        "Responsibilities: Compliance with all platform policies",
        "Liability: Financial responsibility for damages and violations",
        "Acceptance: Agreement to all terms and conditions"
      ]
    },
    {
      id: 28,
      title: "Eligibility and Age Restrictions",
      number: "28.",
      content: "Age and license requirements for platform use.",
      details: [
        "Age: Minimum 18 years for two-wheelers, 21 for four-wheelers",
        "License: Valid Indian driving license matching vehicle type",
        "KYC: Aadhaar or government ID + selfie required",
        "Disqualification: Suspended license, legal investigation, reckless driving",
        "Law Compliance: Follow all traffic rules and regulations"
      ]
    },
    {
      id: 29,
      title: "Cancellation and Refund Policies",
      number: "29.",
      content: "Policies for cancellations and refunds.",
      details: [
        "Guest Cancellations: Refund based on timing (48hrs, 24-48hrs, <24hrs)",
        "Host Cancellations: Full refund if Host cancels",
        "Refund Eligibility: Within timeframe, unfit vehicles, technical issues",
        "Security Deposit: Refund in 7-10 days if no pending charges",
        "Dispute Resolution: Escalate to XlentCar Support with evidence"
      ]
    },
    {
      id: 30,
      title: "Contact Information",
      number: "30.",
      content: "Contact details for XlentCar.",
      details: [
        "Contact: XlentCar",
        "Email: contact@XlentCar.in",
        "Purpose: For inquiries about terms and conditions"
      ]
    },
    {
      id: 31,
      title: "Unauthorized Drivers",
      number: "31.",
      content: "Only verified Guest may drive the vehicle.",
      details: [
        "Sole Driver: Only booking Guest authorized to drive",
        "Unauthorized Drivers: Friends, family, unverified users prohibited",
        "Consequences: Booking termination, insurance cancellation, platform ban",
        "Insurance: Void if unauthorized driver operates vehicle",
        "Verification: GPS, telematics, selfie checks for compliance"
      ]
    },
    {
      id: 32,
      title: "Vehicle Pickup and Return",
      number: "32.",
      content: "Responsibilities for vehicle pickup and return.",
      details: [
        "Pickup: Collect at confirmed location/time, present documents, inspect vehicle",
        "Return: Return clean vehicle at agreed time/location, penalty for late return",
        "Late Return: Hourly fines, platform suspension for unauthorized late returns",
        "Host Duties: Provide roadworthy vehicle with valid documents",
        "Disputes: Report via app support, XlentCar investigates"
      ]
    },
    {
      id: 33,
      title: "Fuel Policy",
      number: "33.",
      content: "Fuel requirements for vehicle rental.",
      details: [
        "Fuel Policy: Full-to-Full or Same-to-Same as per listing",
        "Return Requirements: Equal or higher fuel level as pickup",
        "Penalties: Refueling charges + convenience fee for shortfall",
        "Electric Vehicles: Return with agreed battery level",
        "Dispute Resolution: Platform reviews photos and timestamps"
      ]
    },
    {
      id: 34,
      title: "Vehicle Damage Reporting",
      number: "34.",
      content: "Process for reporting and handling vehicle damage.",
      details: [
        "Pre-Rental Inspection: Document condition with photos before trip",
        "During Rental: Guest liable for new damage, report promptly",
        "Post-Rental: Host inspects and reports new damage",
        "Liability: Guest pays repair costs, charges deducted from deposit",
        "Dispute Resolution: XlentCar mediates with binding decisions"
      ]
    },
    {
      id: 35,
      title: "Insurance Coverage",
      number: "35.",
      content: "Insurance requirements and user liability.",
      details: [
        "Insurance Coverage: Hosts must provide valid motor insurance",
        "Guest Liability: Liable for all damage during rental",
        "Violations: Responsible for fines, tolls, penalties",
        "Host Duties: Maintain valid insurance, provide proof on request",
        "XlentCar's Role: Neutral intermediary for claim facilitation"
      ]
    }
  ];

  // Filter terms based on search
  const filteredTerms = termsData.filter(term => 
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.details.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Scroll to section when activeSection changes
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(`section-${activeSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSection]);

  // Handle accept button
  const handleAcceptTerms = () => {
    alert('Thank you for accepting the Terms and Conditions. You may now proceed with booking.');
    // You can add logic to update user's acceptance status in your backend
  };

  return (
    <div className="terms-conditions-page container py-5">
      <div className="row">
        {/* Left sidebar - Table of Contents */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm sticky-sidebar">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                <i className="bi bi-list-ul me-2"></i>
                Table of Contents
              </h5>
              
              {/* Search Box */}
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Navigation List */}
              <div className="nav flex-column" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {filteredTerms.map((term) => (
                  <button
                    key={term.id}
                    className={`nav-link text-start mb-2 ${activeSection === term.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(term.id)}
                  >
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">{term.number}</span>
                      <span className="small">{term.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Accept Button */}
              <div className="mt-4 pt-3 border-top">
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleAcceptTerms}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Accept Terms & Conditions
                </button>
                <p className="small text-muted mt-2">
                  By clicking accept, you agree to all terms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Terms Details */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                  <i className="bi bi-file-text me-2"></i>
                  Terms & Conditions
                </h1>
                <p className="lead">XlentCar</p>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Introduction */}
              <div className="mb-5">
                <h2 className="h4 fw-bold mb-3">Introduction</h2>
                <p>
                  Welcome to XlentCar. These Terms and Conditions govern your use of our platform 
                  and services. By accessing or using XlentCar, you agree to comply with and be 
                  bound by these terms. Please read them carefully.
                </p>
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Important:</strong> These terms constitute a legally binding agreement. 
                  If you do not agree with any part, you must not use our services.
                </div>
              </div>

              {/* Terms Sections */}
              <div className="terms-content">
                {filteredTerms.map((term) => (
                  <section 
                    key={term.id} 
                    id={`section-${term.id}`}
                    className="term-section mb-5 pb-4 border-bottom"
                  >
                    <div className="d-flex align-items-start mb-3">
                      <span className="badge bg-primary fs-6 me-3">{term.number}</span>
                      <div>
                        <h3 className="h5 fw-bold mb-2">{term.title}</h3>
                        <p className="mb-3">{term.content}</p>
                        
                        <div className="details ps-3">
                          {term.details.map((detail, index) => (
                            <div key={index} className="mb-2">
                              <i className="bi bi-dot text-primary me-2"></i>
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {/* Final Acknowledgement */}
              <div className="mt-5 pt-4 border-top">
                <div className="alert alert-success">
                  <h4 className="alert-heading">
                    <i className="bi bi-check2-circle me-2"></i>
                    Final Acknowledgement
                  </h4>
                  <p>
                    By using XlentCar's services, you acknowledge that you have read, understood, 
                    and agree to be bound by all the Terms and Conditions stated above. You also 
                    confirm that you meet all eligibility requirements and will comply with all 
                    applicable laws and regulations.
                  </p>
                  <hr />
                  <p className="mb-0">
                    For any questions regarding these terms, please contact us at{' '}
                    <a href="mailto:contact@XlentCar.in" className="fw-bold">
                      contact@XlentCar.in
                    </a>
                  </p>
                </div>
              </div>

              {/* Print and Download Options */}
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Terms
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    const text = termsData.map(t => 
                      `${t.number} ${t.title}\n${t.content}\n${t.details.join('\n')}\n\n`
                    ).join('\n');
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'XlentCar_Terms_and_Conditions.txt';
                    a.click();
                  }}
                >
                  <i className="bi bi-download me-2"></i>
                  Download Text
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;