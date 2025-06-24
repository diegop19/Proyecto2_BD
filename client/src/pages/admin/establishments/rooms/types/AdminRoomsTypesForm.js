import { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';

const AdminRoomsTypesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { idEstablecimiento, mode, id } = params;
  const isEditMode = mode === 'edit';

  // Estados 
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoCama: '',
    precio: ''
  });

  useEffect(() => {
    if (!isEditMode) return;

    const cargarDatos = async () => {
      try {
        const response = await fetch(`/api/establecimientos/${idEstablecimiento}/tipos-habitacion/${id}`);
        if (!response.ok) throw new Error('Error cargando datos');
        
        const data = await response.json();
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          tipoCama: data.tipoCama || '',
          precio: data.precio.toString()
        });
      } catch (error) {
        console.error('Error cargando datos:', error);
        alert('Error al cargar datos: ' + error.message);
        navigate(`/admin/establishments/${idEstablecimiento}/rooms/types`, { replace: true });
      }
    };

    cargarDatos();
  }, [idEstablecimiento, id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const guardarTipoHabitacion = async (formData) => {
    try {
      const url = isEditMode 
        ? `/api/establecimientos/${idEstablecimiento}/tipos-habitacion/${id}`
        : `/api/establecimientos/${idEstablecimiento}/tipos-habitacion`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipoCama: formData.tipoCama,
          precio: formData.precio,
          cantidad: 1 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio) {
      alert('Por favor complete todos los campos requeridos (nombre y precio)');
      return;
    }

    try {
      const result = await guardarTipoHabitacion(formData);
      const idTipoHabitacion = isEditMode ? id : result.idTipoHabitacion;
      
      alert(`Tipo de habitación ${isEditMode ? 'actualizado' : 'creado'} con éxito!\nID: ${idTipoHabitacion}`);
      navigate(`/admin/establishments/${idEstablecimiento}/rooms/types`);
    } catch (error) {
      alert(`Error al ${isEditMode ? 'actualizar' : 'guardar'}: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Tipo de Habitación' : 'Registrar Nuevo Tipo de Habitación'}</h2>
        <p>Establecimiento ID: {idEstablecimiento}</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nombre:*</label>
          <input 
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea 
            rows="4" 
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tipo de Cama:</label>
          <input 
            type="text"
            name="tipoCama"
            value={formData.tipoCama}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Precio (CRC):*</label>
          <input 
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Actualizar" : "Guardar"}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(`/admin/establishments/${idEstablecimiento}/rooms/types`)}
            className="cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRoomsTypesForm;