import { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';

const AdminEstablishmentsForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mode, id } = params;

  const isEditMode = mode === 'edit';

  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedCanton, setSelectedCanton] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('');
  
  const tiposEstablecimiento = [
  'Hotel',
  'Hostal',
  'Casa', 
  'Departamento',
  'Cuarto compartido',
  'Cabaña'
];
// agregar estado para el tipo seleccionado
  const [selectedTipo, setSelectedTipo] = useState('');

  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const obtenerServicios = async () => {
  try {
    const response = await fetch('/api/servicios');
    const data = await response.json();
    setServiciosDisponibles(data);
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
  }
  };

  const handleServicioChange = (idServicio) => {
  setServiciosSeleccionados(prev => {
    if (prev.includes(idServicio)) {
      return prev.filter(id => id !== idServicio);
    } else {
      return [...prev, idServicio];
    }
      });
    };

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

  useEffect(() => {
    if (!selectedCanton) return;

    const cargarDistritos = async () => {
      try {
        const response = await fetch(`/api/direcciones/provincias/7/cantones/${selectedCanton}/distritos`);
        const data = await response.json();
        setDistritos(data);
        setSelectedDistrito(''); // Resetear distrito seleccionado
        setBarrios([]); // Limpiar barrios
      } catch (error) {
        console.error('Error cargando distritos:', error);
      }
    };

    cargarDistritos();
  }, [selectedCanton]);

  useEffect(() => {
  if (!selectedDistrito) return;

  const cargarBarrios = async () => {
    try {
      const response = await fetch(`/api/direcciones/provincias/7/cantones/${selectedCanton}/distritos/${selectedDistrito}/barrios`);
      const data = await response.json();
      setBarrios(data);
      setSelectedBarrio(''); // Resetear barrio seleccionado
    } catch (error) {
      console.error('Error cargando barrios:', error);
    }
  };

    cargarBarrios();
  }, [selectedDistrito]);

  useEffect(() => {
  obtenerServicios();
    }, []);

 
  
  const guardarEstablecimiento = async (formData) => {
  try {
    // 1. Insertar dirección
    const direccionData = {
      codigoProvincia: "7", 
      codigoCanton: selectedCanton,
      codigoDistrito: selectedDistrito,
      codigoBarrio: selectedBarrio,
      senasExactas: formData.senasExactas,
      gps: formData.gps
    };

    const responseDireccion = await fetch('/api/direcciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(direccionData)
    });

    if (!responseDireccion.ok) throw new Error('Error al guardar dirección');
    const { idDireccion } = await responseDireccion.json();

    // 2. Insertar establecimiento
    const establecimientoData = {
      nombre: formData.nombre,
      cedulaJuridica: formData.cedulaJuridica,
      tipo: selectedTipo,
      idDireccion: idDireccion,
      telefono1: formData.telefono1,
      telefono2: formData.telefono2 || null,
      email: formData.email,
      webURL: formData.web_url || null,
      facebookURL: formData.facebook_url || null,
      instagramURL: formData.instagram_url || null,
      youtubeURL: formData.youtube_url || null,
      tiktokURL: formData.tiktok_url || null,
      airbnbURL: formData.airbnb_url || null,
      threadsURL: formData.threads_url || null,
      xURL: formData.x_url || null
    };

    const responseEstablecimiento = await fetch('/api/establecimientos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(establecimientoData)
    });

    if (!responseEstablecimiento.ok) throw new Error('Error al guardar establecimiento');
    const { idEstablecimiento } = await responseEstablecimiento.json();

    // 3. Asignar servicios
    await Promise.all(
      serviciosSeleccionados.map(async idServicio => {
        const response = await fetch(`/api/establecimientos/${idEstablecimiento}/servicios/${idServicio}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error(`Error asignando servicio ${idServicio}`);
      })
    );

      return idEstablecimiento;
    } catch (error) {
      console.error('Error en el proceso completo:', error);
      throw error;
    }
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  
  const formData = {
    nombre: form.nombre.value,
    cedulaJuridica: form.cedulaJuridica.value,
    senasExactas: form.senasExactas.value,
    gps: form.gps.value,
    telefono1: form.telefono1.value,
    telefono2: form.telefono2?.value || null,  // Opcional con ?.
    email: form.email.value,
    webURL: form.web_url?.value || null,      // Opcional con ?.
    facebookURL: form.facebook_url?.value || null,
    instagramURL: form.instagram_url?.value || null,
    youtubeURL: form.youtube_url?.value || null,
    tiktokURL: form.tiktok_url?.value || null,
    airbnbURL: form.airbnb_url?.value || null,
    threadsURL: form.threads_url?.value || null,
    xURL: form.x_url?.value || null
  };

  try {
    const idEstablecimiento = await guardarEstablecimiento(formData);
    alert(`Establecimiento guardado exitosamente con ID: ${idEstablecimiento}`);
    navigate('/admin/establishments');
  } catch (error) {
    alert('Error al guardar el establecimiento: ' + error.message);
  }
  
};




  return (
    <div className="register-container">
      <div className="register-header">
        <h2>{isEditMode ? 'Editar Establecimiento' : 'Registrar Nuevo Establecimiento'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text"
             name="nombre" 
            required
          />
        </div>

        <div className="form-group">
          <label>Cedula Judirica:</label>
          <input 
            type="text"
            placeholder="0-000-000000"
             name="cedulaJuridica" 
            required
          />
        </div>

       <div className="form-group">
        <label>Tipo:</label>
          <select 
            required
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="" disabled hidden>Seleccione un Tipo</option>
            {tiposEstablecimiento.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

        </div>
        <div className="form-group">
          <label>Canton:</label>
          <select 
            required
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
          >
            <option value="" disabled hidden>Seleccione un Canton</option>
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
            required
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
            required
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
          <textarea rows="4" name='senasExactas' required></textarea>
        </div>

        <div className="form-group">
          <label>Direccion GPS:</label>
          <input 
            type="text"
            name="gps" 
            placeholder="Plus Code (0000+000)"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefono 1:</label>
          <input 
            type="text"
             name="telefono1" 
            placeholder="0000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefono 2 (No obligatorio):</label>
          <input 
            type="text"
             name="telefono2" 
            placeholder="0000-0000"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="text"
             name="email" 
            placeholder="example@gmail.com"
            required
          />
        </div>

          <div className="options-section">
            <h3>Servicios Ofrecidos</h3>
            
            <div className="options-checkbox-group">
              {serviciosDisponibles.map(servicio => (
                <label key={servicio.ID_Servicio} className="options-checkbox">
                  <input 
                    type="checkbox"
                    checked={serviciosSeleccionados.includes(servicio.ID_Servicio)}
                    onChange={() => handleServicioChange(servicio.ID_Servicio)}
                  />
                  <span>{servicio.Nombre}</span>
                </label>
              ))}
            </div>
          </div>

        <div className="form-group">
          <label>Sitio Web (No obligatorio):</label>
          <input 
            type="text"
             name="web_url" 
            placeholder="https://tusitio.com"
          />
        </div>

        <div className="form-group">
          <label>Facebook (No obligatorio):</label>
          <input 
            type="text"
             name="facebook_url" 
            placeholder="facebook.com/tupagina"
          />
        </div>

        <div className="form-group">
          <label>Instagram (No obligatorio):</label>
          <input 
            type="text"
             name="instagram_url" 
            placeholder="instagram.com/tucuenta"
          />
        </div>

        <div className="form-group">
          <label>YouTube (No obligatorio):</label>
          <input 
            type="text"
             name="youtube_url" 
            placeholder="youtube.com/tucanal"
          />
        </div>

        <div className="form-group">
          <label>TikTok (No obligatorio):</label>
          <input 
            type="text"
             name="tiktok_url" 
            placeholder="tiktok.com/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>Airbnb (No obligatorio):</label>
          <input 
            type="text"
             name="airbnb_url" 
            placeholder="airbnb.com/tualojamiento"
          />
        </div>

        <div className="form-group">
          <label>Threads (No obligatorio):</label>
          <input 
            type="text"
             name="threads_url" 
            placeholder="threads.net/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>X/Twitter (No obligatorio):</label>
          <input 
            type="text"
             name="x_url" 
            placeholder="x.com/tucuenta"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Actualizar Establecimiento" : "Guardar Establecimiento"}
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

export default AdminEstablishmentsForm;