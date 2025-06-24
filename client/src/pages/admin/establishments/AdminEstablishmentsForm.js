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

 



const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  try {
    // 1. Insertar dirección
    const direccionData = {
      codigoProvincia: '7', 
      codigoCanton: selectedCanton,
      codigoDistrito: selectedDistrito,
      codigoBarrio: selectedBarrio,
      senasExactas: form.senasExactas.value,
      gps: form.gps.value || null
    };

    const dirResponse = await fetch('/api/direcciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(direccionData)
    });

    if (!dirResponse.ok) throw new Error('Error al insertar la dirección');
    const dirResult = await dirResponse.json(); 
    const idDireccion = dirResult.idDireccion;

    // 2. Insertar establecimiento
    const establecimientoData = {
      nombre: form.nombre.value,
      cedulaJuridica: form.cedulaJuridica.value,
      tipo: selectedTipo,
      idDireccion: idDireccion,
      telefono1: form.telefono1.value || null,
      telefono2: form.telefono2.value || null,
      email: form.email.value || null,
      webURL: form.webURL.value || null,
      facebookURL: form.facebookURL.value || null,
      instagramURL: form.instagramURL.value || null,
      youtubeURL: form.youtubeURL.value || null,
      tiktokURL: form.tiktokURL.value || null,
      airbnbURL: form.airbnbURL.value || null,
      threadsURL: form.threadsURL.value || null,
      xURL: form.xURL.value || null
    };

    const estResponse = await fetch('/api/establecimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(establecimientoData)
    });

    if (!estResponse.ok) throw new Error('Error al insertar el establecimiento');
    const estResult = await estResponse.json();
    const idEstablecimiento = estResult.idEstablecimiento;
     console.log('Resultado establecimiento:', estResult);

     if (serviciosSeleccionados && serviciosSeleccionados.length > 0) {
      try {
        // Usamos Promise.all para hacer todas las asignaciones en paralelo
        const asignaciones = await Promise.all(
          serviciosSeleccionados.map(async (idServicio) => {
            const response = await fetch(`/api/establecimientos/${idEstablecimiento}/servicios/${idServicio}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Error asignando servicio ${idServicio}`);
            }
            
            return await response.json();
          })
        );
        
        console.log('Resultados de asignación de servicios:', asignaciones);
      } catch (error) {
        console.error('Error asignando servicios:', error);
        // Mostramos alerta pero continuamos con el flujo
        alert(`Establecimiento creado pero hubo un error con algunos servicios: ${error.message}`);
      }
    }

  
  // 3. Mostrar mensaje de éxito persistente
    const mensajeExito = `✅ Establecimiento creado exitosamente!\n\nID Establecimiento: ${idEstablecimiento}\nID Dirección: ${idDireccion}`;
    
    // Versión mejorada que evita que el mensaje se cierre automáticamente
    if (window.confirm(mensajeExito + '\n\n¿Deseas ver más detalles?')) {
      alert(`Detalles completos:\n\nNombre: ${establecimientoData.nombre}\nTipo: ${establecimientoData.tipo}\nCédula: ${establecimientoData.cedulaJuridica}`);
    }

    const serviciosAsignados = serviciosSeleccionados?.length || 0;
    const mensajeExito2 = `✅ Establecimiento creado exitosamente!\n\n` +
                         `ID: ${idEstablecimiento}\n` +
                         `Nombre: ${establecimientoData.nombre}\n` +
                         `Servicios asignados: ${serviciosAsignados}`;
    
    alert(mensajeExito2);


    form.reset();
    // Resetear estados si es necesario
    setSelectedCanton('');
    setSelectedDistrito('');
    setSelectedBarrio('');
    setSelectedTipo('');
    setServiciosSeleccionados([]);

  } catch (error) {
    console.error('Error en handleSubmit:', error);
    alert('Error al procesar el formulario: ' + error.message);
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
             name="webURL" 
            placeholder="https://tusitio.com"
          />
        </div>

        <div className="form-group">
          <label>Facebook (No obligatorio):</label>
          <input 
            type="text"
             name="facebookURL" 
            placeholder="facebook.com/tupagina"
          />
        </div>

        <div className="form-group">
          <label>Instagram (No obligatorio):</label>
          <input 
            type="text"
             name="instagramURL" 
            placeholder="instagram.com/tucuenta"
          />
        </div>

        <div className="form-group">
          <label>YouTube (No obligatorio):</label>
          <input 
            type="text"
             name="youtubeURL" 
            placeholder="youtube.com/tucanal"
          />
        </div>

        <div className="form-group">
          <label>TikTok (No obligatorio):</label>
          <input 
            type="text"
             name="tiktokURL" 
            placeholder="tiktok.com/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>Airbnb (No obligatorio):</label>
          <input 
            type="text"
             name="airbnbURL" 
            placeholder="airbnb.com/tualojamiento"
          />
        </div>

        <div className="form-group">
          <label>Threads (No obligatorio):</label>
          <input 
            type="text"
             name="threadsURL" 
            placeholder="threads.net/@tucuenta"
          />
        </div>

        <div className="form-group">
          <label>X/Twitter (No obligatorio):</label>
          <input 
            type="text"
             name="xURL" 
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