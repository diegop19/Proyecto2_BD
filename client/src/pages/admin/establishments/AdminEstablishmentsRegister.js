import { useNavigate } from 'react-router-dom';

const AdminEstablishmentsRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar la habitación
    navigate('/admin/establishments'); // Redirigir al listado después de guardar
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Registrar Nuevo Establecimiento</h2>
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
          <label>Tipo:</label>
          <select textarea="Seleccione un Tipo:">
            <option value="null">a</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea rows="4"></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Guardar Habitación
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

export default AdminEstablishmentsRegister;