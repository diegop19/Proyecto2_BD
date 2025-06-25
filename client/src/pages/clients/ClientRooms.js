import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultLodgingImage from '../../images/default-lodging.jpg';

const ClientRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar datos de establecimientos
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await fetch('/api/establecimientos/all');
        if (!response.ok) throw new Error('Error al cargar establecimientos');
        const data = await response.json();
        setEstablecimientos(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching establecimientos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimientos();
  }, []);

  // Filtrar establecimientos
  const filteredEstablecimientos = establecimientos.filter(est =>
    est.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.Canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.Distrito.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.Tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear servicios
  const formatServicios = (servicios) => {
    if (!servicios) return 'No especificado';
    const lista = servicios.split(', ');
    if (lista.length > 3) {
      return `${lista.slice(0, 3).join(', ')} y más...`;
    }
    return servicios;
  };

  // Manejar clic en tarjeta
  const handleCardClick = (id) => {
    navigate(`/lodging/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando establecimientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header">
        <h2>Hospedajes Disponibles en Limón</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre, tipo o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredEstablecimientos.length > 0 ? (
          filteredEstablecimientos.map(est => (
            <div 
              key={est.ID_Establecimiento} 
              className="card"
              onClick={() => handleCardClick(est.ID_Establecimiento)}
            >
              <div className="card-image-container">
                <img 
                  src={est.Imagen_URL || defaultLodgingImage} 
                  alt={est.Nombre}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = defaultLodgingImage;
                  }}
                />
                <div className="card-badge">{est.Tipo}</div>
              </div>
              
              <div className="card-content">
                <h3>{est.Nombre}</h3>
                
                <div className="card-info-section">
                  <div className="info-item">
                    <span className="info-label">Ubicación:</span>
                    <span className="info-value">{est.Distrito}, {est.Canton}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{est.Senas_Exactas || 'No especificada'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Servicios:</span>
                    <span className="info-value">{formatServicios(est.Servicios)}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Contacto:</span>
                    <span className="info-value">
                      {est.Telefono1 || 'No especificado'}
                      {est.Telefono2 && ` / ${est.Telefono2}`}
                    </span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <Link 
                    to={`/reservation?establecimiento=${est.ID_Establecimiento}`}
                    className="card-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron hospedajes que coincidan con tu búsqueda.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              Mostrar todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRooms;