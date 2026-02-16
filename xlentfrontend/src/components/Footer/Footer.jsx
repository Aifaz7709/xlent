import React from "react";
import { Phone, MapPin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Left Column: Company Info */}
          <div className="footer-column footer-info">
            <img
              src="/XlentCar-logo-without-bg.png"
              alt="XlentCar"
              className="footer-logo"
            />

            <div className="footer-location">
              <MapPin size={16} />
              <span>Chandrapur, Maharashtra</span>
            </div>

            <div className="footer-contact">
              <div>
                <Phone size={14} />
                <a href="tel:+919649641077">(+91) 9649641077</a>
              </div>
              <div>
                <Phone size={14} />
                <a href="tel:+917568656756">(+91) 7568656756</a>
              </div>
            </div>
          </div>

          {/* Middle Columns: Services, Support, Company */}
          <div className="footer-column">
            <h4>Our Services</h4>
            <a href="/deals">Car Fleet</a>
            <a href="#long-term">Long Term Rental</a>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <a href="/HelpCenter">Help Center</a>
            <a href="/HelpCenter">FAQs</a>
            <a href="/HelpCenter">Roadside Assistance</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="/about">About Us</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/PrivacyPolicy">Privacy Policy</a>
            <a href="/RefundPolicy">Refund Policy</a>
          </div>

          {/* Right Column: Google Map */}
          <div className="footer-column footer-map">
            <h4>Our Location</h4>
            <iframe
              title="XlentCar Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.918536344326!2d79.29811451532354!3d19.990767079910556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd2d5cc6c20e919%3A0xb51c5c4d82ac358a!2sBharat%20Automobiles%20and%20Tyre%20Works!5e0!3m2!1sen!2sin!4v1707975879935!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          © 2025 XlentCar — Your Journey, Your Way.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
