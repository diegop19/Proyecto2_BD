import { Link } from 'react-router-dom';

const AdminEstablishments = () => {
  // Datos de ejemplo con IDs como números
  const establecimientos = [
    {
      id: 1,
      nombre: "Hotel Playa Bonita",
      cedulaJuridica: "3-702-123456",
      tipo: "Hotel",
      telefono1: "2758-1234",
      telefono2: "2758-5678",
      email: "reservas@playabonita.com",
      direccion: {
        provincia: "Limon",
        canton: "Limon",
        distrito: "Limon",
        barrio: "Playa Bonita",
        senasExactas: "200 metros norte del mirador de Playa Bonita",
        gps: "P2RV+W2 Limón, Limón Province"
      },
      redes: {
        web: "https://www.playabonita.com",
        facebook: "https://facebook.com/hotelplayabonita",
        instagram: "https://instagram.com/hotelplayabonita",
        youtube: null,
        tiktok: "https://tiktok.com/@hotelplayabonita",
        airbnb: null,
        threads: null,
        x: null
      }
    },
    {
      id: 2,
      cedulaJuridica: "3-702-654321",
      nombre: "Cabañas Cocorí",
      tipo: "Cabaña",
      telefono1: "2756-9876",
      telefono2: null,
      email: "info@cabanascocori.com",
      direccion: {
        provincia: "Limon",
        canton: "Pococí",
        distrito: "Guápiles",
        barrio: "Río Blanco",
        senasExactas: "Frente al parque central de Río Blanco",
        gps: "P5GH+Q3 Guápiles, Limón Province"
      },
      redes: {
        web: null,
        facebook: null,
        instagram: "https://instagram.com/cabanascocori",
        youtube: "https://youtube.com/c/CabanasCocori",
        tiktok: null,
        airbnb: "https://airbnb.com/h/cabanascocori",
        threads: null,
        x: "https://twitter.com/cabanascocori"
      }
    }
  ];

  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Establecimientos</h2>
      </div>
      
      <div className="cards-container">
        {establecimientos.length > 0 ? (
          <>
            {establecimientos.map(establecimiento => (
              <div key={establecimiento.id} className="management-card">
                <div className="card-content">
                  <h3>{establecimiento.nombre}</h3>
                  <div className="card-details">
                    <p><strong>Tipo:</strong> {establecimiento.tipo}</p>
                    <p><strong>Teléfono:</strong> {establecimiento.telefono1}</p>
                    <p><strong>Email:</strong> {establecimiento.email}</p>
                    <p><strong>Ubicación:</strong> {establecimiento.direccion.canton}, {establecimiento.direccion.distrito}</p>
                  </div>
                  <Link 
                    to={`/admin/establishments/${establecimiento.id}`}
                    state={{ establecimiento }}
                    className="text-link"
                  >
                    Ver detalles completos →
                  </Link>
                </div>
                
                <div className="card-management-actions">
                  <Link 
                    to={`/admin/establishments/edit/${establecimiento.id}`}
                    className="management-btn secondary-btn"
                  >
                    Editar
                  </Link>
                  <Link 
                    to={`/admin/establishments/${establecimiento.id}/rooms/types/register`}
                    className="management-btn"
                  >
                    + Tipo Habitación
                  </Link>
                  <Link 
                    to={`/admin/establishments/${establecimiento.id}/rooms/register`}
                    className="management-btn"
                  >
                    + Habitación
                  </Link>
                </div>
              </div>
            ))}
            <div className=".container">
              <Link 
                to="/admin/establishments/register" 
                className="text-link"
              >
                + Añadir Establecimiento
              </Link>
            </div>
          </>
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