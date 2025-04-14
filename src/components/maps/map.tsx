import fotoFondo from '../../assets/mapa.jpg';

const Map = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${fotoFondo})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '100vh',              
                width: '100vw',              
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

export default Map;

