const express = require('express');
const cors = require('cors');
const dbService = require('./dbServices');

const app = express();

app.use(cors());
app.use(express.json());


// Agregar Direccion 

// Endpoints para direcciones
app.get('/api/direcciones/provincias', async (req, res) => {
  try {
    const provincias = await dbService.obtenerProvincias();
    res.json(provincias);
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    res.status(500).json({ error: 'Error al obtener provincias' });
  }
});

app.get('/api/direcciones/provincias/:codigoProvincia/cantones', async (req, res) => {
  try {
    const cantones = await dbService.obtenerCantones(req.params.codigoProvincia);
    res.json(cantones);
  } catch (error) {
    console.error('Error al obtener cantones:', error);
    res.status(500).json({ error: 'Error al obtener cantones' });
  }
});

app.get('/api/direcciones/provincias/:codigoProvincia/cantones/:codigoCanton/distritos', async (req, res) => {
  try {
    const distritos = await dbService.obtenerDistritos(
      req.params.codigoProvincia,
      req.params.codigoCanton
    );
    res.json(distritos);
  } catch (error) {
    console.error('Error al obtener distritos:', error);
    res.status(500).json({ error: 'Error al obtener distritos' });
  }
});

app.get('/api/direcciones/provincias/:codigoProvincia/cantones/:codigoCanton/distritos/:codigoDistrito/barrios', async (req, res) => {
  try {
    const barrios = await dbService.obtenerBarrios(
      req.params.codigoProvincia,
      req.params.codigoCanton,
      req.params.codigoDistrito
    );
    res.json(barrios);
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    res.status(500).json({ error: 'Error al obtener barrios' });
  }
});

app.post('/api/direcciones', async (req, res) => {
  try {
    const idDireccion = await dbService.insertarDireccion(req.body);
    res.status(201).json({ idDireccion });
  } catch (error) {
    console.error('Error al crear dirección:', error);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
});

// ESTABLCIMIENTOS -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/api/establecimientos', async (req, res) => {
  try {
    // Validacion
    if (!req.body.nombre || !req.body.cedulaJuridica || !req.body.tipo || !req.body.idDireccion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const establecimientoData = {
      nombre: req.body.nombre,
      cedulaJuridica: req.body.cedulaJuridica,
      tipo: req.body.tipo,
      idDireccion: parseInt(req.body.idDireccion),
      telefono1: req.body.telefono1 || null,
      telefono2: req.body.telefono2 || null,
      email: req.body.email || null,
      web_url: req.body.web_url || null,
      facebook_url: req.body.facebook_url || null,
      instagram_url: req.body.instagram_url || null,
      youtube_url: req.body.youtube_url || null,
      tiktok_url: req.body.tiktok_url || null,
      airbnb_url: req.body.airbnb_url || null,
      threads_url: req.body.threads_url || null,
      x_url: req.body.x_url || null,
    };

    const idEstablecimiento = await dbService.insertarEstablecimiento(establecimientoData);
    res.status(201).json({ idEstablecimiento });
  } catch (error) {
    console.error('Error al crear establecimiento:', error);
  }
});

// asignar establecimiento a servicio
app.post('/api/establecimientos/:idEstablecimiento/servicios/:idServicio', async (req, res) => {
  try {
    const idEstablecimiento = parseInt(req.params.idEstablecimiento);
    const idServicio = parseInt(req.params.idServicio);

    await dbService.asignarServicioEstablecimiento(idEstablecimiento, idServicio);
    res.status(200).json({ message: 'Servicio asignado correctamente' });
  } catch (error) {
    console.error('Error al asignar servicio:', error);
    res.status(500).json({ error: 'Error al asignar servicio' });
  }
});

