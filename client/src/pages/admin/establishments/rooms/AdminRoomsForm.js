import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminRoomsForm = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
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

  // Cargar datos para edición
  useEffect(() => {
    const cargarDatos = async () => {
      if (!isEditMode) return;

      try {
        // 1. Cargar datos básicos de la habitación
        const responseHabitacion = await fetch(`/api/habitaciones/${id}`);
        const dataHabitacion = await responseHabitacion.json();
        
        setFormData({
          idTipoHabitacion: dataHabitacion.IDTipoHabitacion,
          numero: dataHabitacion.Numero,
          estado: dataHabitacion.Estado
        });

        // 2. Cargar comodidades seleccionadas
        const responseComodidades = await fetch(`/api/habitaciones/${id}/comodidades`);
        const comodidadesData = await responseComodidades.json();
        setComodidadesSeleccionadas(comodidadesData.map(c => c.IDComodidad));

      } catch (error) {
        console.error('Error cargando datos:', error);
        navigate('/admin/establishments', { replace: true });
      }
    };

    cargarDatos();
  }, [id, isEditMode, navigate]);

  // Cargar tipos de habitación y comodidades
  useEffect(() => {
    const cargarDatosRelacionados = async () => {
      try {
        // Cargar tipos de habitación
        const responseTipos = await fetch('/api/tipos-habitacion');
        const tiposData = await responseTipos.json();
        setTiposHabitacion(tiposData);

        // Cargar comodidades disponibles
        const responseComodidades = await fetch('/api/comodidades');
        const comodidadesData = await responseComodidades.json();
        setComodidades(comodidadesData);

      } catch (error) {
        console.error('Error cargando datos relacionados:', error);
      }
    };

    cargarDatosRelacionados();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de comodidades
  const handleComodidadChange = (idComodidad) => {
    setComodidadesSeleccionadas(prev => {
      if (prev.includes(idComodidad)) {
        return prev.filter(id => id !== idComodidad);
      } else {
        return [...prev, idComodidad];
      }
    });
  };

  // Guardar habitación y comodidades
  const guardarHabitacion = async (formData) => {
    try {
      // 1. Guardar datos básicos de la habitación
      const url = isEditMode 
        ? `/api/habitaciones/${id}`
        : '/api/habitaciones';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTipoHabitacion: parseInt(formData.idTipoHabitacion),
          numero: formData.numero,
          estado: formData.estado
        })
      });

      if (!response.ok) throw new Error('Error al guardar habitación');
      
      const data = await response.json();
      const idHabitacion = isEditMode ? id : data.idHabitacion;

      // 2. Asignar comodidades (solo si es creación o si cambian)
      if (!isEditMode || comodidadesSeleccionadas.length > 0) {
        await Promise.all(
          comodidadesSeleccionadas.map(async idComodidad => {
            const res = await fetch(`/api/habitaciones/${idHabitacion}/comodidades/${idComodidad}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error(`Error asignando comodidad ${idComodidad}`);
          })
        );
      }

      return idHabitacion;

    } catch (error) {
      console.error('Error en el proceso:', error);
      throw error;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await guardarHabitacion(formData);
      alert(`Habitación ${isEditMode ? 'actualizada' : 'registrada'} exitosamente`);
      navigate('/admin/establishments');
    } catch (error) {
      alert(`Error al ${isEditMode ? 'actualizar' : 'guardar'} la habitación: ${error.message}`);
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
            name="idTipoHabitacion"
            value={formData.idTipoHabitacion}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>Seleccione el tipo de Habitación</option>
            {tiposHabitacion.map(tipo => (
              <option key={tipo.IDTipoHabitacion} value={tipo.IDTipoHabitacion}>
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
              <option value="Mantenimiento">En mantenimiento</option>
            </select>
          </div>
        )}

        <div className="options-section">
          <h3>Comodidades Ofrecidas</h3>
          <div className="options-checkbox-group">
            {comodidades.map(comodidad => (
              <label key={comodidad.IDComodidad} className="options-checkbox">
                <input 
                  type="checkbox"
                  checked={comodidadesSeleccionadas.includes(comodidad.IDComodidad)}
                  onChange={() => handleComodidadChange(comodidad.IDComodidad)}
                />
                <span>{comodidad.Nombre}</span>
              </label>
            ))}
          </div>
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