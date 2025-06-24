import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminRoomsForm = () => {
  const navigate = useNavigate();
  const { idEstablecimiento, mode, id } = useParams();
  const isEditMode = mode === 'edit';

  // Estados para el formulario
  const [formData, setFormData] = useState({
    idTipoHabitacion: '',
    numero: '',
    estado: 'Disponible'
  });

  // Estados para datos relacionados
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [comodidadesSeleccionadas, setComodidadesSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tipos de habitación para este establecimiento
        const tiposResponse = await fetch(`/api/establecimientos/${idEstablecimiento}/tipos-habitacion`);
        if (!tiposResponse.ok) throw new Error('Error cargando tipos de habitación');
        const tiposData = await tiposResponse.json();
        setTiposHabitacion(tiposData);

        // Cargar todas las comodidades disponibles
        const comodidadesResponse = await fetch('/api/comodidades');
        if (!comodidadesResponse.ok) throw new Error('Error cargando comodidades');
        const comodidadesData = await comodidadesResponse.json();
        setComodidades(comodidadesData);

        // Si es modo edición, cargar datos de la habitación
        if (isEditMode) {
          const habitacionResponse = await fetch(`/api/habitaciones/${id}`);
          if (!habitacionResponse.ok) throw new Error('Error cargando datos de habitación');
          const habitacionData = await habitacionResponse.json();
          
          setFormData({
            idTipoHabitacion: habitacionData.IDTipoHabitacion,
            numero: habitacionData.Numero,
            estado: habitacionData.Estado
          });

          // Cargar comodidades asignadas a esta habitación
          const comodidadesHabitacionResponse = await fetch(`/api/habitaciones/${id}/comodidades`);
          if (!comodidadesHabitacionResponse.ok) throw new Error('Error cargando comodidades de habitación');
          const comodidadesHabitacion = await comodidadesHabitacionResponse.json();
          
          setComodidadesSeleccionadas(comodidadesHabitacion.map(c => c.IDComodidad));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idEstablecimiento, id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleComodidad = (idComodidad) => {
    setComodidadesSeleccionadas(prev => 
      prev.includes(idComodidad)
        ? prev.filter(id => id !== idComodidad)
        : [...prev, idComodidad]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validación básica
      if (!formData.idTipoHabitacion || !formData.numero) {
        throw new Error('Debe completar todos los campos requeridos');
      }

      // 1. Guardar/actualizar la habitación
      const url = isEditMode 
        ? `/api/habitaciones/${id}`
        : '/api/habitaciones';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const habitacionResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTipoHabitacion: parseInt(formData.idTipoHabitacion),
          numero: formData.numero,
          estado: formData.estado
        })
      });

      if (!habitacionResponse.ok) {
        const errorData = await habitacionResponse.json();
        throw new Error(errorData.error || 'Error al guardar la habitación');
      }

      const result = await habitacionResponse.json();
      const idHabitacion = isEditMode ? id : result.idHabitacion;

      // 2. Actualizar comodidades (solo si hay cambios)
      if (comodidadesSeleccionadas.length > 0) {
        // Primero eliminamos todas las comodidades existentes (en modo edición)
        if (isEditMode) {
          await fetch(`/api/habitaciones/${idHabitacion}/comodidades`, {
            method: 'DELETE'
          });
        }

        // Luego asignamos las nuevas comodidades
        await Promise.all(
          comodidadesSeleccionadas.map(async idComodidad => {
            const response = await fetch(
              `/api/habitaciones/${idHabitacion}/comodidades/${idComodidad}`, 
              { method: 'POST' }
            );
            if (!response.ok) throw new Error(`Error asignando comodidad ${idComodidad}`);
          })
        );
      }

      alert(`Habitación ${isEditMode ? 'actualizada' : 'creada'} exitosamente!`);
      navigate(`/admin/establishments/${idEstablecimiento}/rooms`);

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error en handleSubmit:', error);
    }
  };

  if (loading) {
    return (
      <div className="register-container">
        <div className="register-header">
          <h2>{isEditMode ? 'Editar Habitación' : 'Registrar Nueva Habitación'}</h2>
        </div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="register-container">
        <div className="register-header">
          <h2>{isEditMode ? 'Editar Habitación' : 'Registrar Nueva Habitación'}</h2>
        </div>
        <p className="error-message">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Reintentar
        </button>
        <button 
          onClick={() => navigate(`/admin/establishments/${idEstablecimiento}/rooms`)} 
          className="text-link"
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Habitación' : 'Registrar Nueva Habitación'}</h2>
        <p>Establecimiento ID: {idEstablecimiento}</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Tipo de Habitación: *</label>
          <select
            name="idTipoHabitacion"
            value={formData.idTipoHabitacion}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Seleccione un tipo</option>
            {tiposHabitacion.map(tipo => (
              <option key={tipo.IDTipoHabitacion} value={tipo.IDTipoHabitacion}>
                {tipo.Nombre} - {tipo.TipoCama} (₡{tipo.Precio.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Número de Habitación: *</label>
          <input 
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
            placeholder="Ej. 101, 202-A, etc."
          />
        </div>

        {isEditMode && (
          <div className="form-group">
            <label>Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Limpieza">En limpieza</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Comodidades:</label>
          <div className="comodidades-grid">
            {comodidades.map(comodidad => (
              <div key={comodidad.IDComodidad} className="comodidad-item">
                <input
                  type="checkbox"
                  id={`comodidad-${comodidad.IDComodidad}`}
                  checked={comodidadesSeleccionadas.includes(comodidad.IDComodidad)}
                  onChange={() => toggleComodidad(comodidad.IDComodidad)}
                />
                <label htmlFor={`comodidad-${comodidad.IDComodidad}`}>
                  {comodidad.Nombre}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Actualizar Habitación" : "Registrar Habitación"}
          </button>
          <button 
            type="button"
            onClick={() => navigate(`/admin/establishments/${idEstablecimiento}/rooms`)}
            className="cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRoomsForm;