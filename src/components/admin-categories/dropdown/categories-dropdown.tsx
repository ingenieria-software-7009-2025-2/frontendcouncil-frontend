import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Col, Row } from "react-bootstrap"
import './categories-dropdown.css';
import AddCategoryModal from "../modal/add-category";

/**
 * @global
 * Categorías temporales para filtrar incidentes.
 * 
 * @type {[number, string]}
 * @alpha
 */
const categoriasTemporales = [
  { id: 1, nombre: "Accidentes\ntransito" },
  { id: 2, nombre: "Categoría 2" },
  { id: 3, nombre: "Categoría 3" },
  { id: 4, nombre: "Categoría 4" },
  { id: 5, nombre: "Categoría 5" },
  { id: 6, nombre: "Categoría 6" },
  { id: 7, nombre: "Categoría 7" },
  { id: 8, nombre: "Categoría 8" },
];

/**
 * @global
 * Constructor de elemento DropdownCategories.
 * @returns {JSX.Element} Elemento correspondiente
 */
const DropdownCategories = () => {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState(categoriasTemporales);
  const toggleDropdown = () => setOpen(!open);

  /**
   * Manejador ante clic.
   * @remarks Abre modal para agregar categoría ante clic.
   */
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  /**
   * Gestor para guardar categorías.
   * @param {string} categoryName - Nombre de la categoría nueva.
   * @param {File | null} imageFile - Imagen de la categoría
   */
  const handleSaveCategory = (categoryName: string, imageFile: File | null) => {
    // Aquí puedes manejar la lógica para guardar la nueva categoría
    const newCategory = {
      id: categories.length + 1,
      nombre: categoryName,
      // Puedes agregar más propiedades según necesites, como la URL de la imagen
    };
    
    setCategories([...categories, newCategory]);
    setShowAddModal(false);
  };

  return (
    <div className="categories-container">
      <div className="categories-dropdown cursor-pointer" onClick={toggleDropdown}>
        <div className="flex items-center">
          {open ? <ChevronUp className="arrow-up" size={30} /> : <ChevronDown className="arrow-up" size={30} />}
          <span className="text-base">Categorías</span>
        </div>
      </div>
      
      {open && (
        <div className="dropdown-content-wrapper">
          <div className="dropdown-content">
          <Col xs={11} className="pe-2">
                <div className="categories-scroll-container">
                  <div className="categories-scroll">
                    {categories.map((cat, index) => (
                      <div key={`${cat.id}-${index}`} className="category-item">
                        <div className="category-circle">
                          {/* Aquí irá la imagen */}
                        </div>
                        <span className="category-name">
                          {cat.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              {/* Columna para el botón ADD */}
              <Col xs={1} className="d-flex justify-content-center">
                <div className="add-button-container">
                  <button className="add-button" onClick={handleAddClick}>
                    <div className="add-circle">
                      <Plus size={32} />
                    </div>
                    <span className="add-text">ADD</span>
                  </button>
                </div>
              </Col>
          </div>
        </div>
      )}

      {/* Modal para agregar nueva categoría */}
      <AddCategoryModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

/**
 * @module categories-dropdown
 *
 * Crea un espacio para la gestión de categorías para incidentes.
 *
 * @remarks Modulo especializado en la gestión de categorías sobre incidentes. Regresa el elemento.
 */
export default DropdownCategories;