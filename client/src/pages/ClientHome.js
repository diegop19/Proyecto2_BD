import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

const ClientHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="EXPLORA LOS MEJORES HOSPEDAJES"
        subtitle="Encuentra tu alojamiento ideal en Limón"
        backgroundImage="/images/client-hero.jpg"
        buttons={[{
          label: "Buscar Hospedajes",
          onClick: () => navigate('/lodging')
        }]}
      />
    </div>
  );
};

export default ClientHome;