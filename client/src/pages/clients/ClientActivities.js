import { useState } from 'react';
import { Link } from 'react-router-dom';

const ClientActivities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos de prueba de actividades
  const actividades = [
    {
      id: 1,
      nombre: "Tour por el Canal de Tortuguero",
      descripcion: "Recorrido en bote por los canales para observar la biodiversidad",
      ubicacion: "Parque Nacional Tortuguero",
      precio: 35000,
      duracion: "4 horas",
      dificultad: "Baja",
      imagen: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      nombre: "Caminata Nocturna en la Selva",
      descripcion: "Experiencia guiada para observar vida nocturna en la selva",
      ubicacion: "Reserva Biológica Hitoy-Cerere",
      precio: 28000,
      duracion: "3 horas",
      dificultad: "Media",
      imagen: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      nombre: "Avistamiento de Tortugas Marinas",
      descripcion: "Observación de tortugas desovando en playa (temporada)",
      ubicacion: "Playa Gandoca",
      precio: 40000,
      duracion: "2 horas",
      dificultad: "Baja",
      imagen: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      nombre: "Kayak en el Río Pacuare",
      descripcion: "Aventura en kayak por uno de los ríos más bellos del mundo",
      ubicacion: "Río Pacuare",
      precio: 45000,
      duracion: "5 horas",
      dificultad: "Alta",
      imagen: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const filteredActividades = actividades.filter(act =>
    act.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="section-header">
        <h2>Actividades Disponibles en Limón</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredActividades.length > 0 ? (
          filteredActividades.map(actividad => (
            <div key={actividad.id} className="card">
              <div className="card-image-container">
                <img 
                  src={actividad.imagen} 
                  alt={actividad.nombre}
                  className="card-image"
                />
              </div>
              
              <div className="card-content">
                <h3>{actividad.nombre}</h3>
                <p className="card-location">
                  <strong>Ubicación:</strong> {actividad.ubicacion}
                </p>
                <p className="card-duration">
                  <strong>Duración:</strong> {actividad.duracion}
                </p>
                <p className="card-difficulty">
                  <strong>Dificultad:</strong> {actividad.dificultad}
                </p>
                <p className="card-description">{actividad.descripcion}</p>
                <p className="card-price">
                  <strong>Precio:</strong> ₡{actividad.precio.toLocaleString()}
                </p>
                
                <Link 
                  to={`/reservation?actividad=${actividad.id}`}
                  className="card-button"
                >
                  Reservar Actividad
                </Link>
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
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientActivities;