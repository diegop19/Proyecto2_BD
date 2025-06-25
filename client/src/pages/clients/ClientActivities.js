import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultActivityImage from '../../images/default-activity.jpg';

const ClientActivities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar datos de empresas de recreación
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('/api/empresas-recreacion/all');
        if (!response.ok) throw new Error('Error al cargar actividades');
        const data = await response.json();
        setEmpresas(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching empresas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // Filtrar empresas
  const filteredEmpresas = empresas.filter(emp =>
    emp.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.Actividades_Ofrecidas && emp.Actividades_Ofrecidas.toLowerCase().includes(searchTerm.toLowerCase())) ||
    emp.Canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Distrito.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear actividades
  const formatActividades = (actividades) => {
    if (!actividades) return 'No especificado';
    const lista = actividades.split(', ');
    if (lista.length > 3) {
      return `${lista.slice(0, 3).join(', ')} y más...`;
    }
    return actividades;
  };

  // Manejar clic en tarjeta
  const handleCardClick = (id) => {
    navigate(`/activities/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando actividades...</p>
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
        <h2>Actividades Recreativas en Limón</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre, actividad o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredEmpresas.length > 0 ? (
          filteredEmpresas.map(emp => (
            <div 
              key={emp.ID_Empresa} 
              className="card"
              onClick={() => handleCardClick(emp.ID_Empresa)}
            >
              <div className="card-image-container">
                <img 
                  src={emp.Imagen_URL || defaultActivityImage} 
                  alt={emp.Nombre}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = defaultActivityImage;
                  }}
                />
                <div className="card-badge">Actividades</div>
              </div>
              
              <div className="card-content">
                <h3>{emp.Nombre}</h3>
                
                <div className="card-info-section">
                  <div className="info-item">
                    <span className="info-label">Ubicación:</span>
                    <span className="info-value">{emp.Distrito}, {emp.Canton}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{emp.Senas_Exactas || 'No especificada'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Actividades:</span>
                    <span className="info-value">{formatActividades(emp.Actividades_Ofrecidas)}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Contacto:</span>
                    <span className="info-value">
                      {emp.Telefono || 'No especificado'}
                      {emp.Email && ` | ${emp.Email}`}
                    </span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <Link 
                    to={`/activities/book?empresa=${emp.ID_Empresa}`}
                    className="card-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Reservar Actividad
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron actividades que coincidan con tu búsqueda.</p>
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

export default ClientActivities;