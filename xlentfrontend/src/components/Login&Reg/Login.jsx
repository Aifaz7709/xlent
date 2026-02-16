  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, Shield } from "lucide-react";
  import "./Login.css";
  import { useSnackbar } from "../Snackbar/Snackbar";

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    "https://xlent-production.up.railway.app";

  const Login = ({ setIsAuthenticated, onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      username: "",
      password: "",
      rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { showSuccess, showError } = useSnackbar();

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      setErrors((prev) => {
        if (!prev[name]) return prev;
        return { ...prev, [name]: "" };
      });
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.username.trim()) {
        newErrors.username = "Username or Email is required";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length !== 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.username,
            password: formData.password,
          }),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(
            data.message || "Login failed. Please check your credentials."
          );
        }

        if (data.token) {
          const userData = {
            id: data.user?.id || "1",
            username: formData.username,
            name:
              data.user?.name ||
              formData.username.split("@")[0],
            email: data.user?.email || formData.username,
            ...data.user,
          };

          if (onLogin) {
            onLogin(data.token, userData);
          } else {
            localStorage.setItem("xlent_token", data.token);
            localStorage.setItem(
              "xlent_user",
              JSON.stringify(userData)
            );
            if (setIsAuthenticated) {
              setIsAuthenticated(true);
            }
          }

          showSuccess("Login successful!");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        showError(err.message || "Login failed. Try again.");
        
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="login-container">
        {/* Background Image */}
        <div className="position-absolute top-0 start-0 w-100 h-100 background-animation">
          <div
            className="w-100 h-100"
            style={{
              backgroundImage: "url('/OrginalLogo.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "rgba(255,255,255,0.92)",
              backgroundBlendMode: "overlay",
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="position-absolute w-100 h-100 gradient-overlay" />

        {/* Futuristic Glow Orbs */}
        <div className="glow-orb one"></div>
        <div className="glow-orb two"></div>

        {/* Login Card */}
        <div className="login-card position-relative z-2">
          <h2 className="login-title text-center mb-2">
            Welcome Back
          </h2>
          <p className="login-subtitle text-center mb-4">
            Admin access to XlentCar dashboard
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center">
                <User size={16} className="me-2" />
                Username or Email
              </label>
              <input
                type="text"
                name="username"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                placeholder="Enter username or email"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.username && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={14} className="me-2" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center">
                <Lock size={16} className="me-2" />
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={14} className="me-2" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="alert alert-danger mt-2">
                {errors.form}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-btn mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Footer */}
            <div className="text-center mt-4">
              <Shield size={14} className="me-2 text-success" />
              <small className="text-muted">
                Secure admin authentication
              </small>
            </div>

          </form>
        </div>
      </div>
    );
  };

  export default Login;
