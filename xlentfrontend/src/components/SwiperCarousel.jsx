import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import './SwiperCarousel.css';

const SwiperCarousel = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const mySwiper = new Swiper(swiperRef.current, {
      direction: "horizontal", // Changed from vertical to horizontal
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      grabCursor: true,
      speed: 1000,
      parallax: true,
      autoplay: false,
      effect: "slide",
      mousewheel: true,
    });

    return () => {
      if (mySwiper) {
        mySwiper.destroy(true, true);
      }
    };
  }, []);

  return (
    <div className="page-wrap">
      <div id="home-slider">
        <div className="swiper-container" ref={swiperRef}>
          <div className="swiper-wrapper">
            {/* Slide 1 */}
            <div className="swiper-slide swiper-slide-one">
              <div className="swiper-image" data-swiper-parallax-y="-20%">
                <div className="swiper-image-inner swiper-image-left swiper-image-one">
                  <h1>A <span className="emphasis">Breath</span>. <br /><span>Of Fresh Air.</span></h1>
                  <p>Chapter I, page XV</p>
                </div>
              </div>
              <div className="swiper-image" data-swiper-parallax-y="35%">
                <div className="swiper-image-inner swiper-image-right swiper-image-two">
                  <p className="paragraph">
                    A Prophet sat in the market-place and told the fortunes of all who cared to engage his services. Suddenly there came running up one who told him that his house had been broken into by thieves, and that they had made off with everything they could lay
                    hands on.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="swiper-slide swiper-slide-two">
              <div className="swiper-image" data-swiper-parallax-y="-20%">
                <div className="swiper-image-inner swiper-image-left swiper-image-three">
                  <h1>The <span className="emphasis">Drop</span>. <br /><span>Of Eternal life.</span></h1>
                  <p>Chapter II, page VII</p>
                </div>
              </div>
              <div className="swiper-image" data-swiper-parallax-y="35%">
                <div className="swiper-image-inner swiper-image-right swiper-image-four">
                  <p className="paragraph">
                    A thirsty Crow found a Pitcher with some water in it, but so little was there that, try as she might, she could not reach it with her beak, and it seemed as though she would die of thirst within sight of the remedy.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="swiper-slide swiper-slide-three">
              <div className="swiper-image" data-swiper-parallax-y="-20%">
                <div className="swiper-image-inner swiper-image-left swiper-image-five">
                  <h1>A <span className="emphasis">Sense</span>. <br /><span>Of Things to Come.</span></h1>
                  <p>Chapter III, page XI</p>
                </div>
              </div>
              <div className="swiper-image" data-swiper-parallax-y="35%">
                <div className="swiper-image-inner swiper-image-right swiper-image-six">
                  <p className="paragraph">
                    Every man carries Two Bags about with him, one in front and one behind, and both are packed full of faults. The Bag in front contains his neighbours' faults, the one behind his own. Hence it is that men do not see their own faults, but never fail to see
                    those of others.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </div>
  );
};

export default SwiperCarousel;