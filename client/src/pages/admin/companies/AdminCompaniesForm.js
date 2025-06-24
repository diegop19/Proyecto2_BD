import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminCompaniesForm = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEditMode = mode === 'edit';

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    cedulaJuridica: '',
    email: '',
    telefono: '',
    contactoNombre: '',
    descripcion: '',
    senasExactas: '',
    gps: '',
    idDireccion: null,
    codigoProvincia: '7', // Asumiendo que siempre es la misma provincia
    codigoCanton: '',
    codigoDistrito: '',
    codigoBarrio: ''
  });

  // Estados para datos relacionados
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [preciosActividades, setPreciosActividades] = useState({});

  // Cargar datos para edición
  useEffect(() => {
    const cargarDatosEmpresa = async () => {
      if (!isEditMode) return;

      try {
        // 1. Cargar datos básicos de la empresa
        const responseEmpresa = await fetch(`/api/empresas/${id}`);
        const empresaData = await responseEmpresa.json();
        
        // 2. Cargar dirección
        const responseDireccion = await fetch(`/api/direcciones/${empresaData.ID_Direccion}`);
        const direccionData = await responseDireccion.json();

        // 3. Cargar actividades de la empresa
        const responseActividades = await fetch(`/api/empresas/${id}/actividades`);
        const actividadesData = await responseActividades.json();

        setFormData({
          nombre: empresaData.Nombre,
          cedulaJuridica: empresaData.CedulaJuridica,
          email: empresaData.Email,
          telefono: empresaData.Telefono,
          contactoNombre: empresaData.ContactoNombre,
          descripcion: empresaData.Descripcion,
          senasExactas: direccionData.SenasExactas,
          gps: direccionData.GPS,
          idDireccion: empresaData.ID_Direccion,
          codigoProvincia: direccionData.CodigoProvincia,
          codigoCanton: direccionData.CodigoCanton,
          codigoDistrito: direccionData.CodigoDistrito,
          codigoBarrio: direccionData.CodigoBarrio
        });

        // Configurar actividades seleccionadas y precios
        const nuevasActividades = actividadesData.map(a => a.ID_Tipo_Actividad);
        const nuevosPrecios = actividadesData.reduce((acc, actividad) => {
          acc[actividad.ID_Tipo_Actividad] = actividad.Precio;
          return acc;
        }, {});

        setActividadesSeleccionadas(nuevasActividades);
        setPreciosActividades(nuevosPrecios);

      } catch (error) {
        console.error('Error cargando datos:', error);
        navigate('/admin/companies', { replace: true });
      }
    };

    cargarDatosEmpresa();
  }, [id, isEditMode, navigate]);

  // Cargar cantones, actividades disponibles
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Cargar cantones
        const responseCantones = await fetch('/api/direcciones/provincias/7/cantones');
        const cantonesData = await responseCantones.json();
        setCantones(cantonesData);

        // Cargar actividades disponibles
        const responseActividades = await fetch('/api/actividades');
        const actividadesData = await responseActividades.json();
        setActividades(actividadesData);

      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Cargar distritos cuando cambia el cantón
  useEffect(() => {
    const cargarDistritos = async () => {
      if (!formData.codigoCanton) return;

      try {
        const response = await fetch(`/api/direcciones/provincias/7/cantones/${formData.codigoCanton}/distritos`);
        const data = await response.json();
        setDistritos(data);
        setFormData(prev => ({ ...prev, codigoDistrito: '', codigoBarrio: '' }));
      } catch (error) {
        console.error('Error cargando distritos:', error);
      }
    };

    cargarDistritos();
  }, [formData.codigoCanton]);

  // Cargar barrios cuando cambia el distrito
  useEffect(() => {
    const cargarBarrios = async () => {
      if (!formData.codigoDistrito) return;

      try {
        const response = await fetch(`/api/direcciones/provincias/7/cantones/${formData.codigoCanton}/distritos/${formData.codigoDistrito}/barrios`);
        const data = await response.json();
        setBarrios(data);
        setFormData(prev => ({ ...prev, codigoBarrio: '' }));
      } catch (error) {
        console.error('Error cargando barrios:', error);
      }
    };

    cargarBarrios();
  }, [formData.codigoCanton, formData.codigoDistrito]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de actividades
  const handleActividadChange = (idActividad) => {
    setActividadesSeleccionadas(prev => {
      if (prev.includes(idActividad)) {
        const nuevasActividades = prev.filter(id => id !== idActividad);
        const nuevosPrecios = { ...preciosActividades };
        delete nuevosPrecios[idActividad];
        setPreciosActividades(nuevosPrecios);
        return nuevasActividades;
      } else {
        return [...prev, idActividad];
      }
    });
  };

  // Manejar cambio de precio de actividad
  const handlePrecioActividadChange = (idActividad, precio) => {
    setPreciosActividades(prev => ({
      ...prev,
      [idActividad]: parseFloat(precio) || 0
    }));
  };

  // Guardar dirección
  const guardarDireccion = async (direccionData) => {
    try {
      const response = await fetch('/api/direcciones', {
        method: isEditMode && formData.idDireccion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(direccionData)
      });

      if (!response.ok) throw new Error('Error al guardar dirección');
      
      const data = await response.json();
      return data.idDireccion || formData.idDireccion;

    } catch (error) {
      console.error('Error guardando dirección:', error);
      throw error;
    }
  };

  // Guardar empresa
  const guardarEmpresa = async (empresaData) => {
    try {
      const url = isEditMode ? `/api/empresas/${id}` : '/api/empresas';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaData)
      });

      if (!response.ok) throw new Error('Error al guardar empresa');
      
      const data = await response.json();
      return data.idEmpresa || id;

    } catch (error) {
      console.error('Error guardando empresa:', error);
      throw error;
    }
  };

  // Asignar actividades a empresa
  const asignarActividades = async (idEmpresa) => {
    try {
      await Promise.all(
        actividadesSeleccionadas.map(async idActividad => {
          const response = await fetch(`/api/empresas/${idEmpresa}/actividades/${idActividad}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              precio: preciosActividades[idActividad] || 0,
              descripcion: '' // Opcional: podrías añadir un campo para descripción por actividad
            })
          });
          if (!response.ok) throw new Error(`Error asignando actividad ${idActividad}`);
        })
      );
    } catch (error) {
      console.error('Error asignando actividades:', error);
      throw error;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Guardar dirección
      const direccionData = {
        codigoProvincia: formData.codigoProvincia,
        codigoCanton: formData.codigoCanton,
        codigoDistrito: formData.codigoDistrito,
        codigoBarrio: formData.codigoBarrio,
        senasExactas: formData.senasExactas,
        gps: formData.gps,
        idDireccion: formData.idDireccion
      };

      const idDireccion = await guardarDireccion(direccionData);

      // 2. Guardar empresa
      const empresaData = {
        nombre: formData.nombre,
        cedulaJuridica: formData.cedulaJuridica,
        email: formData.email,
        telefono: formData.telefono,
        contactoNombre: formData.contactoNombre,
        descripcion: formData.descripcion,
        idDireccion: idDireccion
      };

      const idEmpresa = await guardarEmpresa(empresaData);

      // 3. Asignar actividades
      if (actividadesSeleccionadas.length > 0) {
        await asignarActividades(idEmpresa);
      }

      alert(`Empresa ${isEditMode ? 'actualizada' : 'registrada'} exitosamente`);
      navigate('/admin/companies');

    } catch (error) {
      alert(`Error al ${isEditMode ? 'actualizar' : 'guardar'} la empresa: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
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
          <label>Cédula Jurídica:</label>
          <input 
            type="text"
            name="cedulaJuridica"
            value={formData.cedulaJuridica}
            onChange={handleChange}
            placeholder="0-000-000000"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input 
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="0000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre del Contacto:</label>
          <input 
            type="text"
            name="contactoNombre"
            value={formData.contactoNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Provincia:</label>
          <input 
            type="text"
            value="San José" 
            disabled
          />
        </div>

        <div className="form-group">
          <label>Cantón:</label>
          <select 
            name="codigoCanton"
            value={formData.codigoCanton}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>Seleccione un Cantón</option>
            {cantones.map(canton => (
              <option key={canton.Codigo_Canton} value={canton.Codigo_Canton}>
                {canton.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Distrito:</label>
          <select 
            name="codigoDistrito"
            value={formData.codigoDistrito}
            onChange={handleChange}
            required
            disabled={!formData.codigoCanton}
          >
            <option value="" disabled hidden>Seleccione un Distrito</option>
            {distritos.map(distrito => (
              <option key={distrito.Codigo_Distrito} value={distrito.Codigo_Distrito}>
                {distrito.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Barrio:</label>
          <select 
            name="codigoBarrio"
            value={formData.codigoBarrio}
            onChange={handleChange}
            required
            disabled={!formData.codigoDistrito}
          >
            <option value="" disabled hidden>Seleccione un Barrio</option>
            {barrios.map(barrio => (
              <option key={barrio.Codigo_Barrio} value={barrio.Codigo_Barrio}>
                {barrio.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Señas Exactas:</label>
          <textarea 
            rows="4" 
            name="senasExactas"
            value={formData.senasExactas}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Dirección GPS:</label>
          <input 
            type="text"
            name="gps"
            value={formData.gps}
            onChange={handleChange}
            placeholder="Plus Code (0000+000)"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea 
            rows="8" 
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="options-section">
          <h3>Actividades Ofrecidas</h3>
          
          <div className="options-checkbox-group">
            {actividades.map(actividad => (
              <div key={actividad.ID_Tipo_Actividad} className="activity-option">
                <label className="options-checkbox">
                  <input 
                    type="checkbox"
                    checked={actividadesSeleccionadas.includes(actividad.ID_Tipo_Actividad)}
                    onChange={() => handleActividadChange(actividad.ID_Tipo_Actividad)}
                  />
                  <span>{actividad.Nombre}</span>
                </label>
                
                {actividadesSeleccionadas.includes(actividad.ID_Tipo_Actividad) && (
                  <div className="activity-price">
                    <label>Precio (₡):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={preciosActividades[actividad.ID_Tipo_Actividad] || ''}
                      onChange={(e) => handlePrecioActividadChange(actividad.ID_Tipo_Actividad, e.target.value)}
                      placeholder="Precio"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? 'Actualizar Empresa' : 'Guardar Empresa'}
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate('/admin/companies')} 
        className="text-link"
      >
        ← Volver al listado
      </button>
    </div>
  );
};

export default AdminCompaniesForm;