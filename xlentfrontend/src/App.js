import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./components/Redux/Store";

// ⚡ IMMEDIATELY NEEDED COMPONENTS (Above the fold)
import Navbar from "./components/HeadernFooter/Navbar";
import BackButton from "./components/BackButton/BackButton";
import Hero from "./components/GetStarted/Hero";
import HeadingsSection from "./components/HeaderSection/HeadingsSection ";
import FranchiseBanner from "./components/FranchiseBanner/FranchiseBanner";

// ⚡ LAZY LOAD EVERYTHING ELSE
const Login = lazy(() => import("./components/Login&Reg/Login"));
const RegisterPage = lazy(() => import("./components/Login&Reg/Register"));
const HelpCenter = lazy(() => import("./components/HelpCenter/HelpCenter"));
const SpecialDeals = lazy(() => import("./components/SpecialDeals/SpecialDeals"));
const AboutPage = lazy(() => import("./components/AboutPage/AboutPage"));
const TermsConditionsPage = lazy(() => import("./components/TermsandConditions/TermsConditionsPage"));
const AddCar = lazy(() => import("./components/AddCar/AddCar"));
const BookingPage = lazy(() => import("./components/Booking/BookingPage"));
const Qrcode = lazy(() => import("./components/Booking/Qrcode"));
const PrivacyPolicyPage = lazy(() => import("./components/TermsandConditions/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("./components/TermsandConditions/RefundPolicyPage"));
const CustomerDashboard = lazy(() => import("./components/CustForm/CustomerDashboard"));
const NewPropertyCard = lazy(() => import("./components/OverFleet/newFetchCarousel"));
const Gallery = lazy(() => import("./components/CustomerGallery/Gallery"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const Footer = lazy(() => import("./components/Footer/Footer"));

// ---------- PURE PROTECTED ROUTE ----------
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ---------- LAZY DASHBOARD WITH VIEWPORT LOADING ----------
const Dashboard = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showFranchiseBanner, setShowFranchiseBanner] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const galleryTriggerRef = React.useRef(null);
  const testimonialsTriggerRef = React.useRef(null);
  const footerTriggerRef = React.useRef(null);

  useEffect(() => {
    // Create intersection observers for lazy sections
    const galleryObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowGallery(true);
          galleryObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const testimonialsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowTestimonials(true);
          testimonialsObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFooter(true);
          footerObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    // Setup observers
    if (galleryTriggerRef.current) {
      galleryObserver.observe(galleryTriggerRef.current);
    }
    
    if (testimonialsTriggerRef.current) {
      testimonialsObserver.observe(testimonialsTriggerRef.current);
    }
    
    if (footerTriggerRef.current) {
      footerObserver.observe(footerTriggerRef.current);
    }

    return () => {
      if (galleryTriggerRef.current) galleryObserver.unobserve(galleryTriggerRef.current);
      if (testimonialsTriggerRef.current) testimonialsObserver.unobserve(testimonialsTriggerRef.current);
      if (footerTriggerRef.current) footerObserver.unobserve(footerTriggerRef.current);
    };
  }, []);

  return (
    <main className="main-content">
      {/* Above the fold - Load immediately */}
      <HeadingsSection />
      <Hero />
      
      {/* Lazy load carousel */}
      <Suspense fallback={<div className="skeleton-loader" style={{ height: '300px' }} />}>
        <NewPropertyCard />
      </Suspense>
      
      {/* Gallery Trigger - Hidden element to trigger loading */}
      <div ref={galleryTriggerRef} style={{ height: '100px', marginTop: '-50px' }} />
      
      {/* Gallery - Load on viewport */}
      <Suspense fallback={<div className="skeleton-loader" style={{ height: '300px' }} />}>
        {showGallery && <Gallery />}
      </Suspense>
      
      {/* Testimonials Trigger */}
      <div ref={testimonialsTriggerRef} style={{ height: '100px', marginTop: '-50px' }} />
      
      {/* Testimonials - Load on viewport */}
      <Suspense fallback={<div className="skeleton-loader" style={{ height: '250px' }} />}>
        {showTestimonials && <Testimonials />}
      </Suspense>
  
     <FranchiseBanner />

      
      {/* Footer Trigger */}
      <div ref={footerTriggerRef} style={{ height: '100px', marginTop: '-50px' }} />
      
      {/* Footer - Load on viewport */}
      <Suspense fallback={<div className="skeleton-loader" style={{ height: '200px' }} />}>
        {showFooter && <Footer />}
      </Suspense>
    </main>
  );
};

// ---------- ROUTER WRAPPER ----------
function AppRoutes({ theme, toggleTheme }) {
  const navigate = useNavigate();

  // SINGLE SOURCE OF TRUTH FOR AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("xlent_token") && !!localStorage.getItem("xlent_user");
  });

  const [userData, setUserData] = useState(() => {
    try {
      const user = localStorage.getItem("xlent_user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  // Preload components when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Preload authenticated components silently
      Promise.all([
        import("./components/AddCar/AddCar"),
        import("./components/CustForm/CustomerDashboard"),
        import("./components/Booking/BookingPage")
      ]).then(() => {
        console.log("Preloaded authenticated components");
      });
    }
  }, [isAuthenticated]);

  // Preload login page on hover of login button
  const preloadLogin = () => {
    import("./components/Login&Reg/Login");
  };

  // Handle login
  const handleLogin = (token, userData) => {
    localStorage.setItem("xlent_token", token);
    localStorage.setItem("xlent_user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserData(userData);
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("xlent_token");
    localStorage.removeItem("xlent_user");
    setIsAuthenticated(false);
    setUserData(null);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        userData={userData}
        onLogout={handleLogout}
        onLoginHover={preloadLogin} // Pass preload function to Navbar
      />

      <BackButton />

      {/* Minimal suspense fallback */}
      <Suspense fallback={
        <div className="minimal-loader">
          <div className="spinner-grow text-primary" role="status" />
        </div>
      }>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Authenticated Routes */}
          <Route
            path="/add-car"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Suspense fallback={<div className="skeleton-loader" style={{ minHeight: '400px' }} />}>
                  <AddCar />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Suspense fallback={<div className="skeleton-loader" style={{ minHeight: '400px' }} />}>
                  <CustomerDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading login...</div>}>
                <Login setIsAuthenticated={setIsAuthenticated} onLogin={handleLogin} />
              </Suspense>
            }
          />

          {/* Public Routes with Individual Suspense */}
          <Route 
            path="/register" 
            element={
              <Suspense fallback={<div>Loading registration...</div>}>
                <RegisterPage />
              </Suspense>
            } 
          />
          
          <Route 
            path="/HelpCenter" 
            element={
              <Suspense fallback={<div>Loading help center...</div>}>
                <HelpCenter />
              </Suspense>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <Suspense fallback={<div>Loading about page...</div>}>
                <AboutPage />
              </Suspense>
            } 
          />
          
          <Route 
            path="/deals" 
            element={
              <Suspense fallback={<div>Loading deals...</div>}>
                <SpecialDeals />
              </Suspense>
            } 
          />
          
          <Route 
            path="/terms" 
            element={
              <Suspense fallback={<div>Loading terms...</div>}>
                <TermsConditionsPage />
              </Suspense>
            } 
          />
          
          <Route 
            path="/book/:carId" 
            element={
              <Suspense fallback={<div>Loading booking...</div>}>
                <BookingPage />
              </Suspense>
            } 
          />
          
          <Route 
            path="/Payment" 
            element={
              <Suspense fallback={<div>Loading payment...</div>}>
                <Qrcode />
              </Suspense>
            } 
          />
          
          <Route 
            path="/PrivacyPolicy" 
            element={
              <Suspense fallback={<div>Loading privacy policy...</div>}>
                <PrivacyPolicyPage />
              </Suspense>
            } 
          />
          
          <Route 
            path="/RefundPolicy" 
            element={
              <Suspense fallback={<div>Loading refund policy...</div>}>
                <RefundPolicyPage />
              </Suspense>
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
    <Provider store={store}>
      <Router>
        <AppRoutes theme={theme} toggleTheme={toggleTheme} />
      </Router>
    </Provider>
  );
}

export default App;