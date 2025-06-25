import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const AdminRoomsForm = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const location = useLocation();
  const idEstablecimiento = useParams().idEstablecimiento || location.state?.idEstablecimiento;
  const isEditMode = mode === 'edit';

  // Estados del formulario
  const [formData, setFormData] = useState({
    numero: ''
  });

  // Estados para tipos de habitación
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [selectedTipoHabitacion, setSelectedTipoHabitacion] = useState('');

  // Cargar tipos de habitación
  useEffect(() => {
    const cargarTiposHabitacion = async () => {
      try {
        if (!idEstablecimiento) return;
        
        const response = await fetch(`/api/establecimientos/${idEstablecimiento}/tipos-habitacion`);
        if (!response.ok) throw new Error('Error al cargar tipos de habitación');
        
        const data = await response.json();
        setTiposHabitacion(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    cargarTiposHabitacion();
  }, [idEstablecimiento]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de tipo de habitación
  const handleTipoChange = (e) => {
    setSelectedTipoHabitacion(e.target.value);
    console.log('ID de tipo de habitación seleccionado:', e.target.value); // Para depuración
  };

  // Guardar habitación
  const guardarHabitacion = async () => {
    try {
      if (!selectedTipoHabitacion || !formData.numero) {
        throw new Error('Debe seleccionar un tipo de habitación y especificar un número');
      }
      
      console.log('ID a enviar al backend:', selectedTipoHabitacion); // Verificación
      
      const response = await fetch('/api/habitaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTipoHabitacion: parseInt(selectedTipoHabitacion), // Asegurar que es número
          numero: formData.numero,
          estado: 'disponible'
        })
      });

      if (!response.ok) throw new Error('Error al guardar habitación');
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await guardarHabitacion();
      alert(`Habitación registrada exitosamente con ID: ${result.idHabitacion}`);
      navigate(`/admin/establishments/${idEstablecimiento}/rooms`);
    } catch (error) {
      alert(`Error al guardar la habitación: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Habitación' : 'Registrar Nueva Habitación'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Tipo de Habitación:</label>
          <select
            value={selectedTipoHabitacion}
            onChange={handleTipoChange}
            required
          >
            <option value="" disabled hidden>Seleccione el tipo de Habitación</option>
            {tiposHabitacion.map(tipo => (
              <option 
                key={tipo.IDTipo_Habitacion} 
                value={tipo.ID_Tipo_Habitacion} 
              >
                {tipo.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Número:</label>
          <input 
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Actualizar Habitación" : "Guardar Habitación"}
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate('/admin/establishments')} 
        className="text-link"
      >
        ← Volver al listado
      </button>
    </div>
  );
};

export default AdminRoomsForm;