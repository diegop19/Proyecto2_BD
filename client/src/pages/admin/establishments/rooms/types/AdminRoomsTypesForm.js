import { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';

const AdminRoomsTypesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mode, id } = params;

  const isEditMode = mode === 'edit';

  // Estados 
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoCama: '',
    precio: ''
  });

  // Cargar datos para edición 
  useEffect(() => {
    if (!isEditMode) return;

    const cargarDatos = async () => {
      try {
        const response = await fetch(`/api/tipos-habitacion/${id}`);
        const data = await response.json();
        
        // Mapear datos igual que en Establishments
        setFormData({
          nombre: data.Nombre,
          descripcion: data.Descripcion,
          tipoCama: data.TipoCama,
          precio: data.Precio
        });
      } catch (error) {
        console.error('Error cargando datos:', error);
        navigate('/admin/establishments/rooms/types', { replace: true });
      }
    };

    cargarDatos();
  }, [id, isEditMode, navigate]);

  // handleChange igual que en Establishments
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función guardar 
  const guardarTipoHabitacion = async (formData) => {
    try {
      const url = isEditMode 
        ? `/api/tipos-habitacion/${id}`
        : '/api/tipos-habitacion';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipoCama: formData.tipoCama,
          precio: parseFloat(formData.precio)
        })
      });

      if (!response.ok) throw new Error('Error al guardar');
      return await response.json();

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // handleSubmit idéntico a Establishments
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await guardarTipoHabitacion(formData);
      alert(`Tipo de habitación ${isEditMode ? 'actualizado' : 'guardado'} correctamente`);
      navigate('/admin/establishments/rooms/types');
    } catch (error) {
      alert(`Error al ${isEditMode ? 'actualizar' : 'guardar'}: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Tipo de Habitacion' : 'Registrar Nuevo Tipo de Habitacion'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {/* Campos con value y onChange añadidos (como debería tener Establishments) */}
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripcion:</label>
          <textarea 
            rows="4" 
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de Cama:</label>
          <input 
            type="text"
            name="tipoCama"
            value={formData.tipoCama}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input 
            type="text"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder='En Colones'
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Actualizar Tipo de Habitacion" : "Guardar Tipo de Habitacion"}
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate('/admin/establishments/')} 
        className="text-link"
      >
        ← Volver al listado
      </button>
    </div>
  );
};

export default AdminRoomsTypesForm;