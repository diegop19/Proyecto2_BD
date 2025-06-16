import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="PANEL DE ADMINISTRACIÓN"
        subtitle="Gestiona tu hotel con nuestras herramientas profesionales"
        backgroundImage="/images/admin-hero.jpg"
        overlayOpacity={0.7}
        buttons={[
          {
            label: "Gestionar Habitaciones",
            onClick: () => navigate('/admin/rooms')
          },
          {
            label: "Ver Reservaciones",
            variant: "secondary",
            onClick: () => navigate('/admin/reservations')
          }
        ]}
      />
    </div>
  );
};

export default AdminHome;