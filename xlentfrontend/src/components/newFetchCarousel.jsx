import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewPropertyCard.css";

const NewPropertyCard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const placeholderImg = "https://via.placeholder.com/300x200?text=No+Image";
  
  // Mock car images for Indian cars
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

  // Function to fetch from free car API
  const fetchFromFreeAPI = async () => {
    try {
      const response = await axios.get('https://freetestapi.com/api/v1/cars');
      return response.data;
    } catch (err) {
      console.log('Free API failed, using fallback data');
      return generateFallbackData();
    }
  };

  // Function to fetch from NHTSA API
  const fetchFromNHTSA = async () => {
    try {
      const response = await axios.get(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json'
      );
      const makes = response.data.Results.slice(0, 12);
      return generateCarDataFromMakes(makes);
    } catch (err) {
      console.log('NHTSA API failed, using fallback data');
      return generateFallbackData();
    }
  };

  // Generate car data from makes for Indian market
  const generateCarDataFromMakes = (makes) => {
    const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Compact", "MUV"];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
    const popularIndianCars = ["Swift Dzire", "Hyundai Creta", "Tata Nexon", "Honda City", "Maruti Baleno", "Mahindra Scorpio"];
    
    return makes.slice(0, 12).map((make, index) => ({
      id: make.Make_ID,
      name: make.Make_Name,
      model: popularIndianCars[index % popularIndianCars.length],
      type: carTypes[index % carTypes.length],
      dailyRate: Math.floor(Math.random() * 3000) + 800, // ₹800-₹3800 per day
      image: carImages[index % carImages.length],
      location: locations[index % locations.length],
      seats: Math.floor(Math.random() * 4) + 4, // 4-7 seats
      luggage: Math.floor(Math.random() * 3) + 1, // 1-3 bags
      transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      available: Math.random() > 0.2,
      mileage: `${Math.floor(Math.random() * 10) + 15} kmpl`,
      features: ["AC", "Bluetooth", "GPS", "Backup Camera", "Airbags", "Power Windows"].slice(0, 3 + Math.floor(Math.random() * 3))
    }));
  };

  // Fallback data with Indian car brands
  const generateFallbackData = () => {
    const indianCarMakes = [
      { Make_ID: 1, Make_Name: "Maruti Suzuki" },
      { Make_ID: 2, Make_Name: "Hyundai" },
      { Make_ID: 3, Make_Name: "Tata Motors" },
      { Make_ID: 4, Make_Name: "Mahindra" },
      { Make_ID: 5, Make_Name: "Honda" },
      { Make_ID: 6, Make_Name: "Toyota" },
      { Make_ID: 7, Make_Name: "Ford" },
      { Make_ID: 8, Make_Name: "Renault" },
      { Make_ID: 9, Make_Name: "Volkswagen" },
      { Make_ID: 10, Make_Name: "Skoda" },
      { Make_ID: 11, Make_Name: "MG Motor" },
      { Make_ID: 12, Make_Name: "Kia" }
    ];
    return generateCarDataFromMakes(indianCarMakes);
  };

  // Main fetch function
  async function fetchCars() {
    setLoading(true);
    try {
      // Try free API first, then NHTSA, then fallback
      let carData = await fetchFromFreeAPI();
      
      if (!carData || carData.length === 0) {
        carData = await fetchFromNHTSA();
      }
      
      setCars(carData);
    } catch (err) {
      console.error("API Error:", err);
      setCars(generateFallbackData());
    } finally {
      setLoading(false);
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
    fetchCars();
  }, []);

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
                src={car.image}
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