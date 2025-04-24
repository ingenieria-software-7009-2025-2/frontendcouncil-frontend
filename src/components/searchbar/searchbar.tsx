import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './searchbar.css';

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  boundingbox: [number, number, number, number];
}

interface SearchBarProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const geoSearchRef = useRef<HTMLDivElement>(null);
  const geoInputRef = useRef<HTMLInputElement>(null);

  // Manejar clics fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (geoSearchRef.current && !geoSearchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.display_name);
    setResults([]);
    setIsDropdownOpen(false);
    
    if (onLocationSelect) {
      onLocationSelect({ lat: parseFloat(result.lat.toString()), lng: parseFloat(result.lon.toString()) });
    }
  };

  const handleInputFocus = () => {
    if (query && results.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <div className="geo-searchbar-container" ref={geoSearchRef}>
      <div className="geo-searchbar-input-wrapper">
        <input
          type="text"
          ref={geoInputRef}
          className="geo-searchbar-input-field"
          placeholder="Buscar lugares..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <span className="geo-searchbar-search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </span>
      </div>
      
      {isDropdownOpen && results.length > 0 && (
        <ul className="geo-searchbar-results-dropdown">
          {results.map((result, index) => (
            <li 
              key={`geo-result-${result.display_name}-${index}`} 
              className="geo-searchbar-result-item"
              onClick={() => handleResultClick(result)}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;