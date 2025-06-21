import { useNavigate } from 'react-router-dom';

const AdminRoomsRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/establishments'); // Redirigir al listado después de guardar
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Registrar Nueva Habitacion</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        
        <div className="form-group">
          <label>Tipo de Habitacion:</label>
          <select required>
            <option value="" disabled hidden>Seleccione el tipo de Habitacion</option>
          </select>
        </div>

        <div className="form-group">
          <label>Numero:</label>
          <input 
            type="text"
            required
          />
        </div>

        <div className="options-section">
            <h3>Comodidades Ofrecidas</h3>

            <div className="options-checkbox-group">
                <label className="options-checkbox">
                    <input type="checkbox" name="caminatas" />
                    <span>Ducha</span>
                </label>

                <label className="options-checkbox">
                    <input type="checkbox" name="tour en lancha" />
                    <span>Aire Acondicionado</span>
                </label>

                <label className="options-checkbox">
                    <input type="checkbox" name="tour gastronomico" />
                    <span>Algo mas yo que se bro, ayuda</span>
                </label>
            </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Guardar Habitacion
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

export default AdminRoomsRegister;