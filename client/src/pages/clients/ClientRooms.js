import { Link } from 'react-router-dom';

const ClientRooms = () => {
  return (
    <div>
      <h2>Hospedajes Disponibles</h2>
      <p>Esta sección mostrará todos los hospedajes disponibles. Próximamente.</p>
      <Link 
          to="/reservation" 
          className="text-link"
        >
          + Reservar Habitacion
        </Link>
    </div>
  );
};

export default ClientRooms;