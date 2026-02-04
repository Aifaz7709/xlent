import React, { useEffect, useState } from "react";
import './Testimonials.css'
import UserData from "../CustForm/UserData";
import ContactUsCard from "../Popups/ContactUsCard";

const Testimonials = () => {

  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
<>
<>
      <button
        className="cta-btn secondary"
        onClick={() => setShowPopup(true)}
      >
        Download App
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <h3>🚧 App Under Construction</h3>
            <p>We’re cooking something awesome. Coming very soon.</p>
          </div>
        </div>
      )}
    </>


    <section className="testimonials-section" id="testimonials">
      <div className="mainTestStyle">
        {/* Header Section */}
        <div className="testimonials-header">
          <div className="header-content">
            <div className="section-badge">HAPPY CUSTOMERS</div>
            <h2 className="" >
              Trusted by <span className="text-gradient">Thousands</span> of Car Owners
            </h2>
            <p className="section-description">
              Discover why car owners across India choose XLent for reliable, affordable car rental solutions
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-number">3K+</div>
              <div className="stat-label">Happy Renters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Roadside Support</div>
            </div>
          </div>
        </div>

  

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {sampleCards.map((testimonial, index) => (
            <div 
              className={`testimonial-card ${testimonial.featured ? 'featured' : ''}`}
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card-header">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {testimonial.featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              
              <div className="car-details">
                <span className="car-model">{testimonial.carModel}</span>
                <span className="rental-duration">{testimonial.rentalPeriod}</span>
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonial.text}"
              </blockquote>
              
              <div className="author-section">
                <img 
                  // src={testimonial.img} 
                  alt={testimonial.name}
                  className="author-image"
                />
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.tripPurpose}</div>
                  <div className="author-location">{testimonial.location}</div>
                </div>
              </div>
              
              {testimonial.verifiedRenter && (
                <div className="verification-badge">
                  <span className="verified-icon">✓</span>
                  Verified Renter
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="testimonials-cta">
          <div className="cta-content">
            <h3>Ready to experience hassle-free car rental?</h3>
            <p>Join thousands of satisfied customers across India</p>
            <div className="cta-buttons">
              <button className="cta-btn primary"      onClick={() => setShowForm(true)} >Book Your Car Now</button>
              <button className="cta-btn secondary"  onClick={() => setShowPopup(true)}>Download App</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {showForm && (
  <ContactUsCard onClose={() => setShowForm(false)} />
)}


    </>
  );
};

const sampleCards = [
  { 
    name: "Priya Patel", 
    tripPurpose: "Family Wedding",
    location: "Ahmedabad, Gujarat",
    carModel: "Hyundai Creta",
    rentalPeriod: "4 days",
    text: "Perfect for our family wedding events! The Creta had ample space for 5 adults and all our traditional outfits. The car was spotless and fuel-efficient. Will definitely use XLentagain!",
    img: "/img/webp/person3.webp",
    rating: 5,
    verifiedRenter: true,
    featured: true
  },
  { 
    name: "Arjun Mehta", 
    tripPurpose: "Business Trip",
    location: "Mumbai, Maharashtra",
    carModel: "Honda City",
    rentalPeriod: "3 days",
    text: "As a frequent business traveler, I appreciate the professionalism. The Honda City was perfect for client meetings. The airport pickup and drop-off saved me so much time.",
    img: "/img/webp/person8.webp",
    rating: 5,
    verifiedRenter: true,
    featured: false
  },
  { 
    name: "Ananya Reddy", 
    tripPurpose: "Weekend Getaway",
    location: "Hyderabad, Telangana",
    carModel: "Maruti Swift",
    rentalPeriod: "2 days",
    text: "Amazing experience for our weekend trip to Srisailam! The Swift was fuel-efficient and perfect for hill roads. The booking process was completely digital and hassle-free.",
    img: "/img/webp/person18.webp",
    rating: 5,
    verifiedRenter: true,
    featured: true
  }
];

export default Testimonials;