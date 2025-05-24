import React from 'react';
import './page-not-found.css';
import Pentagon from '../../components/figures/pentagon/pentagon';

/**
 * @global
 * Lay-out para págiina no encontrada (404).
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 */
const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-container">
            <div className="pentagon-group">
                {/* Contenedor de pentágonos */}
                <div className="pentagon-wrapper">
                    <div className="pentagon-base">
                        <Pentagon fill="#9aaaba" stroke="#9aaaba" strokeWidth={2} cornerRadius={10} />
                    </div>
                    <div className="pentagon-rotated-20">
                        <Pentagon fill="none" stroke="#9aaaba" strokeWidth={2} cornerRadius={10} />
                    </div>
                    <div className="pentagon-rotated-10">
                        <Pentagon fill="none" stroke="#9aaaba" strokeWidth={2} cornerRadius={10} />
                    </div>
                    
                    <div className="pentagon-rotated-neg10">
                        <Pentagon fill="none" stroke="#9aaaba" strokeWidth={2} cornerRadius={10} />
                    </div>
                    <div className="pentagon-rotated-neg20">
                        <Pentagon fill="none" stroke="#9aaaba" strokeWidth={2} cornerRadius={10} />
                    </div>
                </div>
                
                {/* Texto 404 centrado */}
                <div className="error-code">404</div>
            </div>
            
            {/* Texto descriptivo */}
            <div className="error-text">
                <h1>Página no encontrada</h1>
                <p>Lo sentimos, no pudimos encontrar lo que estás buscando.</p>
                <p>Es posible que el enlace esté roto o que la página ya no exista.</p>
            </div>
        </div>
    );
};

/**
 * @module page-not-found
 * 
 * Lay-out 404 page-not-found.
 */
export default NotFoundPage;