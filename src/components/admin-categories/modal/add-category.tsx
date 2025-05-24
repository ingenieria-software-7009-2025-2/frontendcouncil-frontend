import React, { useState, useRef, ChangeEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

/**
 * @global
 * Interfaz de propiedades para modal para agregar categoría.
 * 
 * @param {boolean} show -  Mostrar interfaz.
 * @param {function} onHide - Función que indica la acción ante ocutar.
 * @param {function} onSave - Función que indica la acción al guardar.
 * 
 * @interface
 */
interface AddCategoryModalProps {
  show: boolean;

  /**
   * Función que indica la acción ante ocutar.
   */
  onHide: () => void;

  /**
   * Función que indica la acción al guardar.
   * 
   * @param {string} categoryName - Nombre de categoría
   * @param {File} [imageFile] - Archivo de imagen
   */
  onSave: (categoryName: string, imageFile: File | null) => void;
}

/**
 * @global
 * Constructor de modal para agregar categoría de incidente.
 * @param {boolean} show - Mostrar interfaz.
 * 
 * @param {function} onHide - Función que indica la acción ante ocutar.
 * @param {function} onSave - Función que indica la acción al guardar.
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 * 
 * @eventProperty
 */
const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ show, onHide, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Manejador de subida de imagenes.
   * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio ante entrada.
   * 
   * @eventProperty
   */
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  /**
   * Manejador de eliminación de imagenes.
   */
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Manejador para guardado de categoría.
   */
  const handleSave = () => {
    if (!categoryName.trim()) {
      alert('Por favor ingresa un nombre para la categoría');
      return;
    }
    onSave(categoryName, imageFile);
    setCategoryName('');
    setImagePreview(null);
    setImageFile(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered style={{ zIndex: 900000 }}>
      <Modal.Header closeButton> </Modal.Header>
      <Modal.Body className="text-center">
        {/* Contenedor del círculo con la imagen */}
        <div className="position-relative d-inline-block mb-3">
          <div 
            className="rounded-circle overflow-hidden" 
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #dee2e6'
            }}
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
            )}
          </div>
          
          {/* Botón para eliminar la imagen (solo visible cuando hay imagen) */}
          {imagePreview && (
            <button
              onClick={handleRemoveImage}
              className="position-absolute top-0 end-0 translate-middle btn btn-sm btn-danger rounded-circle"
              style={{ width: '30px', height: '30px' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Botón para subir/cambiar imagen */}
        <div className="mb-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Button
            variant="outline-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? 'Cambiar foto' : 'Subir una foto'}
          </Button>
        </div>

        {/* Input para el nombre de la categoría */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Escribir nombre de la categoría..."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Crear categoría
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * @module add-category
 *
 * Modal para agregar categoría.
 */
export default AddCategoryModal;