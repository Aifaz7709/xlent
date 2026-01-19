import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCars as setCarsRedux, setLoading as setLoadingRedux } from "./Redux/Slices/carSlice";
import "./NewPropertyCard.css";

const NewPropertyCard = () => {
  const dispatch = useDispatch();
  // Get cars from Redux store
  const reduxCars = useSelector((state) => state.cars.cars);
  const reduxLoading = useSelector((state) => state.cars.loading);
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const placeholderImg = "https://via.placeholder.com/300x200?text=No+Image";
  
  // Mock car images for Indian cars (fallback)
  const carImages = [
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop", // Sedan
    "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=300&fit=crop", // SUV
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop", // Hatchback
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop", // Luxury
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop", // Compact
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"  // Sports
  ];

  function formatINR(value) {
    if (!value) return "-";
    return Number(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
  }

  // Transform backend car data to display format
  const transformCarData = (apiCars) => {
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
    
    return apiCars.map((car, index) => {
      // Extract car name and model from carName
      const carNameParts = car.carName ? car.carName.split(' ') : ['Car', 'Model'];
      const name = carNameParts[0] || 'Car';
      const model = carNameParts.slice(1).join(' ') || 'Model';
      
      // Use first photo if available, otherwise use placeholder
      const image = car.photos && car.photos.length > 0 
        ? car.photos[0] 
        : carImages[index % carImages.length];
      
      return {
        id: car.id || index,
        name: name,
        model: model,
        type: carTypes[index % carTypes.length],
        dailyRate: Math.floor(Math.random() * 3000) + 800, // ₹800-₹3800 per day
        image: image,
        location: locations[index % locations.length],
        seats: Math.floor(Math.random() * 4) + 4, // 4-7 seats
        luggage: Math.floor(Math.random() * 3) + 1, // 1-3 bags
        transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
        fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
        available: true,
        mileage: `${Math.floor(Math.random() * 10) + 15} kmpl`,
        features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3)),
        vinNumber: car.vinNumber
      };
    });
  };

  // Fallback data with Indian car brands
  const generateFallbackData = () => {
    const indianCarMakes = [
      { Make_ID: 1, Make_Name: "Maruti Suzuki", Make_Model: "Swift Dzire" },
      { Make_ID: 2, Make_Name: "Hyundai", Make_Model: "Creta" },
      { Make_ID: 3, Make_Name: "Tata Motors", Make_Model: "Nexon" },
      { Make_ID: 4, Make_Name: "Mahindra", Make_Model: "Scorpio" },
      { Make_ID: 5, Make_Name: "Honda", Make_Model: "City" },
      { Make_ID: 6, Make_Name: "Toyota", Make_Model: "Innova" }
    ];
    
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
    
    return indianCarMakes.map((make, index) => ({
      id: make.Make_ID,
      name: make.Make_Name,
      model: make.Make_Model,
      type: carTypes[index % carTypes.length],
      dailyRate: Math.floor(Math.random() * 3000) + 800,
      image: carImages[index % carImages.length],
      location: locations[index % locations.length],
      seats: Math.floor(Math.random() * 4) + 4,
      luggage: Math.floor(Math.random() * 3) + 1,
      transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      available: true,
      mileage: `${Math.floor(Math.random() * 10) + 15} kmpl`,
      features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3))
    }));
  };

  // Fetch cars from backend API (public endpoint - shows all cars)
// Fetch cars from backend API (public endpoint - shows all cars)
const fetchCarsFromAPI = async () => {
  try {
    // CHANGE THIS LINE: Add "/public" to the endpoint
    const apiUrl = process.env.REACT_APP_API_BASE_URL 
      ? `${process.env.REACT_APP_API_BASE_URL}/api/cars/public` 
      : 'http://localhost:5000/api/cars/public'; // <-- Added /public here
    
    const res = await fetch(apiUrl);

    if (!res.ok) {
      console.warn('Failed to fetch public cars, status:', res.status);
      return [];
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn('Response not JSON');
      return [];
    }

    const data = await res.json();
    return data.cars || [];
  } catch (err) {
    console.error('Error fetching cars from API:', err);
    return [];
  }
};

  // Main fetch function
  async function fetchCars() {
    setLoading(true);
    dispatch(setLoadingRedux(true));
    try {
      // First, try to fetch from backend API
      const apiCars = await fetchCarsFromAPI();
      
      if (apiCars && apiCars.length > 0) {
        // Transform and use API data
        const transformedCars = transformCarData(apiCars);
        setCars(transformedCars);
        // Update Redux store with fetched cars
        dispatch(setCarsRedux(apiCars));
      } else {
        // Fallback to mock data if API returns empty or fails
        const fallbackData = generateFallbackData();
        setCars(fallbackData);
        // Store fallback data in Redux too
        dispatch(setCarsRedux([]));
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      const fallbackData = generateFallbackData();
      setCars(fallbackData);
      dispatch(setCarsRedux([]));
    } finally {
      setLoading(false);
      dispatch(setLoadingRedux(false));
    }
  }

  function toggleFavorite(id) {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  useEffect(() => {
    // If Redux has cars, use them; otherwise fetch
    if (reduxCars && reduxCars.length > 0) {
      const transformedCars = transformCarData(reduxCars);
      setCars(transformedCars);
      setLoading(false);
    } else if (!reduxLoading && reduxCars.length === 0) {
      // Only fetch if Redux is not loading and has no cars
      fetchCars();
    }
  }, [reduxCars, reduxLoading]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Our Fleet</h4>
        <span className="text-muted small">❤️ Favorites: {favorites.length}</span>
      </div>

      <div className="row g-3">
        {cars.map((car) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={car.id}>
            <div
              className="property-card shadow-sm position-relative"
              onClick={() => (window.location.href = `/car/${car.id}`)}
            >
              {/* Favorite Button */}
              <div
                className="favorite-btn position-absolute top-0 end-0 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(car.id);
                }}
              >
                {favorites.includes(car.id) ? "❤️" : "🤍"}
              </div>

              {/* Availability Badge */}
              {!car.available && (
                <div className="availability-badge position-absolute top-0 start-0 m-2">
                  <span className="badge bg-danger">Not Available</span>
                </div>
              )}

              {/* Car Image */}
              <img
                src=""
                onError={(e) => (e.target.src = placeholderImg)}
                className="property-img"
                alt={`${car.name} ${car.model}`}
              />

              {/* Car Details */}
              <div className="p-3">
                <h6 className="fw-semibold mb-1">{car.name} {car.model}</h6>
                <p className="text-muted small mb-1">📍 {car.location}</p>
                <p className="small text-primary fw-semibold mb-1">{car.type}</p>

                <p className="fw-semibold mb-1">{formatINR(car.dailyRate)}/day</p>
                
                <div className="car-specs mb-2">
                  <span className="text-muted small me-2">👥 {car.seats} seats</span>
                  <span className="text-muted small me-2">🎒 {car.luggage} luggage</span>
                  <span className="text-muted small">⛽ {car.mileage}</span>
                </div>

                <div className="mb-2">
                  <span
                    className={`badge-chip ${
                      car.available ? "bg-success" : "bg-secondary"
                    } text-white me-1`}
                  >
                    {car.available ? "Available" : "Booked"}
                  </span>
                  <span className="badge-chip bg-info text-dark me-1">{car.fuelType}</span>
                  <span className="badge-chip bg-warning text-dark me-1">{car.transmission}</span>
                </div>

                <div className="features-list">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag small">{feature}</span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="feature-tag small">+{car.features.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPropertyCard;