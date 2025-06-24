import { Link, useParams, useLocation } from 'react-router-dom';

const AdminEstablishmentsDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  
  // Obtenemos el establecimiento desde el estado de navegación
  const establecimiento = state?.establecimiento;

  // Verificación exhaustiva
  if (!establecimiento || establecimiento.id !== Number(id)) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Establecimiento no encontrado</p>
          <Link to="/admin/establishments" className="submit-btn">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  // Tipos de habitación de ejemplo
  const tiposHabitacion = [
    { id: 1, idEstablecimiento: 1, nombre: "Habitación Standard", precio: 45000, capacidad: 2 },
    { id: 2, idEstablecimiento: 1, nombre: "Suite Junior", precio: 65000, capacidad: 2 },
    { id: 3, idEstablecimiento: 1, nombre: "Suite Familiar", precio: 85000, capacidad: 4 },
    { id: 4, idEstablecimiento: 2, nombre: "Cabaña Pequeña", precio: 35000, capacidad: 2 },
    { id: 5, idEstablecimiento: 2, nombre: "Cabaña Grande", precio: 55000, capacidad: 4 }
  ].filter(t => t.idEstablecimiento === establecimiento.id);

  // Habitaciones de ejemplo
  const habitaciones = [
    { id: 1, idTipo: 1, numero: "101", estado: "Disponible" },
    { id: 2, idTipo: 1, numero: "102", estado: "Ocupada" },
    { id: 3, idTipo: 2, numero: "201", estado: "Disponible" },
    { id: 4, idTipo: 3, numero: "301", estado: "Mantenimiento" },
    { id: 5, idTipo: 4, numero: "C1", estado: "Disponible" },
    { id: 6, idTipo: 5, numero: "C2", estado: "Disponible" }
  ].filter(h => tiposHabitacion.some(t => t.id === h.idTipo));

  return (
    <div className="container">
      {/* Top Section - Información del establecimiento */}
      <div className="top-section card-section">
        <div className="section-header">
          <h2>{establecimiento.nombre}</h2>
          <Link 
            to={`/admin/establishments/edit/${establecimiento.id}`}
            className="management-btn secondary-btn"
          >
            Editar Establecimiento
          </Link>
        </div>
        
        <div className="two-column-grid">
          <div className="info-column">
            <p><strong>ID:</strong> {establecimiento.id}</p>
            <p><strong>Cédula Jurídica:</strong> {establecimiento.cedulaJuridica}</p>
            <p><strong>Tipo:</strong> {establecimiento.tipo}</p>
            <p><strong>Teléfono Principal:</strong> {establecimiento.telefono1}</p>
            {establecimiento.telefono2 && (
              <p><strong>Teléfono Secundario:</strong> {establecimiento.telefono2}</p>
            )}
            <p><strong>Email:</strong> {establecimiento.email}</p>
          </div>
          
          <div className="info-column">
            <p><strong>Dirección:</strong></p>
            <p>{establecimiento.direccion.provincia}, {establecimiento.direccion.canton}</p>
            <p>{establecimiento.direccion.distrito}, {establecimiento.direccion.barrio}</p>
            <p><strong>Señas exactas:</strong> {establecimiento.direccion.senasExactas}</p>
            <p><strong>GPS (Plus Code):</strong> {establecimiento.direccion.gps}</p>
          </div>
        </div>
        
        {/* Redes sociales */}
        <div className="social-links">
          <h4>Redes Sociales</h4>
          <div className="social-grid">
            {establecimiento.redes.web && (
              <a href={establecimiento.redes.web} target="_blank" rel="noopener noreferrer">
                Página Web
              </a>
            )}
            {establecimiento.redes.facebook && (
              <a href={establecimiento.redes.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {establecimiento.redes.instagram && (
              <a href={establecimiento.redes.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {establecimiento.redes.youtube && (
              <a href={establecimiento.redes.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            )}
            {establecimiento.redes.tiktok && (
              <a href={establecimiento.redes.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            )}
            {establecimiento.redes.airbnb && (
              <a href={establecimiento.redes.airbnb} target="_blank" rel="noopener noreferrer">
                Airbnb
              </a>
            )}
            {establecimiento.redes.threads && (
              <a href={establecimiento.redes.threads} target="_blank" rel="noopener noreferrer">
                Threads
              </a>
            )}
            {establecimiento.redes.x && (
              <a href={establecimiento.redes.x} target="_blank" rel="noopener noreferrer">
                X (Twitter)
              </a>
            )}
            {Object.values(establecimiento.redes).every(val => !val) && (
              <p>No hay redes sociales registradas</p>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section - Tipos de hospedaje */}
      <div className="middle-section card-section">
        <div className="section-header">
          <h3>Tipos de Hospedaje</h3>
          <Link 
            to={`/admin/establishments/${establecimiento.id}/rooms/types/register`}
            className="management-btn"
          >
            + Añadir Tipo
          </Link>
        </div>
        
        <div className="types-list">
          {tiposHabitacion.length > 0 ? (
            tiposHabitacion.map(tipo => (
              <div key={tipo.id} className="type-item">
                <div className="type-info">
                  <h4>{tipo.nombre}</h4>
                  <p>Precio: ₡{tipo.precio.toLocaleString()}</p>
                  <p>Capacidad: {tipo.capacidad} persona{tipo.capacidad > 1 ? 's' : ''}</p>
                </div>
                <button 
                  className="filter-btn"
                  onClick={() => console.log('Filtrar por:', tipo.id)}
                >
                  Filtrar
                </button>
              </div>
            ))
          ) : (
            <p>No hay tipos de habitación registrados</p>
          )}
        </div>
      </div>

      {/* Bottom Section - Habitaciones */}
      <div className="bottom-section">
        <div className="section-header">
          <h3>Habitaciones Disponibles</h3>
        </div>
        
        <div className="rooms-grid">
          {habitaciones.length > 0 ? (
            habitaciones.map(habitacion => {
              const tipo = tiposHabitacion.find(t => t.id === habitacion.idTipo);
              return (
                <div key={habitacion.id} className="room-card">
                  <div className="room-content">
                    <h4>Habitación {habitacion.numero}</h4>
                    <p><strong>Tipo:</strong> {tipo?.nombre || 'Desconocido'}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`status-badge ${habitacion.estado.toLowerCase()}`}>
                        {habitacion.estado}
                      </span>
                    </p>
                    {tipo && (
                      <p><strong>Precio:</strong> ₡{tipo.precio.toLocaleString()}</p>
                    )}
                  </div>
                  
                  <div className="room-actions">
                    <Link 
                      to={`/admin/establishments/${establecimiento.id}/rooms/edit/${habitacion.id}`}
                      className="small-btn secondary-btn"
                    >
                      Editar
                    </Link>
                    <Link 
                      to={`/admin/establishments/${establecimiento.id}/rooms/${habitacion.id}`}
                      className="small-btn"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay habitaciones registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEstablishmentsDetails;