import React, { useEffect, useState } from "react";
import { 
  Star,
  Clock,
  Tag,
  Shield,
  Zap,

  Car,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Award,
  Percent,
  Timer,
  ArrowRight,
  Phone
} from "lucide-react";
import Footer from "../Footer/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const   SpecialDeals = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [cars, setCars] = useState([]);
const [loadingCars, setLoadingCars] = useState(false);
const [carsError, setCarsError] = useState("");

  const reduxCars = useSelector((state) => state.cars.cars);
  const navigate = useNavigate();

  const dealCategories = [
    { id: "all", label: "All Deals" },
    { id: "weekend", label: "Weekend Specials" },
    { id: "long-term", label: "Long Term" },
    { id: "economy", label: "Economy" },
    { id: "20", label: "24 Seater" },
  ];



  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      setCarsError("");
  
      const token = localStorage.getItem("xlent_token");
      const apiUrl = process.env.REACT_APP_API_BASE_URL
        ? `${process.env.REACT_APP_API_BASE_URL}/api/cars`
        : "https://xlent-production.up.railway.app/api/cars";
  
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch cars: ${res.status} - ${errorText}`);
      }
  
      const data = await res.json();
      const fetchedCars = data.cars || data || [];
  
      const enhancedCars = fetchedCars.map(car => ({
        ...car,
        display_location: car.car_location || "Not specified",
        location: car.car_location || "Not specified",
      }));
      
  
      setCars(enhancedCars);
    } catch (err) {
      console.error("Car fetch error:", err);
      setCarsError(err.message);
    } finally {
      setLoadingCars(false);
    }
  };
  useEffect(() => {
    fetchCars();
  }, []);
  
  const mapCarsToDeals = (cars) => {
    return cars.map((car) => ({
      id: car.id,
      carData: car,   // ✅ keep original car here
      title: `${car.car_model} Deal`,
      category: ["economy"],
      originalPrice: (car.price_per_day || 2500) + 500,
      discountedPrice: car.price_per_day || 3000,
      discount: 20,
      period: "Per Day",
      features: ["Unlimited KMs"],
      vehicle: car.car_model,
      imageColor: "bg-blue-100",
      popular: true,
      tag: "Fleet Offer",
      expiry: "2024-12-31",
      photos: car.photos || [],
      location: car.display_location,
    }));
  };
  
  const specialDeals = mapCarsToDeals(cars);

  const filteredDeals = specialDeals.filter(deal => {
    // Search Filter
    const matchesSearch = !searchQuery || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      deal.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    // Category/Seater Filter
    let matchesCategory = true;
    if (selectedFilter !== "all") {
      // Check if selectedFilter is a number (for seaters)
      const seatCount = parseInt(selectedFilter);
      if (!isNaN(seatCount)) {
        matchesCategory = deal.seats === seatCount;
      } else {
        // Otherwise check category tags
        matchesCategory = deal.category.includes(selectedFilter);
      }
    }

    return matchesSearch && matchesCategory;
  });


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscriberEmail) return;

    try {
      setIsSubscribing(true);
      setSubscribeMessage("");
      const res = await fetch("https://xlent-production.up.railway.app/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      setSubscribeMessage("Thank you! We'll send you our best deals.");
      setSubscriberEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setSubscribeMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };


  const sortDeals = (deals) => {
    switch(sortBy) {
      case "discount":
        return [...deals].sort((a, b) => b.discount - a.discount);
      case "price":
        return [...deals].sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "popularity":
        return [...deals].sort((a, b) => b.popular - a.popular);
      default:
        return deals;
    }
  };
 
  

  const sortedDeals = sortDeals(filteredDeals);

  const DealCard = ({ deal }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-2" >
        {loadingCars && (
  <div className="text-center py-5">
    <p>Loading deals...</p>
  </div>
)}

{carsError && (
  <div className="alert alert-danger text-center">
    {carsError}
  </div>
)}

        <div className="card border-0 shadow-sm h-100 hover-shadow-lg transition-all duration-300">
          {/* Deal Badge */}
          <div className="position-absolute top-0 end-0 m-3">
            <div className="badge bg-danger bg-opacity-90 text-white px-3 py-1">
              <Percent size={14} className="me-1" />
              {deal.discount}% OFF
            </div>
          </div>

          {/* Popular Tag */}
          {deal.popular && (
            <div className="position-absolute top-0 start-0 m-3">
              <div className="badge bg-warning text-dark px-3 py-2">
                <TrendingUp size={14} className="me-1" />
                {deal.tag}
              </div>
            </div>
          )}

          {/* Vehicle Image Placeholder */}
          <div className={`${deal.imageColor} p-5 text-center`}>
          {deal.photos?.length ? (
  <img
    src={deal.photos[0]}
    alt={deal.vehicle}
    className="img-fluid rounded"
    style={{ height: "120px", objectFit: "contain" }}
  />
) : (
  <Car size={60} className="text-primary mb-3" />
)}
            {/* <h5 className="text-dark fw-bold mb-0">{deal.vehicle}</h5> */}
          </div>

          {/* Card Body */}
          <div className="card-body">
            <h5 className="card-title text-dark fw-bold mb-2">{deal.title}</h5>
            
            <div className="d-flex align-items-center mb-3">
              <Clock size={16} className="text-primary me-2" />
              <span className="text-muted small">{deal.period}</span>
            </div>

            {/* Price Section */}
            <div className="mb-3">
              <div className="d-flex align-items-end">
                <span className="h3 fw-bold text-primary">₹{deal.discountedPrice}</span>
                <span className="text-muted text-decoration-line-through ms-2">₹{deal.originalPrice}</span>
                <span className="ms-auto badge bg-success bg-opacity-10 text-success">
                  Save ₹{deal.originalPrice - deal.discountedPrice}
                </span>
              </div>
              <div className="text-muted small">All taxes included</div>
            </div>

            {/* Features */}
            <div className="mb-3">
              {deal.features.slice(0, expanded ? deal.features.length : 2).map((feature, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <CheckCircle size={14} className="text-success me-2" />
                  <span className="small">{feature}</span>
                </div>
              ))}
              
              {deal.features.length > 2 && (
                <button 
                  className="btn btn-link p-0 text-primary small text-decoration-none"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show less' : `+${deal.features.length - 2} more features`}
                  {expanded ? <ChevronDown size={14} className="ms-1" /> : <ChevronRight size={14} className="ms-1" />}
                </button>
              )}
            </div>


            {/* Action Button */}
            <button
  className="btn btn-primary w-100"
  onClick={() =>
    navigate(`/book/${deal.id}`, {
      state: {
        car: {
          ...deal.carData,
          originalData:
            reduxCars.find((c) => c.id === deal.id) || deal.carData,
        },
      },
    })
  }
>
  Book Now <ArrowRight size={16} className="ms-2" />
</button>


           
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-dark min-vh-100">
      {/* Hero Banner */}
<div 
  className="text-white py-4"
  style={{
    background: 'linear-gradient(135deg,rgb(14, 6, 123) 0%,rgb(9, 31, 177) 100%)'
  }}
>        <div className="container" style={{marginTop:'70px'}}>
          <div className="row align-items-center">
            <div className="col-12 col-lg-8 mb-2">
              <h1 className="display-4 fw-bold mb-3">
                <Tag className="me-3" size={48} />
                Special Deals & Offers
              </h1>
            
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <div className="d-flex align-items-center">
                    <Award size={20} className="me-2" />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>
                <div className="me-4">
                  <div className="d-flex align-items-center">
                    <Shield size={20} className="me-2" />
                    <span>Trusted Service</span>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center">
                    <Zap size={20} className="me-2" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-light py-4">
        <div className="container">
          <div className="row g-3">

          {/* Category Filters */}
<div className="col-12 col-md-12 col-lg-5">
  <div 
    className="d-flex flex-nowrap flex-lg-wrap gap-2 pb-2 pb-lg-0" 
    style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
  >
    {dealCategories.map(category => (
      <button
        key={category.id}
        className={`btn btn-sm text-nowrap ${selectedFilter === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setSelectedFilter(category.id)}
      >
        {category.label}
      </button>
    ))}
  </div>
