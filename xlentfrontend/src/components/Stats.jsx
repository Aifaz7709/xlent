import React from "react";

const Stats = () => {
  return (
    <section className="py-vh-5 w-100 overflow-hidden" id="numbers">
      <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-lg-5">
            <h3 className="py-3 border-top border-dark" data-aos="fade-right">wealthfront by the numbers</h3>
          </div>

          <div className="col-lg-6">
            <div className="row">
              <div className="col-12">
                <h2 className="display-6 mb-5" data-aos="fade-down">Secure trades powered by escrow — built for modern marketplaces</h2>
              </div>

              <StatBlock number="98%" label="Successful dispute-free settlements" />
              <StatBlock number="+50k" label="Trades secured to date" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatBlock = ({ number, label }) => (
  <div className="col-lg-6" data-aos="fade-up">
    <div className="display-1 fw-bold py-4">{number}</div>
    <p className="text-black-50">{label}</p>
  </div>
);

export default Stats;
