import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const CarContext = createContext(null);

export const useCars = () => {
  const ctx = useContext(CarContext);
  if (!ctx) {
    throw new Error("useCars must be used inside CarProvider");
  }
  return ctx;
};

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (err) {
      console.error("Car fetch failed:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <CarContext.Provider value={{ cars, setCars, fetchCars, loading }}>
      {children}
    </CarContext.Provider>
  );
};
