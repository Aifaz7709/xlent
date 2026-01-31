import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { cities } from '../LocationModal/cities';

const LocationSelect = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.code.toLowerCase().includes(query.toLowerCase())
  );

  const selectedCity = cities.find(c => c.id === value);

  return (
    <div className="position-relative" ref={wrapperRef}>
      {/* Input */}
      <div
        className="form-control d-flex align-items-center justify-content-between"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <span className={selectedCity ? '' : 'text-muted'}>
          {selectedCity
            ? `${selectedCity.name}, ${selectedCity.state}`
            : 'Select City'}
        </span>
        <MapPin size={18} />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
          style={{ zIndex: 1000, maxHeight: 260, overflowY: 'auto' }}
        >
          <input
            type="text"
            className="form-control border-0 border-bottom"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {filteredCities.length === 0 && (
            <div className="p-3 text-muted small">No cities found</div>
          )}

          {filteredCities.map(city => (
            <div
              key={city.id}
              className="px-3 py-2 city-option"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onSelect(city);
                setOpen(false);
                setQuery('');
              }}
            >
              <strong>{city.name}</strong>
              <div className="text-muted small">
                {city.state} • {city.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
