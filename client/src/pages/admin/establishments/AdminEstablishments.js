import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminEstablishments = () => {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await fetch('/api/establecimientos/all');
        if (!response.ok) {
          throw new Error('Error al cargar establecimientos');
        }
        const data = await response.json();
        setEstablecimientos(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimientos();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h2>Gestión de Establecimientos</h2>
        </div>
        <p>Cargando establecimientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h2>Gestión de Establecimientos</h2>
        </div>
        <p className="error-message">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Establecimientos</h2>
        <Link 
          to="/admin/establishments/register" 
          className="add-btn"
        >
          + Añadir Establecimiento
        </Link>
      </div>
      
      <div className="cards-container">
        {establecimientos.length > 0 ? (
          establecimientos.map(establecimiento => (
            <div key={establecimiento.ID_Establecimiento} className="management-card">
              <div className="card-content">
                <h3>{establecimiento.Nombre}</h3>
                <div className="card-details">
                  <p><strong>Tipo:</strong> {establecimiento.Tipo}</p>
                  <p><strong>Cédula Jurídica:</strong> {establecimiento.Cedula_Juridica}</p>
                  <p><strong>Teléfono:</strong> {establecimiento.Telefono1}</p>
                  {establecimiento.Telefono2 && <p><strong>Teléfono secundario:</strong> {establecimiento.Telefono2}</p>}
                  <p><strong>Email:</strong> {establecimiento.Email || 'No registrado'}</p>
                  <p><strong>Ubicación:</strong> {establecimiento.Provincia}, {establecimiento.Canton}, {establecimiento.Distrito}</p>
                  <p><strong>Barrio:</strong> {establecimiento.Barrio}</p>
                </div>
                <Link 
                  to={`/admin/establishments/${establecimiento.ID_Establecimiento}`}
                  className="text-link"
                >
                  Ver detalles completos →
                </Link>
              </div>
              
              <div className="card-management-actions">
                <Link 
                  to={`/admin/establishments/edit/${establecimiento.ID_Establecimiento}`}
                  className="management-btn secondary-btn"
                >
                  Editar
                </Link>
                <Link 
                  to={`/admin/establishments/${establecimiento.ID_Establecimiento}/rooms/types/register`}
                  className="management-btn"
                  state={{ idEstablecimiento: establecimiento.ID_Establecimiento }} 
                >
                  + Tipo Habitación
                </Link>
                <Link 
                  to={`/admin/establishments/${establecimiento.ID_Establecimiento}/rooms/register`}
                  className="management-btn"
                   state={{ idEstablecimiento: establecimiento.ID_Establecimiento }} 
                >
                  + Habitación
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay establecimientos registrados aún.</p>
            <Link 
              to="/admin/establishments/register" 
              className="text-link"
            >
              + Añadir tu primer establecimiento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEstablishments;