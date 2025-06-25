import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminCompanies = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar empresas desde el backend
  useEffect(() => {
    const cargarEmpresas = async () => {
      try {
        const response = await fetch('/api/empresas-recreacion/all');
        
        if (!response.ok) {
          throw new Error('Error al cargar empresas');
        }
        
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresas();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h2>Gestión de Empresas</h2>
        </div>
        <p>Cargando empresas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h2>Gestión de Empresas</h2>
        </div>
        <p className="error-message">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Empresas de Recreación</h2>
        <Link 
          to="/admin/companies/register" 
          className="add-btn"
        >
          + Añadir Empresa
        </Link>
      </div>
      
      <div className="cards-container">
        {empresas.length > 0 ? (
          empresas.map(empresa => (
            <div key={empresa.ID_Empresa} className="management-card">
              <div className="card-content">
                <h3>{empresa.Nombre}</h3>
                <div className="card-details">
                  <p><strong>Cédula Jurídica:</strong> {empresa.Cedula_Juridica}</p>
                  <p><strong>Teléfono:</strong> {empresa.Telefono || 'No registrado'}</p>
                  <p><strong>Email:</strong> {empresa.Email || 'No registrado'}</p>
                  <p><strong>Contacto:</strong> {empresa.Contacto_Nombre || 'No especificado'}</p>
                </div>
                <Link 
                  to={`/admin/companies/${empresa.ID_Empresa}`}
                  className="text-link"
                >
                  Ver detalles completos →
                </Link>
              </div>
              
              <div className="card-management-actions">
                <Link 
                  to={`/admin/companies/edit/${empresa.ID_Empresa}`}
                  className="management-btn secondary-btn"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay empresas registradas aún.</p>
            <Link 
              to="/admin/companies/register" 
              className="text-link"
            >
              + Añadir tu primera empresa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanies;