import React, { useState, useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Search } from "lucide-react";
import './searchbar.css';

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  boundingbox: [number, number, number, number];
  importance?: number;
  type?: string;
}

interface SearchBarProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchCache, setSearchCache] = useState<Record<string, SearchResult[]>>({});
  
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

  // Limpiar el timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Verificar caché primero
    const cachedResults = searchCache[searchQuery.toLowerCase()];
    if (cachedResults) {
      setResults(cachedResults);
      setIsDropdownOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&namedetails=1&countrycodes=us,mx,ca,es&accept-language=en`
      );
      const data = await response.json();
      
      // Ordenar resultados por importancia
      const sortedResults = data.sort((a: SearchResult, b: SearchResult) => {
        return (b.importance || 0) - (a.importance || 0);
      });

      // Actualizar caché
      setSearchCache(prev => ({
        ...prev,
        [searchQuery.toLowerCase()]: sortedResults
      }));
      
      setResults(sortedResults.slice(0, 5));
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedResultIndex(-1);
    
    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer);
    
    // Set new timer
    setDebounceTimer(setTimeout(() => {
      handleSearch(value);
    }, 300));
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.display_name);
    setResults([]);
    setIsDropdownOpen(false);
    setSelectedResultIndex(-1);
    
    if (onLocationSelect) {
      onLocationSelect({ 
        lat: parseFloat(result.lat.toString()), 
        lng: parseFloat(result.lon.toString()) 
      });
    }
  };

  const handleInputFocus = () => {
    if (query && results.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedResultIndex >= 0 && results[selectedResultIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedResultIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="geo-searchbar-container" ref={geoSearchRef} style={{position: 'relative', zIndex: 990000 }}>
      <div className="geo-searchbar-input-wrapper" style={{ zIndex: 999000 }}>
        <input
          type="text"
          ref={geoInputRef}
          className="geo-searchbar-input-field"
          placeholder="Busca una ubicación"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        <Search className="geo-searchbar-search-icon" />
        {isLoading && (
          <div className="geo-searchbar-loading-indicator">Cargando...</div>
        )}
      </div>
      
      {isDropdownOpen && results.length > 0 && (
        <ul className="geo-searchbar-results-dropdown">
          {results.map((result, index) => (
            <li 
              key={`geo-result-${result.display_name}-${index}`} 
              className={`geo-searchbar-result-item ${
                index === selectedResultIndex ? 'geo-searchbar-result-item-selected' : ''
              }`}
              onClick={() => handleResultClick(result)}
            >
              {result.display_name}
              {result.type && (
                <span className="geo-searchbar-result-type">{result.type}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;