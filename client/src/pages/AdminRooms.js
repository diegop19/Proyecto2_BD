import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

const AdminRooms = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="GESTIÓN DE HABITACIONES"
        subtitle="Administra las habitaciones de tu hotel"
        backgroundImage="/images/imagen1.webp"
        overlayOpacity={0.7}
        buttons={[{
          label: "Añadir Habitación",
          onClick: () => navigate('/admin/rooms/add')
        }]}
      />
      <p>Esta sección estará disponible pronto. Aquí podrás gestionar todas las habitaciones de tu hotel.</p>
    </div>
  );
};

export default AdminRooms;