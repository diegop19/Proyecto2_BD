import { useState } from 'react';
import { Link } from 'react-router-dom';

const ClientRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const establecimientos = [
    {
      id: 1,
      nombre: "Hotel Playa Bonita",
      tipo: "Hotel",
      descripcion: "Ubicado frente a la playa con vista al mar Caribe",
      direccion: {
        canton: "Limon",
        distrito: "Limon",
        senasExactas: "200 metros norte del mirador de Playa Bonita"
      },
      precioMinimo: 45000,
      imagen: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      nombre: "Cabañas Cocorí",
      tipo: "Cabaña",
      descripcion: "Cabañas rústicas en medio de la naturaleza",
      direccion: {
        canton: "Pococí",
        distrito: "Guápiles",
        senasExactas: "Frente al parque central de Río Blanco"
      },
      precioMinimo: 35000,
      imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      nombre: "Eco Lodge Tortuguero",
      tipo: "Lodge",
      descripcion: "Experiencia ecológica cerca del parque nacional",
      direccion: {
        canton: "Pococí",
        distrito: "Tortuguero",
        senasExactas: "300 metros este de la estación de bomberos"
      },
      precioMinimo: 55000,
      imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const filteredEstablecimientos = establecimientos.filter(est =>
    est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.direccion.canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.direccion.distrito.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="section-header">
        <h2>Hospedajes Disponibles en Limón</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredEstablecimientos.length > 0 ? (
          filteredEstablecimientos.map(establecimiento => (
            <div key={establecimiento.id} className="card">
              <div className="card-image-container">
                <img 
                  src={establecimiento.imagen} 
                  alt={establecimiento.nombre}
                  className="card-image"
                />
              </div>
              
              <div className="card-content">
                <h3>{establecimiento.nombre}</h3>
                <p className="card-type">{establecimiento.tipo}</p>
                <p className="card-location">
                  <strong>Ubicación:</strong> {establecimiento.direccion.canton}, {establecimiento.direccion.distrito}
                </p>
                <p className="card-description">{establecimiento.descripcion}</p>
                <p className="card-price">
                  <strong>Desde:</strong> ₡{establecimiento.precioMinimo?.toLocaleString() || 'Consultar'}
                </p>
                
                <Link 
                  to={`/reservation?establecimiento=${establecimiento.id}`}
                  className="card-button"
                >
                  Reservar Ahora
                </Link>
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
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRooms;