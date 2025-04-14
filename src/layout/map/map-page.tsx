import './map-page.css';
import Map from '../../components/maps/map';
import logo from '../../assets/logo.png';
import { Container } from 'react-bootstrap';

const Mapa = () => {
    return (
        <Container fluid className='map-container'>
            <Map/>
            <div className="logo-picture-map">
                <img src={logo} alt="Logo" onError={(e) => { e.currentTarget.src = '/default-logo.png';}}/>
            </div>
            <div className="incident-button-wrapper">
                <button className="incident-button">+</button>
                <span className="incident-tooltip">Agregar incidente</span>
            </div>
        </Container>
    );
};

export default Mapa;



