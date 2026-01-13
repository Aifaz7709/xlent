import React, { useRef, useEffect, useState } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import './TrendingProperties.css';

const TrendingProperties = () => {
  const swiperRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}">
            <span class="bullet-progress"></span>
          </span>`;
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1.1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1.3,
          spaceBetween: 25,
        },
        1024: {
          slidesPerView: 1.8,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 2.2,
          spaceBetween: 35,
        },
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: true,
      },
      on: {
        slideChange: function () {
          setActiveSlide(this.realIndex);
        },
      },
    });

    return () => {
      if (swiper) {
        swiper.destroy(true, true);
      }
    };
  }, []);

  

  return (<>
  </>
//     <section className="trending-properties">
//       <div className="container">
//         <div className="section-header">
//         <div className="header-content">
//   <h2 className="section-title">
//     <span className="title-accent">Premium</span> Car Fleet
//   </h2>
//   <p className="section-subtitle">
//     Curated selection of well-maintained vehicles with flexible rental options
//   </p>
// </div>
// <div className="header-stats">
//   <div className="stat">
//     <div className="stat-number">500+</div>
//     <div className="stat-label">Cars Available</div>
//   </div>
//   <div className="stat">
//     <div className="stat-number">15K+</div>
//     <div className="stat-label">Happy Customers</div>
//   </div>
//   <div className="stat">
//     <div className="stat-number">24/7</div>
//     <div className="stat-label">Roadside Support</div>
//   </div>
// </div>
//         </div>

      
//         <div className="view-all-section">
//           <button className="view-all-btn">
//           Contact Us
//             <i className="fas fa-arrow-right"></i>
//           </button>
//         </div>
//       </div>
//     </section>
  );
};

export default TrendingProperties;