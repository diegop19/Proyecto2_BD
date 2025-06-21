import { useNavigate } from 'react-router-dom';

const AdminRoomsTypeRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/establishments'); // Redirigir al listado después de guardar
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Registrar Nuevo Tipo de Habitacion</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripcion:</label>
          <textarea rows="4" required></textarea>
        </div>

        <div className="form-group">
          <label>Tipo de Cama:</label>
          <input 
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input 
            type="text"
            placeholder='En Colones'
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Guardar Tipo de Habitacion
          </button>
        </div>
      </form>

      <button 
          onClick={() => navigate('/admin/establishments')} 
          className="text-link"
        >
          ← Volver al listado
        </button>
    </div>
  );
};

export default AdminRoomsTypeRegister;