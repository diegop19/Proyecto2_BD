import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar las provincias
  const cargarProvincias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/direcciones/provincias');
      setProvincias(response.data);
    } catch (err) {
      setError('Error al cargar provincias');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar provincias al montar el componente
  useEffect(() => {
    cargarProvincias();
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenido a Mi Aplicación</h1>
      <p>Esta es la página principal de tu aplicación.</p>
      
      {/* Sección de prueba de conexión */}
      <div className="test-section">
        <h2>Prueba de conexión a la API</h2>
        
        <button 
          onClick={cargarProvincias}
          disabled={loading}
          className="btn-test"
        >
          {loading ? 'Cargando...' : 'Recargar Provincias'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="provincias-list">
          <h3>Provincias disponibles:</h3>
          {provincias.length > 0 ? (
            <ul>
              {provincias.map(provincia => (
                <li key={provincia.Codigo_Provincia}>
                  {provincia.Nombre} (Código: {provincia.Codigo_Provincia})
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron provincias</p>
          )}
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={() => navigate('/about')}
          className="btn-primary"
        >
          Conócenos
        </button>
        
        <button 
          onClick={() => navigate('/otra-ruta')}
          className="btn-secondary"
        >
          Otra Acción
        </button>
      </div>
    </div>
  );
};

export default HomePage;