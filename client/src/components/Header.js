import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1>Sistema Hotelero</h1>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-list">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <Link to="/admin/rooms" className="nav-link">
                    Habitaciones
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