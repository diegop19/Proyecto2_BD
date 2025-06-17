import { Link } from 'react-router-dom';

const AdminEstablishments = () => {
  return (
    <div className="establishments-container">
      <div className="establishments-header">
        <h2>Gestión de Establecimientos</h2>
      </div>
      <div className="establishments-list">
        {/* Listado de habitaciones existentes */}
        <p>No hay establecimientos registrados aún.</p>
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