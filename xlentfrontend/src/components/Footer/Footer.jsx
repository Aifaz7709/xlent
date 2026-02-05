import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="container small border-top border-secondary">
        <div className="row py-2">
          {/* Company Info */}
          <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
            <div className="d-flex align-items-center mb-3">
              <img src="/XlentCar-logo-without-bg.png" alt="Xlentcar" width="90" height="85" />
          
            </div>
            <address className="text-light mt-3" style={{ opacity: '0.8' }}>
             Chennai, Tamil Nadu<br/>
            <br/>
            <div className="d-flex flex-column gap-2" style={{ maxWidth: 'fit-content' }}>
  {/* Support Line */}
    <span className="fw-bold  me-2" style={{ minWidth: '70px', fontSize: '0.70rem', textTransform: 'uppercase' , color:'white'}}>
      Support
    </span>
    <a href="tel:+919649641077" className="text-decoration-none fw-semibold" style={{ color: 'inherit' }}>
      (+91) 9649641077
    </a>

    <span className="fw-bold  me-2" style={{ minWidth: '70px', fontSize: '0.70rem', textTransform: 'uppercase' }}>
      Alt No.
    </span>
    <a href="tel:+917568656756" className="text-decoration-none fw-semibold" style={{ color: 'inherit' }}>
      (+91) 7568656756
    </a>
</div>
            </address>
          </div>

          <FooterLinks />
        </div>  

        <div className="container text-center py-2 small" style={{ opacity: '0.7' }}>
          © 2025 Xlentcar — Your Journey, Your Way.
        </div>
      </div>
    </footer>
  );
};

const FooterLinks = () => (
  <>
    {/* Our Services */}
    <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
      <h3 className="h6 mb-3">Our Services</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/deals" style={{ opacity: '0.8' }}>Car Fleet</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="#long-term" style={{ opacity: '0.8' }}>Long Term Rental</a></li>
      </ul>
    </div>

    {/* Support */}
    <div className="col-12 col-lg-4 col-xl-3 border-end border-secondary p-4">
      <h3 className="h6 mb-3">Support</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/HelpCenter" style={{ opacity: '0.8' }}>Help Center</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0"  href="/HelpCenter" style={{ opacity: '0.8' }}>FAQs</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0"  href="/HelpCenter" style={{ opacity: '0.8' }}>Roadside Assistance</a></li>
      </ul>
    </div>

    {/* Company */}
    <div className="col-12 col-lg-4 col-xl-3 p-4">
      <h3 className="h6 mb-3">Company</h3>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/about" style={{ opacity: '0.8' }}>About Us</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/TermsConditionsPage" style={{ opacity: '0.8' }}>Terms & Conditions</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/PrivacyPolicy" style={{ opacity: '0.8' }}>Privacy Policy</a></li>
        <li className="nav-item"><a className="nav-link text-light ps-0" href="/RefundPolicy" style={{ opacity: '0.8' }}>Refund Policy</a></li>

      </ul>
    </div>
  </>
);

export default Footer;  