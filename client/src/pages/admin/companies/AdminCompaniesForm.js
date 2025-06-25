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
    idDireccion: null
  });

  // Estados para dirección
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedCanton, setSelectedCanton] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('');

  // Cargar datos para edición
  useEffect(() => {
    const cargarDatosEmpresa = async () => {
      if (!isEditMode) return;

      try {
        const responseEmpresa = await fetch(`/api/empresas/${id}`);
        const empresaData = await responseEmpresa.json();
        
        const responseDireccion = await fetch(`/api/direcciones/${empresaData.ID_Direccion}`);
        const direccionData = await responseDireccion.json();

        setFormData({
          nombre: empresaData.Nombre,
          cedulaJuridica: empresaData.CedulaJuridica,
          email: empresaData.Email,
          telefono: empresaData.Telefono,
          contactoNombre: empresaData.ContactoNombre,
          descripcion: empresaData.Descripcion,
          senasExactas: direccionData.SenasExactas,
          gps: direccionData.GPS,
          idDireccion: empresaData.ID_Direccion
        });

        setSelectedCanton(direccionData.CodigoCanton);
        setSelectedDistrito(direccionData.CodigoDistrito);
        setSelectedBarrio(direccionData.CodigoBarrio);

      } catch (error) {
        console.error('Error cargando datos:', error);
        navigate('/admin/companies', { replace: true });
      }
    };

    cargarDatosEmpresa();
  }, [id, isEditMode, navigate]);

  // Cargar cantones
  useEffect(() => {
    const cargarCantones = async () => {
      try {
        const response = await fetch('/api/direcciones/provincias/7/cantones');
        const cantonesData = await response.json();
        setCantones(cantonesData);
      } catch (error) {
        console.error('Error cargando cantones:', error);
      }
    };

    cargarCantones();
  }, []);

  // Cargar distritos cuando cambia el cantón
  useEffect(() => {
    if (!selectedCanton) return;

    const cargarDistritos = async () => {
      try {
        const response = await fetch(`/api/direcciones/provincias/7/cantones/${selectedCanton}/distritos`);
        const data = await response.json();
        setDistritos(data);
        setSelectedDistrito('');
        setBarrios([]);
      } catch (error) {
        console.error('Error cargando distritos:', error);
      }
    };

    cargarDistritos();
  }, [selectedCanton]);

  // Cargar barrios cuando cambia el distrito
  useEffect(() => {
    if (!selectedDistrito) return;

    const cargarBarrios = async () => {
      try {
        const response = await fetch(`/api/direcciones/provincias/7/cantones/${selectedCanton}/distritos/${selectedDistrito}/barrios`);
        const data = await response.json();
        setBarrios(data);
        setSelectedBarrio('');
      } catch (error) {
        console.error('Error cargando barrios:', error);
      }
    };

    cargarBarrios();
  }, [selectedCanton, selectedDistrito]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.cedulaJuridica || !selectedCanton || !selectedDistrito || !selectedBarrio || !formData.senasExactas) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      // 1. Insertar dirección
      const direccionData = {
        codigoProvincia: '7',
        codigoCanton: selectedCanton,
        codigoDistrito: selectedDistrito,
        codigoBarrio: selectedBarrio,
        senasExactas: formData.senasExactas,
        gps: formData.gps || null
      };

      const dirResponse = await fetch('/api/direcciones', {
        method: isEditMode && formData.idDireccion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(direccionData)
      });

      if (!dirResponse.ok) {
        const errorData = await dirResponse.json();
        throw new Error(errorData.error || 'Error al guardar la dirección');
      }

      const dirResult = await dirResponse.json();
      const idDireccion = dirResult.idDireccion;
      console.log(idDireccion);
      // 2. Insertar empresa
      const empresaData = {
        nombre: formData.nombre,
        cedulaJuridica: formData.cedulaJuridica,
        email: formData.email || null,
        telefono: formData.telefono || null,
        contactoNombre: formData.contactoNombre,
        idDireccion: idDireccion,
        descripcion: formData.descripcion
      };

      const empResponse = await fetch('/api/empresas-recreacion', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaData)
      });

      if (!empResponse.ok) {
        const errorData = await empResponse.json();
        throw new Error(errorData.error || 'Error al guardar la empresa');
      }

      const empResult = await empResponse.json();
      console.log('Empresa guardada con ID:', empResult.idEmpresa);

      alert(`Empresa ${isEditMode ? 'actualizada' : 'registrada'} exitosamente`);
      navigate('/admin/companies');

    } catch (error) {
      console.error('Error en el proceso:', error);
      alert(`Error: ${error.message}`);
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
          <label>Cantón:</label>
          <select 
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
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
            value={selectedDistrito}
            onChange={(e) => setSelectedDistrito(e.target.value)}
            required
            disabled={!selectedCanton}
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
            value={selectedBarrio}
            onChange={(e) => setSelectedBarrio(e.target.value)}
            required
            disabled={!selectedDistrito}
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