</div>

            {/* Sort */}
            <div className="col-12 col-lg-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Filter size={18} className="text-primary" />
                </span>
                <select 
                  className="form-select border-start-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="discount">Highest Discount</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container py-5">
        {/* Results Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h3 text-dark mb-1">Available Deals</h2>
               
              </div>
              <div className="text-end">
                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <Star size={14} className="me-1" />
                  Best Deals Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals */}
        {sortedDeals.length > 0 ? (
          <div className="row">
            {sortedDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <Tag size={80} />
            </div>
            <h3 className="h4 text-dark mb-3">No deals found</h3>
            <p className="text-muted mb-4">
              Try adjusting your filters or check back later for new offers.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
            >
              View All Deals
            </button>
          </div>
        )}

      {/* Newsletter Section */}
<div className="row mt-5 pt-5">
  <div className="col-12">
    <div
      className="card border-0 text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #02287c 0%, #0d6efd 100%)",
        borderRadius: "15px",
      }}
    >
      <div className="row g-0 align-items-center">
        <div className="col-12 col-lg-8 p-4 p-lg-5">
          <h3 className="h2 fw-bold mb-3">Don't Miss Our Best Deals!</h3>
          <p className="mb-4" style={{ opacity: "0.9" }}>
            Subscribe to get exclusive offers, early access to sales, and personalized deals.
          </p>

          <form className="row g-2" onSubmit={handleSubscribe}>
            <div className="col-12 col-md-8">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <button
                type="submit"
                className="btn btn-light text-primary btn-lg w-100 fw-bold"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>

          {subscribeMessage && (
            <div className="form-text mt-2" style={{ color: "white" }}>
              {subscribeMessage}
            </div>
          )}

          <div className="form-text text-white-50 mt-2">
            By subscribing, you agree to our Privacy Policy
          </div>
        </div>
        {/* right column unchanged */}
      </div>
    </div>
  </div>
</div>

        {/* FAQ Section */}
      
      </div>

 

      <Footer/>
    </div>
  );
};

export default SpecialDeals;