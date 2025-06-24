import { Link } from 'react-router-dom';

const AdminEstablishments = () => {
  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Establecimientos</h2>
      </div>
      <div className="list">
        {/* Listado de habitaciones existentes */}
        <p>No hay establecimientos registrados aún.</p>
        <Link 
          to="/admin/establishments/rooms/types/register" 
          className="text-link"
        >
          + Añadir Tipo de Habitacion
        </Link>

        <Link 
          to="/admin/establishments/rooms/register" 
          className="text-link"
        >
          + Añadir Habitacion
        </Link>
      </div>
        <Link 
          to="/admin/establishments/register" 
          className="text-link"
        >
          + Añadir Establecimiento
        </Link>
    </div>
  );
};

export default AdminEstablishments;