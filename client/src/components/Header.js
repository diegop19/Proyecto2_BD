import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="app-header">
      <div className="header-container">
        
        <nav className="main-nav">
          <ul className="nav-list">
            {isAdmin ? (
              <>
                <li className='nav-item'>
                  <Link to="/admin" className="logo-link">
                    <h1>CocoNet</h1>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/establishments" className="nav-link">
                    Establecimientos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/companies" className="nav-link">
                    Empresas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/reservations" className="nav-link">
                    Reservaciones
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link to="/" className="logo-link">
                    <h1>CocoNet</h1>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/lodging" className="nav-link">
                    Hospedajes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/activities" className="nav-link">
                    Actividades
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Link to={isAdmin ? "/" : "/admin"} className="role-switcher">
          {isAdmin ? "Modo Cliente" : "Modo Admin"}
        </Link>
      </div>
    </header>
  );
};

export default Header;