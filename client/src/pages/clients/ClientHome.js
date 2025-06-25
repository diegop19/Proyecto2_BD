import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
import clientHero from '../../images/imagen1.jpg';
import defaultLodgingImage from '../../images/default-lodging.jpg';
import defaultActivityImage from '../../images/default-activity.jpg';

const ClientHome = () => {
  const navigate = useNavigate();
  const [hospedajesDestacados, setHospedajesDestacados] = useState([]);
  const [actividadesDestacadas, setActividadesDestacadas] = useState([]);
  const [loading, setLoading] = useState({
    hospedajes: true,
    actividades: true
  });
  const [error, setError] = useState({
    hospedajes: null,
    actividades: null
  });

  // Cargar datos de establecimientos
  useEffect(() => {
    const fetchHospedajes = async () => {
      try {
        const response = await fetch('/api/establecimientos/all');
        if (!response.ok) throw new Error('Error al cargar hospedajes');
        const data = await response.json();
        // Seleccionar 3 al azar para mostrar como destacados
        const destacados = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setHospedajesDestacados(destacados);
      } catch (err) {
        setError(prev => ({...prev, hospedajes: err.message}));
        console.error('Error fetching hospedajes:', err);
      } finally {
        setLoading(prev => ({...prev, hospedajes: false}));
      }
    };

    fetchHospedajes();
  }, []);

  // Cargar datos de empresas de recreación
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('/api/empresas-recreacion/all');
        if (!response.ok) throw new Error('Error al cargar actividades');
        const data = await response.json();
        // Seleccionar 3 al azar para mostrar como destacados
        const destacados = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setActividadesDestacadas(destacados);
      } catch (err) {
        setError(prev => ({...prev, actividades: err.message}));
        console.error('Error fetching actividades:', err);
      } finally {
        setLoading(prev => ({...prev, actividades: false}));
      }
    };

    fetchActividades();
  }, []);

  // Componente de tarjeta reutilizable
const FeaturedCard = ({ item, type }) => {
    const defaultImage = type === 'hospedaje' ? defaultLodgingImage : defaultActivityImage;
    const imageUrl = item.Imagen_URL || defaultImage;

    return (
      <div className="featured-card">
        <div className="card-image-container">
          <img 
            src={imageUrl} 
            alt={item.Nombre} 
            className="card-image" 
          />
        </div>
        <div className="card-content">
          <h3>{item.Nombre}</h3>
          {type === 'hospedaje' && (
            <p className="card-type">{item.Tipo}</p>
          )}
          {type === 'actividad' && item.Actividades_Ofrecidas && (
            <p className="card-type">{item.Actividades_Ofrecidas.split(', ').slice(0, 2).join(', ')}</p>
          )}
          <button 
            onClick={() => navigate(`/${type === 'hospedaje' ? 'lodging' : 'activities'}/${item.ID_Establecimiento || item.ID_Empresa}`)}
            className="card-button"
          >
            Ver detalles
          </button>
        </div>
      </div>
    );
  };



  
  return (
    <div>
      <HeroSection
        title="EXPLORA LOS MEJORES HOSPEDAJES"
        subtitle="Encuentra tu alojamiento ideal en Limón"
        backgroundImage={clientHero}
        buttons={[{
          label: "Buscar Hospedajes",
          onClick: () => navigate('/lodging')
        }]}
      />

      <div className="main-content">
        {/* Sección de Hospedajes para ti */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Hospedajes para ti</h2>
            <button 
              onClick={() => navigate('/lodging')}
              className="text-link"
            >
              Ver más →
            </button>
          </div>
          
          {loading.hospedajes ? (
            <div className="loading-message">Cargando hospedajes...</div>
          ) : error.hospedajes ? (
            <div className="error-message">{error.hospedajes}</div>
          ) : (
            <div className="horizontal-list">
              {hospedajesDestacados.map(hospedaje => (
                <FeaturedCard 
                  key={hospedaje.ID_Establecimiento} 
                  item={hospedaje} 
                  type="hospedaje" 
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección de Actividades apasionantes */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Actividades apasionantes</h2>
            <button 
              onClick={() => navigate('/activities')}
              className="text-link"
            >
              Ver más →
            </button>
          </div>
          
          {loading.actividades ? (
            <div className="loading-message">Cargando actividades...</div>
          ) : error.actividades ? (
            <div className="error-message">{error.actividades}</div>
          ) : (
            <div className="horizontal-list">
              {actividadesDestacadas.map(actividad => (
                <FeaturedCard 
                  key={actividad.ID_Empresa} 
                  item={actividad} 
                  type="actividad" 
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClientHome;