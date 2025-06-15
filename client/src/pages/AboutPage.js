// src/pages/AboutPage.js
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h2>Acerca de Nosotros</h2>
      <p>Somos una empresa dedicada a crear soluciones innovadoras para nuestros clientes.</p>
      <p>Nuestro equipo está compuesto por profesionales apasionados por la tecnología.</p>
      
      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default AboutPage;