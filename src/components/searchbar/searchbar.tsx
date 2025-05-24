import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search } from "lucide-react";
import './searchbar.css';

/**
 * @global
 * Intefraz encargada de recibir los datos del resultado de búsqueda.
 * 
 * @param {string} display_name - Nombre
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {[number, number, number, number]} boundingbox - Límites
 * 
 * @interface
 */
interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  boundingbox: [number, number, number, number];
}

/**
 * @global
 * Interfaz que contiene las propiedades de la barra de búsqueda.
 * 
 * @param {function} [onLocationSelect] - Función que selecciona la locación.
 * 
 * @interface
 */
interface SearchBarProps {

  /**
   * 
   * @typedef {{number, number}} location - Locación
   * @property {number} location.lat - Latitud
   * @property {number} location.lng - Longitud
   */
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

/**
 * @global
 * Creador de barra de búsqeuda.
 * 
 * @apicall _ - `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
 * 
 * @param {function} onLocationSelect - Función que selecciona la locación.
 * 
 * @returns {JSX.Element} - Elemento correspondiente.
 * 
 * @eventProperty
 */
const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const geoSearchRef = useRef<HTMLDivElement>(null);
  const geoInputRef = useRef<HTMLInputElement>(null);

  // Manejar clics fuera del dropdown para cerrarlo
  useEffect(() => {

    /**
     * Manejador de clics afuera.
     * 
     * @param {MouseEvent} event - Evento de Mouse
     * 
     * @eventProperty
     */
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

  /**
   * Manejador de búsquedas.
   * 
   * @apicall _ - `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
   * 
   * @param {string} searchQuery - Query de búsqueda.
   * 
   * @returns {Promise<void>} - Representación de una operación asíncrona exitosa.
   */
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

  /**
   * Manejador de cambios de entrada.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio de entrada.
   * 
   * @eventProperty
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  /**
   * Manejador de clic sobre resultado.
   * 
   * @param {SearchResult} result - Resultado de búsqueda
   */
  const handleResultClick = (result: SearchResult) => {
    setQuery(result.display_name);
    setResults([]);
    setIsDropdownOpen(false);
    
    if (onLocationSelect) {
      onLocationSelect({ lat: parseFloat(result.lat.toString()), lng: parseFloat(result.lon.toString()) });
    }
  };

  /**
   * Manejador de entrada de fotos.
   */
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

/**
 * @module seachbar
 * 
 * Barra de búsqueda.
 * 
 * @remarks Módulo especializado en el manejo de solicitudes y creación de la barra de búsqueda.
 */
export default SearchBar;