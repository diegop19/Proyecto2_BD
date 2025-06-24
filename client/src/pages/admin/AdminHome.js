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
            label: "Gestionar Establecimientos",
            onClick: () => navigate('/admin/establishments')
          }
        ]}
      />
    </div>
  );
};

export default AdminHome;