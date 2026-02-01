import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCars as setCarsRedux, setLoading as setLoadingRedux } from "../Redux/Slices/carSlice";
import { clearSelectedLocation } from "../Redux/Slices/LocationSlice"; // Import the action

import "./NewPropertyCard.css"; 
import { MapPin, X } from "lucide-react";

const NewPropertyCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedLocation = useSelector((state) => state.location.selectedLocation); // Add this line

  const reduxCars = useSelector((state) => state.cars.cars);
  const reduxLoading = useSelector((state) => state.cars.loading);

  const [localCars, setLocalCars] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  const carouselRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const minSwipeDistance = 50;

  // Fetch cars from API
  const fetchAllCarsFromAPI = async () => {
    try {
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL 
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : 'https://xlent-production.up.railway.app/api/cars';
      
      const res = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch cars:', errorText);
        return [];
      }
      
      const data = await res.json();
      
      if (data.cars && Array.isArray(data.cars)) {
        return data.cars;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      return [];
    }
  };
  // RESET LOCATION FUNCTION
  const handleResetLocation = () => {
    dispatch(clearSelectedLocation());
    setCurrentSlide(0);
  };
  const transformCarData = (apiCars) => {
    return apiCars.map((car) => ({
      id: car.id,
      name: car.car_model || "Car",
      location: car.car_location || "Location not specified",
      photos: car.photos || [],
      car_model: car.car_model || "Unknown Model",
      car_number: car.car_number || "N/A",
      // price: car.price || Math.floor(Math.random() * 200) + 50,
      // fuel_type: car.fuel_type || "Petrol",
      // transmission: car.transmission || "Automatic",
      // seats: car.seats || 5,
      // year: car.year ,
      // rating: car.rating || (4 + Math.random()).toFixed(1),
      // mileage: car.mileage || `${Math.floor(Math.random() * 50) + 10} km/l`
    }));
  };


    // FUNCTION TO FILTER CARS BY LOCATION
    const filterCarsByLocation = (cars, location) => {
      if (!location) return cars; // If no location selected, show all cars
      
      console.log('Filtering cars for location:', location);
      
      return cars.filter(car => {
        const carLocation = (car.location || '').toLowerCase();
        const selectedCity = (location.name || '').toLowerCase();
        const selectedState = (location.state || '').toLowerCase();
        const selectedCode = (location.code || '').toLowerCase();
        
        // Check if car location contains city name, state, or code
        return carLocation.includes(selectedCity) || 
               carLocation.includes(selectedState) ||
               carLocation.includes(selectedCode);
      });
    };
  
  // Handle responsive items per slide
  const updateItemsPerSlide = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    
    if (width < 480) {
      setItemsPerSlide(1);
    } else if (width < 768) {
      setItemsPerSlide(2);
    } else if (width < 1024) {
      setItemsPerSlide(3);
    } else {
      setItemsPerSlide(4);
    }
  }, []);

  // Fetch data on mount
  // FETCH AND FILTER CARS BASED ON LOCATION
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoadingRedux(true));
        const apiCars = await fetchAllCarsFromAPI();
        
        if (apiCars.length > 0) {
          const transformed = transformCarData(apiCars);
          
          // FILTER CARS BY SELECTED LOCATION
          const filteredCars = selectedLocation 
            ? filterCarsByLocation(transformed, selectedLocation)
            : transformed;
            
          console.log('Total cars:', transformed.length, 'Filtered cars:', filteredCars.length);
          setLocalCars(filteredCars);
          dispatch(setCarsRedux(apiCars));
        } else {
          setLocalCars([]);
          dispatch(setCarsRedux([]));
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setLocalCars([]);
        dispatch(setCarsRedux([]));
      } finally {
        dispatch(setLoadingRedux(false));
        setHasFetched(true);
      }
    };

    if (!hasFetched || reduxCars.length === 0) {
      fetchData();
    } else if (reduxCars.length > 0) {
      // When location changes, re-filter existing cars
      const transformed = transformCarData(reduxCars);
      const filteredCars = selectedLocation 
        ? filterCarsByLocation(transformed, selectedLocation)
        : transformed;
      console.log('Re-filtering cars based on location change');
      setLocalCars(filteredCars);
    }

    // Setup responsive handling
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);

    return () => {
      window.removeEventListener('resize', updateItemsPerSlide);
    };
  }, [dispatch, hasFetched, reduxCars.length, selectedLocation, updateItemsPerSlide]); 


    // Reset carousel when location changes
    useEffect(() => {
      setCurrentSlide(0);
    }, [selectedLocation]);

  const totalSlides = Math.max(1, Math.ceil(localCars.length / itemsPerSlide));

  // Carousel navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev >= totalSlides - 1) {
        // If at last slide, go back to first with smooth transition
        setTimeout(() => {
          setCurrentSlide(0);
        }, 50);
        return 0;
      }
      return prev + 1;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        // If at first slide, go to last
        return totalSlides - 1;
      }
      return prev - 1;
    });
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || localCars.length === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds for auto-play

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide, localCars.length]);

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Touch events for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Pause auto-play on hover for desktop
  const handleMouseEnter = () => {
    if (isAutoPlaying && !isMobile) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isAutoPlaying && !isMobile) {
      setIsAutoPlaying(true);
    }
  };

  // Toggle favorite
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const updated = favorites.includes(id) 
      ? favorites.filter((f) => f !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const renderCarImage = (car) => {
    if (car.photos && car.photos.length > 0) {
      return (
        <div className="car-image-container">
          <img 
            src={car.photos[0]} 
            alt={`${car.car_model || car.name}`}
            className="car-image"
            loading="lazy"
          />
 {selectedLocation && (
            <div className="location-match-badge">
              <MapPin size={12} />
              <span>In {selectedLocation.name}</span>
            </div>
          )}        </div>
      );
    } else {
      return (
        <div className="car-image-placeholder">
          <div className="car-icon">🚗</div>
          <div className="car-model">{car.car_model || car.name}</div>
        </div>
      );
    }
  };

  if (reduxLoading && localCars.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="carousel-container1">
      <div className="carousel-header">
      <div>
          {/* UPDATE TITLE BASED ON LOCATION */}
          <h2 className="carousel-title">
            {selectedLocation 
              ? `Cars in ${selectedLocation.name}`
              : 'Our Premium Fleet'
            }
          </h2>
          <p className="carousel-subtitle">
            {selectedLocation
              ? `${localCars.length} car${localCars.length !== 1 ? 's' : ''} available in ${selectedLocation.name}`
              : 'Explore our curated collection of vehicles'
            }
          </p>
        </div>
        {selectedLocation && (
            <button 
              className="reset-location-btn"
              onClick={handleResetLocation}
              title={`Clear ${selectedLocation.name} filter`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '5px',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#02287c';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.color = '#64748b';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <X size={16} />
              Clear Filter
            </button>
          )}
        <div className="carousel-controls-group">

          <div className="carousel-controls">
            <button 
              className="carousel-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button 
              className="carousel-btn next-btn"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {localCars.length === 0 ? (
           <div className="empty-state">
           <div className="empty-icon">🚗</div>
           <h3>
             {selectedLocation
               ? `No cars found in ${selectedLocation.name}`
               : 'No cars available'
             }
           </h3>
           <p>
             {selectedLocation
               ? 'Try selecting a different location'
               : 'Check back later for new additions to our fleet'
             }
           </p>
         </div>
      ) : (
        <>
          <div 
            className="carousel-wrapper"
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
             
              }}
            >
              {localCars.map((car) => (
                <div 
                  key={car.id}
                  className="car-card"
                  style={{
                    width: `${100 / itemsPerSlide}%`
                  }}
                  onClick={() => navigate(`/book/${car.id}`, { 
                    state: { 
                      car: {
                        ...car,
                         originalData: reduxCars.find(c => c.id === car.id) || car
                      }
                    } 
                  })}
                >
                  <div className="card-inner">
                    <button 
                      className={`favorite-btn ${favorites.includes(car.id) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(car.id, e)}
                      aria-label={favorites.includes(car.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(car.id) ? '❤️' : '🤍'}
                    </button>

                    {renderCarImage(car)}

                    <div className="car-details">
                      <div className="car-header">
                        <h3 className="car-name">{car.car_model || car.name}</h3>
                        {/* <div className="car-price">${car.price}<span>/day</span></div> */}
                      </div>
                      
                      {/* <div className="car-rating">
                        <span className="stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < Math.floor(car.rating) ? 'star-filled' : 'star-empty'}>
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="rating-text">{car.rating}</span>
                      </div> */}

                 

                      <div className="car-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{car.location}</span>
                      </div>

                      {/* <div className="car-mileage">
                        <span className="mileage-text">Mileage: {car.mileage}</span>
                      </div> */}

                      <button className="book-btn">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

       

       
        </>
      )}
    </div>
  );
};

export default NewPropertyCard;