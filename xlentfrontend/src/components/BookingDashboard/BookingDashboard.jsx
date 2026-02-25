import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./BookingDashboard.css";

const BookingDashboard = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Load latest booking from localStorage
    const data = JSON.parse(localStorage.getItem("latestBooking"));
    setBookingData(data);
  }, []);

  if (!bookingData) {
    return (
      <div className="dashboard-empty">
        <h2 >No Record found</h2>
      </div>
    );
  }

  const { car, booking, total, customer } = bookingData;

  const today = new Date();
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  // Determine status
  let status = "upcoming"; // default
  if (today >= start && today <= end) status = "ongoing";
  else if (today > end) status = "completed";

  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  return (
    <div className="booking-dashboard">
      <h1>Booking Dashboard</h1>

      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="status-badge status-{status}">{status.toUpperCase()}</div>

        <div className="car-info">
          <img src={car.photos[0] || "placeholder.jpg"} alt={car.name} />
          <h2>{car.name} {car.model}</h2>
          <p>Daily Rate: ₹{car.dailyRate}</p>
        </div>

        <div className="booking-info">
          <p><strong>Pickup:</strong> {booking.startDate} {booking.startTime || ""}</p>
          <p><strong>Return:</strong> {booking.endDate} {booking.endTime || ""}</p>
          <p><strong>Duration:</strong> {durationDays} {durationDays === 1 ? "Day" : "Days"}</p>
          <p><strong>Total:</strong> ₹{total}</p>
        </div>

        <div className="customer-info">
          <p><strong>Name:</strong> {customer?.customer_name || "N/A"}</p>
          <p><strong>Email:</strong> {customer?.email || "N/A"}</p>
          <p><strong>Phone:</strong> {customer?.phone_number || "N/A"}</p>
        </div>

        <div className="dashboard-actions">
          <button onClick={() => navigate("/")}>Back to Fleet</button>
          <button
            onClick={() => {
              localStorage.removeItem("latestBooking");
              setBookingData(null);
            }}
          >
            Clear Booking
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingDashboard;
