import { useNavigate, useParams } from 'react-router-dom';

const AdminRoomsTypesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mode, id } = params;

  const isEditMode = mode === 'edit';

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/establishments');
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Tipo de Habitacion' : 'Registrar Nuevo Tipo de Habitacion'}</h2>
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
            {isEditMode ? "Actualizar Tipo de Habitacion" : "Guardar Tipo de Habitacion"}
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

export default AdminRoomsTypesForm;