import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ClientForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mode, id } = params;
  const isEditMode = mode === 'edit';

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    fechaNacimiento: '',
    cedula: '',
    paisResidencia: 'Costa Rica',
    telefono1: '',
    telefono2: '',
    telefono3: '',
    email: ''
  });

  // Estados para dirección
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedCanton, setSelectedCanton] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('');

  // Cargar cantones al montar el componente
  useEffect(() => {
    const cargarCantones = async () => {
      try {
        const response = await fetch('/api/direcciones/provincias/7/cantones');
        const data = await response.json();
        setCantones(data);
      } catch (error) {
        console.error('Error cargando cantones:', error);
      }
    };

    cargarCantones();
  }, []);

  // Cargar distritos cuando se selecciona un cantón
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

  // Cargar barrios cuando se selecciona un distrito
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
  }, [selectedDistrito]);

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
      // 1. Insertar dirección si se proporcionó
      let idDireccion = null;
      if (selectedCanton && selectedDistrito && selectedBarrio) {
        const direccionData = {
          codigoProvincia: '7',
          codigoCanton: selectedCanton,
          codigoDistrito: selectedDistrito,
          codigoBarrio: selectedBarrio,
          senasExactas: e.target.senasExactas?.value || '',
          gps: e.target.gps?.value || null
        };

        const dirResponse = await fetch('/api/direcciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(direccionData)
        });

        if (!dirResponse.ok) throw new Error('Error al insertar la dirección');
        const dirResult = await dirResponse.json();
        idDireccion = dirResult.idDireccion;
      }

      // 2. Insertar cliente
      const clienteData = {
        ...formData,
        idDireccion: idDireccion
      };

      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
      });

      if (!response.ok) throw new Error('Error al registrar cliente');
      const data = await response.json();

      // Mostrar mensaje de éxito
      const mensajeExito = `✅ Cliente registrado exitosamente!\n\nID Cliente: ${data.idCliente}`;
      if (idDireccion) {
        mensajeExito += `\nID Dirección: ${idDireccion}`;
      }

      if (window.confirm(mensajeExito + '\n\n¿Deseas registrar otro cliente?')) {
        // Limpiar formulario para nuevo registro
        setFormData({
          nombre: '',
          apellido1: '',
          apellido2: '',
          fechaNacimiento: '',
          cedula: '',
          paisResidencia: 'Costa Rica',
          telefono1: '',
          telefono2: '',
          telefono3: '',
          email: ''
        });
        setSelectedCanton('');
        setSelectedDistrito('');
        setSelectedBarrio('');
      } else {
        navigate('/clientes'); // Redirigir al listado de clientes
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el formulario: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información Personal</h3>
          
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
            <label>Primer Apellido:</label>
            <input 
              type="text"
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Segundo Apellido (Opcional):</label>
            <input 
              type="text"
              name="apellido2"
              value={formData.apellido2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input 
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cédula/Pasaporte:</label>
            <input 
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>País de Residencia:</label>
            <input 
              type="text"
              name="paisResidencia"
              value={formData.paisResidencia}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Información de Contacto</h3>
          
          <div className="form-group">
            <label>Teléfono Principal:</label>
            <input 
              type="tel"
              name="telefono1"
              value={formData.telefono1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono Secundario (Opcional):</label>
            <input 
              type="tel"
              name="telefono2"
              value={formData.telefono2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Teléfono Adicional (Opcional):</label>
            <input 
              type="tel"
              name="telefono3"
              value={formData.telefono3}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email (Opcional):</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Dirección (Opcional)</h3>
          
          <div className="form-group">
            <label>Cantón:</label>
            <select
              value={selectedCanton}
              onChange={(e) => setSelectedCanton(e.target.value)}
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
              rows="3"
              name="senasExactas"
              placeholder="Detalles adicionales de la dirección"
            />
          </div>

          <div className="form-group">
            <label>Coordenadas GPS (Opcional):</label>
            <input 
              type="text"
              name="gps"
              placeholder="Ejemplo: 9.123456,-83.123456"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? 'Actualizar Cliente' : 'Registrar Cliente'}
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate(isEditMode ? `/clientes/${id}` : '/clientes')}
        className="text-link"
      >
        ← Cancelar
      </button>
    </div>
  );
};

export default ClientForm;