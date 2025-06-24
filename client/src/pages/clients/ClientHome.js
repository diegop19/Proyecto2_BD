import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
import clientHero from '../../images/imagen1.jpg';

const ClientHome = () => {
  const navigate = useNavigate();

  // Datos de prueba para hospedajes destacados
  const hospedajesDestacados = [
    {
      id: 1,
      nombre: "Hotel Playa Bonita",
      tipo: "Hotel",
      descripcion: "Ubicado frente a la playa con vista al mar Caribe",
      precioMinimo: 45000,
      imagen: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      nombre: "Cabañas Cocorí",
      tipo: "Cabaña",
      descripcion: "Cabañas rústicas en medio de la naturaleza",
      precioMinimo: 35000,
      imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      nombre: "Eco Lodge Tortuguero",
      tipo: "Lodge",
      descripcion: "Experiencia ecológica cerca del parque nacional",
      precioMinimo: 55000,
      imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  // Datos de prueba para actividades destacadas
  const actividadesDestacadas = [
    {
      id: 1,
      nombre: "Tour por el Canal de Tortuguero",
      descripcion: "Recorrido en bote por los canales para observar la biodiversidad",
      precio: 35000,
      imagen: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      nombre: "Caminata Nocturna en la Selva",
      descripcion: "Experiencia guiada para observar vida nocturna en la selva",
      precio: 28000,
      imagen: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      nombre: "Avistamiento de Tortugas Marinas",
      descripcion: "Observación de tortugas desovando en playa (temporada)",
      precio: 40000,
      imagen: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

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
          
          <div className="horizontal-list">
            {hospedajesDestacados.map(hospedaje => (
              <div key={hospedaje.id} className="featured-card">
                <div className="card-image-container">
                  <img src={hospedaje.imagen} alt={hospedaje.nombre} className="card-image" />
                </div>
                <div className="card-content">
                  <h3>{hospedaje.nombre}</h3>
                  <p className="card-type">{hospedaje.tipo}</p>
                  <p className="card-description">{hospedaje.descripcion}</p>
                  <p className="card-price">Desde: ₡{hospedaje.precioMinimo?.toLocaleString() || 'Consultar'}</p>
                  <button 
                    onClick={() => navigate(`/lodging?highlight=${hospedaje.id}`)}
                    className="card-button"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
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
          
          <div className="horizontal-list">
            {actividadesDestacadas.map(actividad => (
              <div key={actividad.id} className="featured-card">
                <div className="card-image-container">
                  <img src={actividad.imagen} alt={actividad.nombre} className="card-image" />
                </div>
                <div className="card-content">
                  <h3>{actividad.nombre}</h3>
                  <p className="card-description">{actividad.descripcion}</p>
                  <p className="card-price">Precio: ₡{actividad.precio.toLocaleString()}</p>
                  <button 
                    onClick={() => navigate(`/activities?highlight=${actividad.id}`)}
                    className="card-button"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientHome;