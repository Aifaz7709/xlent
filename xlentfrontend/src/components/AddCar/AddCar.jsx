import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import './AddCar.css';

const AddCar = () => {
  const [formData, setFormData] = useState({
    carName: '',
    vinNumber: '',
    photos: []
  });
  const [photoPreview, setPhotoPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Fetch user's cars on mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api/cars` : 'http://localhost:5000/api/cars';
      
      const res = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('fetchCars: expected JSON, got:', res.status, text);
        throw new Error(`Server returned non-JSON response (status ${res.status})`);
      }

      if (res.ok) {
        setCars(data.cars || []);
      } else {
        console.error('fetchCars failed', res.status, data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCars(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `${file.name} is too large (max 5MB)` });
        return false;
      }
      return true;
    });

    if (validFiles.length + formData.photos.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 photos allowed' });
      return;
    }

    // Convert to base64 for storage
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result]
        }));
        setPhotoPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.carName.trim() || !formData.vinNumber.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api/cars` : 'http://localhost:5000/api/cars';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('handleSubmit: expected JSON, got:', res.status, text);
        throw new Error(`Server returned non-JSON response (status ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add car');
      }

      // Use server message when available and update UI immediately
      setMessage({ type: 'success', text: data.message || 'Car added successfully!' });

      // If server returned the created car, prepend it to the list for immediate feedback
      if (data.car) {
        setCars(prev => [data.car, ...prev]);
      } else {  
        // Otherwise refresh list
        fetchCars();
      }

      setFormData({ carName: '', vinNumber: '', photos: [] });
      setPhotoPreview([]);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error adding car' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('xlent_token');
      const apiUrl = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api/cars/${carId}` : `http://localhost:5000/api/cars/${carId}`;
      
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setCars(prev => prev.filter(car => car.id !== carId));
        setMessage({ type: 'success', text: 'Car deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error deleting car' });
    }
  };

  return (
    <div className="min-vh-100 py-5 add-car-container fade-in" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          {/* Add Car Form */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold mb-4 d-flex align-items-center">
                  <Plus size={24} className="me-2 text-primary" />
                  Add New Car
                </h3>

                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} d-flex align-items-center mb-4`} role="alert">
                    {message.type === 'success' ? (
                      <CheckCircle size={18} className="me-2" />
                    ) : (
                      <AlertCircle size={18} className="me-2" />
                    )}
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Car Name */}
                  <div className="mb-3">
                    <label htmlFor="carName" className="form-label fw-semibold">
                      Car Name *
                    </label>
                    <input
                      type="text"
                      id="carName"
                      name="carName"
                      className="form-control"
                      placeholder="e.g., Honda City 2022"
                      value={formData.carName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* VIN Number */}
                  <div className="mb-3">
                    <label htmlFor="vinNumber" className="form-label fw-semibold">
                      VIN Number *
                    </label>
                    <input
                      type="text"
                      id="vinNumber"
                      name="vinNumber"
                      className="form-control"
                      placeholder="e.g., 1HGCM82633A123456"
                      value={formData.vinNumber}
                      onChange={handleInputChange}
                      maxLength="17"
                      required
                    />
                    <small className="text-muted">17-character Vehicle Identification Number</small>
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-4">
                    <label htmlFor="photos" className="form-label fw-semibold">
                      Car Photos (Max 5)
                    </label>
                    <div className="photo-drop-zone border-2 border-dashed rounded p-4 text-center slide-up" style={{
                      borderColor: '#dee2e6',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'rgb(2, 40, 124)';
                      e.currentTarget.style.backgroundColor = 'rgba(2, 40, 124, 0.05)';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = '#dee2e6';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#dee2e6';
                      handlePhotoUpload({ target: { files: e.dataTransfer.files } });
                    }}
                    >
                      <Upload size={32} className="text-primary mb-2 mx-auto" style={{ display: 'block' }} />
                      <p className="mb-1 upload-hint">Drag & drop photos here</p>
                      <p className="small text-muted upload-hint">or click to select (max 5, 5MB each)</p>
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="photos" className="btn btn-sm btn-outline-primary mt-2 add-car-actions" style={{ cursor: 'pointer' }}>
                        Select Photos
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {photoPreview.length > 0 && (
                      <div className="mt-3">
                        <p className="text-muted small mb-2">{photoPreview.length}/5 photos selected</p>
                        <div className="d-flex gap-2 flex-wrap">
                          {photoPreview.map((photo, index) => (
                            <div key={index} className="position-relative" style={{ width: '80px', height: '80px' }}>
                              <img 
                                src={photo} 
                                alt={`Preview ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                                style={{ transform: 'translate(4px, -4px)' }}
                                onClick={() => removePhoto(index)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Car...
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="me-2" style={{ display: 'inline' }} />
                        Add Car
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* My Cars List */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold mb-4">My Cars ({cars.length})</h3>

                {loadingCars ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : cars.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p className="mb-0">No cars added yet</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {cars.map(car => (
                      <div key={car.id} className="border rounded p-3 position-relative">
                        <h5 className="fw-bold mb-2">{car.carName}</h5>
                        <p className="text-muted small mb-2">
                          <strong>VIN:</strong> {car.vinNumber}
                        </p>
                        
                        {car.photos && car.photos.length > 0 && (
                          <div className="d-flex gap-2 mb-3 flex-wrap">
                            {car.photos.slice(0, 3).map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Car ${idx}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            ))}
                            {car.photos.length > 3 && (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                +{car.photos.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                        
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCar(car.id)}
                        >
                          <Trash2 size={14} className="me-1" style={{ display: 'inline' }} />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
