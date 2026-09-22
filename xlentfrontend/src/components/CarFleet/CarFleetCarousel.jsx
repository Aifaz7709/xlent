import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSelectedLocation } from "../Redux/Slices/LocationSlice";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, X } from "lucide-react";
import "./CarFleetCarousel.css";
import AppLoader from "../Loader/AppLoader";
import { supabase } from "../../supabaseClient";
const CarFleetCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const selectedLocation = useSelector((state) => state.location.selectedLocation);

  // Local State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const autoPlayTimerRef = useRef(null);
  const touchStartX = useRef(null);

  // 1. Optimized Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*");

        if (error) throw error;

        setCars(data || []);
      } catch (err) {
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Memoized Filtering (Prevents lag when typing or clicking elsewhere)
  const filteredCars = useMemo(() => {
    if (!cars.length) return [];
    
    // Transform and Filter in one pass
    const transformed = cars.map(car => ({
      id: car.id,
      name: car.car_model || "Car",
      location: car.car_location || "Location not specified",
      displayLocation: (car.car_location || "Location not specified").split(",")[0].trim(),
      photos: car.photos || [],
      original: car
    }));

    if (!selectedLocation) return transformed;

    const locName = selectedLocation.name?.toLowerCase();
    return transformed.filter(car => car.location.toLowerCase().includes(locName));
  }, [cars, selectedLocation]);

  // 3. Responsive Logic
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) setItemsPerSlide(1);
    else if (width < 1024) setItemsPerSlide(3);
    else setItemsPerSlide(4);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // 4. Carousel Navigation
  const totalSlides = Math.ceil(filteredCars.length / itemsPerSlide);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide(p => (p >= totalSlides - 1 ? 0 : p + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide(p => (p <= 0 ? totalSlides - 1 : p - 1));
  }, [totalSlides]);

  useEffect(() => {
    setCurrentSlide((slide) => Math.min(slide, Math.max(totalSlides - 1, 0)));
  }, [totalSlides]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) {
      if (distance < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    setIsAutoPlaying(true);
  };

  // Auto-play Effect
  useEffect(() => {
    if (!isAutoPlaying || filteredCars.length === 0) return;
    autoPlayTimerRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(autoPlayTimerRef.current);
  }, [isAutoPlaying, nextSlide, filteredCars.length]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading && !filteredCars.length) return <div className="loader"><AppLoader /></div>;

  return (
    <section className="fleet-carousel">
      <div className="carousel-header">
        <div>
          <span className="carousel-eyebrow">READY WHEN YOU ARE</span>
          <h2>{selectedLocation ? `Cars in ${selectedLocation.name}` : 'Pick your perfect ride'}</h2>
          <p className="subtitle">{filteredCars.length} vehicles available</p>
        </div>
        
        {selectedLocation && (
          <button className="reset-btn" onClick={() => dispatch(clearSelectedLocation())}>
            <X size={14} /> Clear Filter
          </button>
        )}
      </div>

      <div className="carousel-stage">
        <button
          className="carousel-control carousel-control-prev"
          type="button"
          onClick={prevSlide}
          aria-label="Show previous cars"
          disabled={totalSlides <= 1}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="carousel-window"
             onMouseEnter={() => setIsAutoPlaying(false)}
             onMouseLeave={() => setIsAutoPlaying(true)}
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>
          <motion.div
            className="carousel-track"
            animate={{ x: `${-currentSlide * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 50) {
                info.offset.x < 0 ? nextSlide() : prevSlide();
              }
            }}
          >
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              className="car-card-wrapper"
              style={{ width: `${100 / itemsPerSlide}%` }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
            >
              <motion.div
                className="car-card"
                onClick={() => navigate(`/book/${car.id}`, { state: { car: car.original } })}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="image-box">
                  <img src={car.photos[0] || 'placeholder.jpg'} alt={car.name} loading="lazy" />
                  <button className={`fav-btn ${favorites.includes(car.id) ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(car.id, e)}>
                    <Heart size={17} fill={favorites.includes(car.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="info">
                  <h3>{car.name}</h3>
                  <p><MapPin size={14} /> {car.displayLocation}</p>
                  <button className="book-now">Book Now</button>
                </div>
              </motion.div>
            </motion.div>
          ))}
          </motion.div>
        </div>
        <button
          className="carousel-control carousel-control-next"
          type="button"
          onClick={nextSlide}
          aria-label="Show next cars"
          disabled={totalSlides <= 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default CarFleetCarousel;