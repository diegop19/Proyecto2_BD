import { Link } from 'react-router-dom';

const AdminCompanies = () => {
  // Datos de ejemplo - reemplazar con datos reales del backend cuando esté disponible
  const empresas = [
    {
      id: 1,
      nombre: "Aventuras CR",
      cedulaJuridica: "3-101-123456",
      telefono: "2222-1111",
      email: "info@aventurascr.com",
      ubicacion: "San José, San Pedro"
    },
    {
      id: 2,
      nombre: "Tours Naturales",
      cedulaJuridica: "3-102-654321",
      telefono: "2233-4455",
      email: "contacto@toursnaturales.com",
      ubicacion: "Alajuela, La Fortuna"
    }
  ];

  return (
    <div className="container">
      <div className="header">
        <h2>Gestión de Empresas</h2>
      </div>
      
      <div className="cards-container">
        {empresas.length > 0 ? (
          <>
            {empresas.map(empresa => (
              <div key={empresa.id} className="management-card">
                <div className="card-content">
                  <h3>{empresa.nombre}</h3>
                  <div className="card-details">
                    <p><strong>Cédula Jurídica:</strong> {empresa.cedulaJuridica}</p>
                    <p><strong>Teléfono:</strong> {empresa.telefono}</p>
                    <p><strong>Email:</strong> {empresa.email}</p>
                    <p><strong>Ubicación:</strong> {empresa.ubicacion}</p>
                  </div>
                  <Link 
                    to={`/admin/companies/${empresa.id}`} 
                    className="text-link"
                  >
                    Ver detalles completos →
                  </Link>
                </div>
                
                <div className="card-management-actions">
                  <Link 
                    to={`/admin/companies/edit/${empresa.id}`}
                    className="management-btn secondary-btn"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
            <div className=".container">
              <Link 
                to="/admin/companies/register" 
                className="text-link"
              >
                + Añadir Empresa
              </Link>
            </div>
          </>
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