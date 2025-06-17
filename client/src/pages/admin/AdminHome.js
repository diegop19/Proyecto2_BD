import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
import adminHero from '../../images/imagen1.webp'

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="PANEL DE ADMINISTRACIÓN"
        subtitle="Gestiona tu hotel con nuestras herramientas profesionales"
        backgroundImage={adminHero}
        buttons={[
          {
            label: "Gestionar Habitaciones",
            onClick: () => navigate('/admin/establishments')
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