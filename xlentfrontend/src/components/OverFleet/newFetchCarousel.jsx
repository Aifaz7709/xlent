import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCars as setCarsRedux, setLoading as setLoadingRedux } from "../Redux/Slices/carSlice";
import { clearSelectedLocation } from "../Redux/Slices/LocationSlice";
import { MapPin, X, ArrowLeft, ArrowRight } from "lucide-react";
import "./NewPropertyCard.css";

const NewPropertyCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const selectedLocation = useSelector((state) => state.location.selectedLocation);
  const { cars: reduxCars, loading: reduxLoading } = useSelector((state) => state.cars);

  // Local State
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const autoPlayTimerRef = useRef(null);

  // 1. Optimized Data Fetching (only if empty)
  useEffect(() => {
    if (reduxCars.length > 0) return;

    const fetchData = async () => {
      dispatch(setLoadingRedux(true));
      try {
        const token = localStorage.getItem('xlent_token');
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://xlent-production.up.railway.app'}/api/cars`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        const carArray = data.cars || data || [];
        dispatch(setCarsRedux(carArray));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        dispatch(setLoadingRedux(false));
      }
    };
    fetchData();
  }, [dispatch, reduxCars.length]);

  // 2. Memoized Filtering (Prevents lag when typing or clicking elsewhere)
  const filteredCars = useMemo(() => {
    if (!reduxCars.length) return [];
    
    // Transform and Filter in one pass
    const transformed = reduxCars.map(car => ({
      id: car.id,
      name: car.car_model || "Car",
      location: car.car_location || "Location not specified",
      photos: car.photos || [],
      original: car
    }));

    if (!selectedLocation) return transformed;

    const locName = selectedLocation.name?.toLowerCase();
    return transformed.filter(car => car.location.toLowerCase().includes(locName));
  }, [reduxCars, selectedLocation]);

  // 3. Responsive Logic
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 480) setItemsPerSlide(1);
    else if (width < 768) setItemsPerSlide(2);
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
    setCurrentSlide(p => (p >= totalSlides - 1 ? 0 : p + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(p => (p <= 0 ? totalSlides - 1 : p - 1));
  }, [totalSlides]);

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

  if (reduxLoading && !filteredCars.length) return <div className="loader">Loading...</div>;

  return (
    <section className="fleet-carousel">
      <div className="carousel-header">
        <div>
          <h2 className="title">{selectedLocation ? `Cars in ${selectedLocation.name}` : 'Our Fleet'}</h2>
          <p className="subtitle">{filteredCars.length} vehicles available</p>
        </div>
        
        <div className="controls">
          {selectedLocation && (
            <button className="reset-btn" onClick={() => dispatch(clearSelectedLocation())}>
              <X size={14} /> Clear Filter
            </button>
          )}
          <div className="nav-buttons">
            <button onClick={prevSlide} className="nav-btn"><ArrowLeft size={20} /></button>
            <button onClick={nextSlide} className="nav-btn"><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="carousel-window" 
           onMouseEnter={() => setIsAutoPlaying(false)} 
           onMouseLeave={() => setIsAutoPlaying(true)}>
        <div className="carousel-track" 
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {filteredCars.map((car) => (
            <div key={car.id} className="car-card-wrapper" style={{ width: `${100 / itemsPerSlide}%` }}>
              <div className="car-card" onClick={() => navigate(`/book/${car.id}`, { state: { car: car.original } })}>
                <div className="image-box">
                  <img src={car.photos[0] || 'placeholder.jpg'} alt={car.name} loading="lazy" />
                  <button className={`fav-btn ${favorites.includes(car.id) ? 'active' : ''}`} 
                          onClick={(e) => toggleFavorite(car.id, e)}>
                    ❤️
                  </button>
                </div>
                <div className="info">
                  <h3>{car.name}</h3>
                  <p><MapPin size={14} /> {car.location}</p>
                  <button className="book-now">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewPropertyCard;