import React from "react";
import "./BrochurePage.css";

const BrochurePage = () => (
  <main className="brochure-page">
    <a
      className="brochure-download"
      href={`${process.env.PUBLIC_URL}/xlentcar_brochure.html`}
      download="xlentcar-brochure.html"
    >
      Download brochure
    </a>
    <iframe
      className="brochure-frame"
      title="Xlentcar brochure"
      src={`${process.env.PUBLIC_URL}/xlentcar_brochure.html`}
    />
  </main>
);

export default BrochurePage;
