import './map-page.css';
import fotoFondo from '../../assets/mapa.jpg';

const Mapa = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${fotoFondo})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '100vh',              // Usa viewport height en lugar de porcentaje
                width: '100vw',               // Usa viewport width para consistencia
                margin: 0,
                padding: 0,
                position: 'fixed',
                top: 0,
                left: 0
            }}
        >
        </div>
    );
};

export default Mapa;