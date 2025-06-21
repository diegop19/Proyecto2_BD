import { useNavigate } from 'react-router-dom';

const AdminEstablishmentsRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <select required>
            <option value="" disabled hidden>Seleccione un Tipo</option>
          </select>
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
          <label>Telefono 1:</label>
          <input 
            type="text"
            placeholder="0000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefono 2 (No obligatorio):</label>
          <input 
            type="text"
            placeholder="0000-0000"
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

        <div className="options-section">
          <h3>Servicios Ofrecidos</h3>
          
          <div className="options-checkbox-group">
            <label className="options-checkbox">
              <input type="checkbox" name="wifi" />
              <span>WiFi Gratis</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="parking" />
              <span>Parqueadero</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="pool" />
              <span>Piscina</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="breakfast" />
              <span>Desayuno Incluido</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="airConditioning" />
              <span>Aire Acondicionado</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="restaurant" />
              <span>Restaurante</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="gym" />
              <span>Gimnasio</span>
            </label>

            <label className="options-checkbox">
              <input type="checkbox" name="spa" />
              <span>Spa</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Sitio Web (No obligatorio):</label>
          <input 
            type="text"
            placeholder="https://tusitio.com"
          />
        </div>

        <div className="form-group">
          <label>Facebook (No obligatorio):</label>
          <input 
            type="text"
            placeholder="facebook.com/tupagina"
          />
        </div>

        <div className="form-group">
          <label>Instagram (No obligatorio):</label>
          <input 
            type="text"
            placeholder="instagram.com/tucuenta"
          />
        </div>

        <div className="form-group">
          <label>YouTube (No obligatorio):</label>
          <input 
            type="text"
            placeholder="youtube.com/tucanal"
          />
        </div>

        <div className="form-group">
          <label>TikTok (No obligatorio):</label>
          <input 
            type="text"
            placeholder="tiktok.com/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>Airbnb (No obligatorio):</label>
          <input 
            type="text"
            placeholder="airbnb.com/tualojamiento"
          />
        </div>

        <div className="form-group">
          <label>Threads (No obligatorio):</label>
          <input 
            type="text"
            placeholder="threads.net/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>X/Twitter (No obligatorio):</label>
          <input 
            type="text"
            placeholder="x.com/tucuenta"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Guardar Establecimiento
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