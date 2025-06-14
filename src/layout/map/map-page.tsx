import './map-page.css';
import Maps from '../../components/maps/map';
import logo from '../../assets/logo.png';
import { Container } from 'react-bootstrap';
import ReportIncidentModal from '../report-incident/report-incident';
import { useState } from 'react';

const Mapa = () => {
    const [showIncidentModal, setShowIncidentModal] = useState(false);

    return (
        <Container fluid className='map-container'>
            <Maps/>
            <div className="logo-picture-map">
                <img src={logo} alt="Logo" onError={(e) => { e.currentTarget.src = '/default-logo.png';}}/>
            </div>
        </Container>
    );
};

export default Mapa;