import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/HeadernFooter/Navbar";
import BackButton from "./components/BackButton/BackButton";
import Hero from "./components/Hero";
import HeadingsSection from "./components/HeaderSection/HeadingsSection ";
import Login from "./components/Login&Reg/Login";
import RegisterPage from "./components/Login&Reg/Register";
import HelpCenter from "./components/HelpCenter/HelpCenter";
import SpecialDeals from "./components/SpecialDeals/SpecialDeals";
import AboutPage from "./components/AboutPage/AboutPage";
import TermsConditionsPage from "./components/TermsandConditions/TermsConditionsPage";
import TrialExpiredModal from "./components/TrialExpiredModal";
import AddCar from "./components/AddCar/AddCar";
import { useFreeTrial } from "./hooks/useFreeTrial";

const NewPropertyCard = lazy(() => import("./components/newFetchCarousel"));
const TrendingProperties = lazy(() => import("./components/TrendingProperties"));
const Gallery = lazy(() => import("./components/Gallery"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const Footer = lazy(() => import("./components/Footer/Footer"));

// ---------- PURE PROTECTED ROUTE ----------
const ProtectedRoute = ({ children, isAuthenticated, trialExpired }) => {
  if (!isAuthenticated && trialExpired) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Dashboard = () => (
  <main className="main-content">
    <HeadingsSection />
    <Hero />
    <NewPropertyCard />
    <Gallery />
    <Testimonials />
    <TrendingProperties />
    <Footer />
  </main>
);

// ---------- ROUTER WRAPPER ----------
function AppRoutes({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { trialExpired, timeRemaining } = useFreeTrial();

  // SINGLE SOURCE OF TRUTH FOR AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("xlent_token") && !!localStorage.getItem("xlent_user");
  });

  const handleLogout = () => {
    localStorage.removeItem("xlent_token");
    localStorage.removeItem("xlent_user");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        trialExpired={trialExpired}
      />

      <BackButton />
      <TrialExpiredModal show={trialExpired} timeRemaining={timeRemaining} />

      <Suspense
        fallback={
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                trialExpired={trialExpired}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-car"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                trialExpired={trialExpired}
              >
                <AddCar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/HelpCenter" element={<HelpCenter />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/deals" element={<SpecialDeals />} />
          <Route path="/terms" element={<TermsConditionsPage />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

// ---------- APP ROOT ----------
function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Router>
      <AppRoutes theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
}

export default App;