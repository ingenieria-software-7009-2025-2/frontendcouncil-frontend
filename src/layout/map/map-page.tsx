import './map-page.css';
import Maps from '../../components/maps/map';
import logo from '../../assets/logo.png';
import { Container } from 'react-bootstrap';
import ReportIncidentModal from '../report-incident/report-incident';
import { useState } from 'react';

/**
 * Lay-out para página para el mapa.
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 */
const Mapa = () => {
    const [showIncidentModal, setShowIncidentModal] = useState(false);

    return (
        <Container fluid className='map-container'>
            <Maps/>
            <div className="logo-picture-map">
                <img src={logo} alt="Logo" onError={(e) => { e.currentTarget.src = '/default-logo.png';}}/>
            </div>

            {/*
            <div className="incident-button-wrapper">
                <button className="incident-button" onClick={() => setShowIncidentModal(true)}>
                    +
                </button>
                <span className="incident-tooltip">Agregar incidente</span>
            </div>*/}

            {/* Modal de reporte de incidente 
            <ReportIncidentModal 
                show={showIncidentModal} 
                onHide={() => setShowIncidentModal(false)}/>*/}
        </Container>
    );
};

/**
 * @module map-page
 * 
 * Lay-out para el contenedor de la página del mapa.
 */
export default Mapa;