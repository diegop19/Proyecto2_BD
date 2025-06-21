import { Link } from 'react-router-dom';

const AdminCompanies = () => {
  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Empresas</h2>
      </div>
      <div className="list">
        <p>No hay empresas registrados aún.</p>
      </div>
      <Link 
          to="/admin/companies/register" 
          className="text-link"
        >
          + Añadir Empresas
        </Link>
    </div>
  );
};

export default AdminCompanies;