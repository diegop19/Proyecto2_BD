import { useNavigate, useParams } from 'react-router-dom';

const AdminCompaniesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mode } = params;

  const isEditMode = mode === 'edit';

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/companies');
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h2>
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
          <label>Cedula Judirica:</label>
          <input 
            type="text"
            placeholder="0-000-000000"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="text"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefono:</label>
          <input 
            type="text"
            placeholder="0000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre del Contacto:</label>
          <input 
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label>Canton:</label>
          <select required>
            <option value="" disabled hidden>Seleccione un Canton</option>
          </select>
        </div>

        <div className="form-group">
          <label>Distrito:</label>
          <select required>
            <option value="" disabled hidden>Seleccione un Distrito</option>
          </select>
        </div>

        <div className="form-group">
          <label>Barrio:</label>
          <select required>
            <option value="" disabled hidden>Seleccione un Barrio</option>
          </select>
        </div>

        <div className="form-group">
          <label>Señas Exactas:</label>
          <textarea rows="4" required></textarea>
        </div>

        <div className="form-group">
          <label>Direccion GPS:</label>
          <input 
            type="text"
            placeholder="Plus Code (0000+000)"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripcion:</label>
          <textarea rows="8" required></textarea>
        </div>

        <div className="options-section">

        <h3>Actividades Ofrecidas</h3>
        
        <div className="options-checkbox-group">
          <label className="options-checkbox">
            <input type="checkbox" name="caminatas" />
            <span>Caminatas</span>
          </label>

          <label className="options-checkbox">
            <input type="checkbox" name="tour en lancha" />
            <span>Tour en lancha</span>
          </label>

          <label className="options-checkbox">
            <input type="checkbox" name="tour gastronomico" />
            <span>Tour gastronomico</span>
          </label>
        </div>
      </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? 'Actualizar Empresa' : 'Guardar Empresa'}
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate('/admin/companies')} 
        className="text-link"
      >
        ← Volver al listado
      </button>
    </div>
  );
};

export default AdminCompaniesForm;