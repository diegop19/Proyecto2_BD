import { Link } from 'react-router-dom';


const AboutPage = () => {
  return (
    <div className="about-container">
      <h2>Acerca de Nosotros</h2>
      <p>Información sobre tu aplicación o empresa.</p>
      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default AboutPage;