// obtener todos los servicios disponibles 
app.get('/api/servicios', async (req, res) => {
  try {
    const servicios = await dbService.obtenerServicios();
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// HABITACIONES 
// Insertar tipo de habitacion 
app.post('/api/establecimientos/:idEstablecimiento/tipos-habitacion', async (req, res) => {
  try {
    const idEstablecimiento = parseInt(req.params.idEstablecimiento);
    if (!req.body.nombre || !req.body.precio || !req.body.cantidad) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, precio, cantidad)' });
    }

    const tipoHabitacionData = {
      idEstablecimiento,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      tipoCama: req.body.tipoCama,
      precio: parseFloat(req.body.precio),
      cantidad: parseInt(req.body.cantidad)
    };

    const idTipoHabitacion = await dbService.insertarTipoHabitacion(tipoHabitacionData);
    res.status(201).json({ idTipoHabitacion });
  } catch (error) {
    console.error('Error al crear tipo de habitación:', error);
  
  }
});

// Obtiene los tipo de habitacion segun el establecimiento
app.get('/api/establecimientos/:idEstablecimiento/tipos-habitacion', async (req, res) => {
  try {
    const idEstablecimiento = parseInt(req.params.idEstablecimiento);

    const tiposHabitacion = await dbService.obtenerTiposHabitacion(idEstablecimiento);
    res.json(tiposHabitacion);
  } catch (error) {
    console.error('Error al obtener tipos de habitación:', error);
  }
});

// COMODIDADES

// Asignar comodidad a habitacion 

app.post('/api/tipos-habitacion/:idTipoHabitacion/comodidades/:idComodidad', async (req, res) => {
  try {
    const idTipoHabitacion = parseInt(req.params.idTipoHabitacion);
    const idComodidad = parseInt(req.params.idComodidad);
    
    await dbService.asignarComodidadHabitacion(idTipoHabitacion, idComodidad);
    res.status(200).json({ message: 'Comodidad asignada correctamente' });
  } catch (error) {
    console.error('Error al asignar comodidad:', error);
  }
});

// Obtener todsa las comodidades

app.get('/api/comodidades', async (req, res) => {
  try {
    const comodidades = await dbService.obtenerComodidades();
    res.json(comodidades);
  } catch (error) {
    console.error('Error al obtener comodidades:', error);
    res.status(500).json({ error: 'Error al obtener comodidades' });
  }
});

// Obtener las comodidades por tipo de habitacion 

app.get('/api/tipos-habitacion/:idTipoHabitacion/comodidades', async (req, res) => {
  try {
    const idTipoHabitacion = parseInt(req.params.idTipoHabitacion);
    const comodidades = await dbService.obtenerComodidadesHabitacion(idTipoHabitacion);
    res.json(comodidades);
  } catch (error) {
    console.error('Error al obtener comodidades de habitación:', error);
    res.status(500).json({ error: 'Error al obtener comodidades de habitación' });
  }
});

//  HABITACIONES CONCRETAS
app.post('/api/habitaciones', async (req, res) => {
  try {
    
    if (!req.body.idTipoHabitacion || !req.body.numero) {
      return res.status(400).json({ error: 'Faltan campos requeridos (idTipoHabitacion, numero)' });
    }

    const habitacionData = {
      idTipoHabitacion: parseInt(req.body.idTipoHabitacion),
      numero: req.body.numero,
      estado: req.body.estado
    };

    const idHabitacion = await dbService.insertarHabitacion(habitacionData);
    res.status(201).json({ idHabitacion });
  } catch (error) {
    console.error('Error al registrar habitación:', error);
  }
});


app.post('/api/clientes', async (req, res) => {
  try {

    if (!req.body.nombre || !req.body.apellido1 || !req.body.fechaNacimiento || 
        !req.body.cedula || !req.body.paisResidencia) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (nombre, apellido1, fechaNacimiento, cedula, paisResidencia)' 
      });
    }

    let fechaNacimiento = new Date(req.body.fechaNacimiento);
    if (isNaN(fechaNacimiento.getTime())) {
      fechaNacimiento = null; // si ocurre este caso el so pone un valor por defecto 
    }

    const clienteData = {
      nombre: req.body.nombre,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      fechaNacimiento: fechaNacimiento,
      cedula: req.body.cedula,
      paisResidencia: req.body.paisResidencia,
      idDireccion: req.body.idDireccion ? parseInt(req.body.idDireccion) : null,
      telefono1: req.body.telefono1,
      telefono2: req.body.telefono2,
      telefono3: req.body.telefono3,
      email: req.body.email
    };

    const idCliente = await dbService.insertarCliente(clienteData);
    res.status(201).json({ idCliente });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Ya existe un cliente con esta cédula' });
    }

  }
});

app.post('/api/reservaciones', async (req, res) => {
  try {
    // Validacion básica
    if (!req.body.idCliente || !req.body.idHabitacion || !req.body.fechaIngreso || 
        !req.body.fechaSalida || !req.body.cantidadPersonas) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (idCliente, idHabitacion, fechaIngreso, fechaSalida, cantidadPersonas)' 
      });
    }

    const fechaIngreso = new Date(req.body.fechaIngreso);
    const fechaSalida = new Date(req.body.fechaSalida);
    
    // Validacion cantidad de personas
    if (req.body.cantidadPersonas < 1) {
      return res.status(400).json({ error: 'La cantidad de personas debe ser al menos 1' });
    }

    const reservacionData = {
      idCliente: parseInt(req.body.idCliente),
      idHabitacion: parseInt(req.body.idHabitacion),
      fechaIngreso: req.body.fechaIngreso,
      fechaSalida: req.body.fechaSalida,
      horaIngreso: req.body.horaIngreso,
      horaSalida: req.body.horaSalida,
      cantidadPersonas: parseInt(req.body.cantidadPersonas),
      tieneVehiculo: Boolean(req.body.tieneVehiculo)
    };

    const resultado = await dbService.insertarReservacion(reservacionData);
    
    // Manejar respuestas del stored procedure
    if (resultado.idReservacion === -1) {
      if (resultado.mensaje.includes('no existe')) {
        return res.status(404).json({ error: resultado.mensaje });
      }
      if (resultado.mensaje.includes('no disponible')) {
        return res.status(409).json({ error: resultado.mensaje });
      }
      return res.status(400).json({ error: resultado.mensaje });
    }
    
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear reservación:', error);
  }
});

// FACTURAS ---------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/api/facturas', async (req, res) => {
  try {
    // Validacion basica
    if (!req.body.idReservacion || !req.body.metodoPago) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (idReservacion, metodoPago)' 
      });
    }

    const facturaData = {
      idReservacion: parseInt(req.body.idReservacion),
      metodoPago: req.body.metodoPago,
      detalles: req.body.detalles
    };

    const resultado = await dbService.insertarFactura(facturaData);
    
    // Manejar respuestas del stored procedure
    if (resultado.idFactura === -1) {
      if (resultado.mensaje.includes('no existe') || resultado.mensaje.includes('ya está completada')) {
        return res.status(404).json({ error: resultado.mensaje });
      }
      if (resultado.mensaje.includes('no válido')) {
        return res.status(409).json({ error: resultado.mensaje });
      }
      return res.status(400).json({ error: resultado.mensaje });
    }
    
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear factura:', error);
  }
});






                      

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});