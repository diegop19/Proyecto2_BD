// src/components/Header.js
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Crearemos este archivo después

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1>CocoNet</h1>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Hospedajes</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">Actividades</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Convierte en CocOwner</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;