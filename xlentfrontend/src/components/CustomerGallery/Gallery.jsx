  import React from "react";

  const Gallery = () => {
    return (
      <section className="position-relative bg-light" id="gallery">
        <div className="container-fluid">
          <div className="row" >
            <div className="col-12">
             <h2 className="display-6 mb-5" data-aos="fade-down"  style={{ 
          cursor: 'pointer',
       color: 'rgb(2, 40, 124)',
          marginRight: '1.5rem',
          fontWeight: '600'
        }}>Smiles & Miles</h2>
              <div className="row vw-90 px-2 d-flex align-items-center g-4 g-md- ">
                <div className="col-md-2" data-aos="fade-up"><img src="/gallery/1.jpg" className="rounded shadow img-fluid" alt="gallery" /></div>
                <div className="col-md-2" data-aos="fade-up" data-aos-delay="200"><img src="/gallery/2.jpg" className="img-fluid rounded shadow" alt="gallery" /></div>
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="400"><img src="/gallery/3.jpg" className="img-fluid rounded shadow" alt="gallery"/></div>
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="600"><img src="/gallery/4.jpg" className="img-fluid rounded shadow" alt="gallery" /></div>
                <div className="col-md-2" data-aos="fade-up" data-aos-delay="800"><img src="/gallery/5.avif" className="rounded shadow img-fluid" alt="gallery" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default Gallery;
