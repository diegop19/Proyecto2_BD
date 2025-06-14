import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenido a Mi Aplicación</h1>
      <p>Esta es la página principal de tu aplicación.</p>
      
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