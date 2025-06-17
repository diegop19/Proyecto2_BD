import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import clientHero from '../images/imagen1.jpg'

const ClientHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="EXPLORA LOS MEJORES HOSPEDAJES"
        subtitle="Encuentra tu alojamiento ideal en Limón"
        backgroundImage={clientHero}
        buttons={[{
          label: "Buscar Hospedajes",
          onClick: () => navigate('/lodging')
        }]}
      />
    </div>
  );
};

export default ClientHome;