import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search } from "lucide-react";
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
          placeholder="Busca una ubicación"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <Search className="geo-searchbar-search-icon" />
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