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
      webURL: req.body.webURL || null,
      facebookURL: req.body.facebookURL || null,
      instagramURL: req.body.instagramURL || null,
      youtubeURL: req.body.youtubeURL || null,
      tiktokURL: req.body.tiktokURL || null,
      airbnbURL: req.body.airbnbURL || null,
      threadsURL: req.body.threadsURL || null,
      xURL: req.body.xURL || null,
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

// FINALIZAR RESERVACION

app.patch('/api/reservaciones/:idReservacion/finalizar', async (req, res) => {
  try {
    const idReservacion = parseInt(req.params.idReservacion);

    const resultado = await dbService.finalizarReservacion(idReservacion);
    if (!resultado.exito) {
      return res.status(404).json({ error: resultado.mensaje });
    }
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al finalizar reservación:', error);
  }
});

app.patch('/api/facturas/:idFactura/pagar', async (req, res) => {
  try {
    const idFactura = parseInt(req.params.idFactura);
    
    const resultado = await dbService.actualizarEstadoPagoFactura(idFactura);
    
    if (!resultado.exito) {
      if (resultado.mensaje.includes('no encontrada')) {
        return res.status(404).json({ error: resultado.mensaje });
      }
      return res.status(400).json({ error: resultado.mensaje });
    }
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar estado de pago:', error);
  }
});

// EMPRESAS -----------------------------------------------------------------------------------------------------------
app.post('/api/empresas-recreacion', async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.cedulaJuridica) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (nombre, cedulaJuridica)' 
      });
    }

    const empresaData = {
      nombre: req.body.nombre,
      cedulaJuridica: req.body.cedulaJuridica,
      email: req.body.email,
      telefono: req.body.telefono,
      contactoNombre: req.body.contactoNombre,
      idDireccion: req.body.idDireccion ? parseInt(req.body.idDireccion) : null,
      descripcion: req.body.descripcion
    };

    const idEmpresa = await dbService.insertarEmpresaRecreacion(empresaData);
    
    if (idEmpresa === -1) {
      return res.status(500).json({ error: 'Error al registrar empresa' });
    }
    
    res.status(201).json({ idEmpresa });
  } catch (error) {
    console.error('Error al registrar empresa:', error);
  }
});

 // ASIGNAR ACTIVIDAD A EMPRESA
app.post('/api/empresas-recreacion/:idEmpresa/actividades', async (req, res) => {
  try {
    const idEmpresa = parseInt(req.params.idEmpresa);
    const idTipoActividad = parseInt(req.body.idTipoActividad);
    const precio = parseFloat(req.body.precio);
    
    const resultado = await dbService.asignarActividadEmpresa(
      idEmpresa,
      idTipoActividad,
      precio,
      req.body.descripcion
    );
    
    if (!resultado.exito) {
      if (resultado.mensaje.includes('Empresa no existe') || 
          resultado.mensaje.includes('Tipo de actividad no existe')) {
        return res.status(404).json({ error: resultado.mensaje });
      }
      return res.status(400).json({ error: resultado.mensaje });
    }
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al asignar actividad:', error);

  }
});

// ver todas las activadades disponibles 
app.get('/api/tipos-actividad', async (req, res) => {
  try {
    const tiposActividad = await dbService.obtenerTiposActividad();
    res.json(tiposActividad);
  } catch (error) {
    console.error('Error al obtener tipos de actividad:', error);
  }
});

// actividades por establecimeinto
app.get('/api/actividades-recreacion', async (req, res) => {
  try {
    const idEmpresa = req.query.idEmpresa ? parseInt(req.query.idEmpresa) : null;
    
    if (idEmpresa !== null && isNaN(idEmpresa)) {
      return res.status(400).json({ error: 'ID de empresa debe ser un número' });
    }

    const actividades = await dbService.obtenerActividadesPorEstablecimiento(idEmpresa);
    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
  }
});

// COMPRA DE ACTIVIDADES

// Registrar compra de actividad
app.post('/api/compras/actividades', async (req, res) => {
  try {
    if (!req.body.idCliente || !req.body.idActividadEmpresa || !req.body.fechaActividad || !req.body.metodoPago) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (idCliente, idActividadEmpresa, fechaActividad, metodoPago)' 
      });
    }

    const compraData = {
      idCliente: parseInt(req.body.idCliente),
      idActividadEmpresa: parseInt(req.body.idActividadEmpresa),
      fechaActividad: req.body.fechaActividad,
      cantidadPersonas: req.body.cantidadPersonas ? parseInt(req.body.cantidadPersonas) : 1,
      metodoPago: req.body.metodoPago
    };

    const { idCompra, mensaje } = await dbService.registrarCompraActividad(compraData);
    
    if (idCompra === -1) {
      return res.status(400).json({ error: mensaje });
    }
    
    res.status(201).json({ 
      idCompra,
      mensaje 
    });
  } catch (error) {
    console.error('Error al registrar compra de actividad:', error);
    res.status(500).json({ error: 'Error interno al procesar la compra' });
  }
});

//  MODIFICACIONES

// ACTUALIZAR ESTABLECIMIENTOS

app.put('/api/establecimientos/:id', async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.tipo) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (nombre, tipo)' 
      });
    }

    const establecimientoData = {
      idEstablecimiento: parseInt(req.params.id),
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      telefono1: req.body.telefono1 || null,
      telefono2: req.body.telefono2 || null,
      email: req.body.email || null,
      webURL: req.body.webURL || null,
      facebookURL: req.body.facebookURL || null,
      instagramURL: req.body.instagramURL || null,
      youtubeURL: req.body.youtubeURL || null,
      tiktokURL: req.body.tiktokURL || null,
      airbnbURL: req.body.airbnbURL || null,
      threadsURL: req.body.threadsURL || null,
      xURL: req.body.xURL || null
    };

    const { mensaje } = await dbService.actualizarEstablecimiento(establecimientoData);

    if (mensaje.startsWith('Error:')) {
      return res.status(400).json({ error: mensaje });
    }
    
    res.status(200).json({ mensaje });
  } catch (error) {
    console.error('Error al actualizar establecimiento:', error);
    res.status(500).json({ error: 'Error interno al actualizar el establecimiento' });
  }
});

// ACTUALIZAR TIPO DE HABITACION 

// Actualizar tipo de habitación
app.put('/api/tipos-habitacion/:id', async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.precio || !req.body.cantidad) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (nombre, precio, cantidad)' 
      });
    }

    const tipoHabitacionData = {
      idTipoHabitacion: parseInt(req.params.id),
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      tipoCama: req.body.tipoCama || null,
      precio: parseFloat(req.body.precio),
      cantidad: parseInt(req.body.cantidad)
    };


    const { mensaje } = await dbService.actualizarTipoHabitacion(tipoHabitacionData);

    if (mensaje.startsWith('Error:')) {
      return res.status(400).json({ error: mensaje });
    }
    
    res.status(200).json({ mensaje });
  } catch (error) {
    console.error('Error al actualizar tipo de habitación:', error);
    res.status(500).json({  error: 'Error interno al actualizar el tipo de habitación' });
  }
});

// Actualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {

    if (!req.body.nombre || !req.body.apellido1 || !req.body.fechaNacimiento || !req.body.paisResidencia) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (nombre, apellido1, fechaNacimiento, paisResidencia)' 
      });
    }


    const fechaNacimiento = new Date(req.body.fechaNacimiento);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
      return res.status(400).json({ 
        error: 'La fecha de nacimiento no puede ser futura' 
      });
    }

    const clienteData = {
      idCliente: parseInt(req.params.id),
      nombre: req.body.nombre,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2 || null,
      fechaNacimiento: req.body.fechaNacimiento,
      paisResidencia: req.body.paisResidencia,
      idDireccion: req.body.idDireccion ? parseInt(req.body.idDireccion) : null,
      telefono1: req.body.telefono1 || null,
      telefono2: req.body.telefono2 || null,
      telefono3: req.body.telefono3 || null,
      email: req.body.email || null
    };

    const { mensaje } = await dbService.actualizarCliente(clienteData);
    
    if (mensaje.startsWith('Error:')) {
      return res.status(400).json({ error: mensaje });
    }
    
    res.status(200).json({ mensaje });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ 
      error: 'Error interno al actualizar el cliente' 
    });
  }
});

// Actualizar Empresas de Recreacion 
app.put('/api/empresas-recreacion/:id', async (req, res) => {
  try {

    if (!req.body.nombre) {
      return res.status(400).json({ 
        error: 'El campo nombre es requerido' 
      });
    }

    const empresaData = {
      idEmpresa: parseInt(req.params.id),
      nombre: req.body.nombre,
      email: req.body.email || null,
      telefono: req.body.telefono || null,
      contactoNombre: req.body.contactoNombre || null,
      idDireccion: req.body.idDireccion ? parseInt(req.body.idDireccion) : null,
      descripcion: req.body.descripcion || null
    };

    const { mensaje } = await dbService.actualizarEmpresaRecreacion(empresaData);
    
    if (mensaje.startsWith('Error:')) {
      return res.status(400).json({ error: mensaje });
    }
    
    res.status(200).json({ 
      success: true,
      mensaje 
    });
  } catch (error) {
    console.error('Error al actualizar empresa de recreación:', error);
    res.status(500).json({ 
      error: 'Error interno al actualizar la empresa de recreación' 
    });
  }
});

// ELIMINACION DE DATOS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Eliminar establecimiento
app.delete('/api/establecimientos/:id', async (req, res) => {
  try {
    const idEstablecimiento = parseInt(req.params.id);

    const { mensaje } = await dbService.eliminarEstablecimiento(idEstablecimiento);
    
    if (mensaje.startsWith('Error:')) {
      return res.status(400).json({ 
        success: false,
        error: mensaje 
      });
    }
    
    res.status(200).json({ 
      success: true,
      mensaje 
    });
  } catch (error) {
    console.error('Error al eliminar establecimiento:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al eliminar el establecimiento' 
    });
  }
});

// Eliminar tipo de habitación
app.delete('/api/tipos-habitacion/:id', async (req, res) => {
  try {
    // Validar que el ID es numérico
    const idTipoHabitacion = parseInt(req.params.id);
    if (isNaN(idTipoHabitacion)) {
      return res.status(400).json({
        success: false,
        error: 'El ID debe ser un número válido'
      });
    }

    const { mensaje } = await dbService.eliminarTipoHabitacion(idTipoHabitacion);

    if (mensaje.startsWith('Error:')) {
      const statusCode = mensaje.includes('no existe') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: mensaje
      });
    }

    res.status(200).json({
      success: true,
      mensaje: mensaje
    });

  } catch (error) {
    console.error('Error en eliminación de tipo habitación:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al eliminar tipo de habitación'
    });
  }
});

// Eliminar empresa de recreacion
app.delete('/api/empresas-recreacion/:id', async (req, res) => {
  try {
    const idEmpresa = parseInt(req.params.id);
    if (isNaN(idEmpresa)) {
      return res.status(400).json({
        success: false,
        error: 'El ID de empresa debe ser un número válido'
      });
    }

    const { mensaje } = await dbService.eliminarEmpresaRecreacion(idEmpresa);

    if (mensaje.startsWith('Error:')) {
      const statusCode = mensaje.includes('no existe') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: mensaje
      });
    }

    res.status(200).json({
      success: true,
      mensaje: mensaje
    });

  } catch (error) {
    console.error('Error en eliminación de empresa recreación:', {
      error: error.message,
      stack: error.stack,
      idEmpresa: req.params.id
    });
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al eliminar empresa'
    });
  }
});

// REPORTES -----------------------------------------------------------------------------------------------------------------------

// Reporte de facturacion
app.get('/api/reportes/facturacion', async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'fechaInicio y fechaFin son requeridos' });
  }

  try {
    const reporte = await dbService.obtenerReporteFacturacion(fechaInicio, fechaFin);
    res.json(reporte[0] || { 
      fechaInicio, 
      fechaFin, 
      cantidadFacturas: 0, 
      totalFacturado: 0 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

//  Total facturado por tipo de habitacion

// Reporte de total facturado por tipo de habitación
app.get('/api/reportes/facturacion-tipo-habitacion/:id', async (req, res) => {
  const idTipoHabitacion = parseInt(req.params.id);

  try {
    const reporte = await dbService.obtenerTotalFacturadoPorTipoHabitacion(idTipoHabitacion);
    
    if (!reporte || reporte.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron datos para este tipo de habitación',
        idTipoHabitacion
      });
    }

    res.json(reporte[0]);
  } catch (error) {
    console.error('Error en reporte:', error);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
});

// Reporte de total facturado por habitación concreta

app.get('/api/reportes/facturacion-habitacion/:id', async (req, res) => {
  const idHabitacion = parseInt(req.params.id);
  
  if (isNaN(idHabitacion)) {
    return res.status(400).json({ error: 'ID de habitación inválido' });
  }

  try {
    const reporte = await dbService.obtenerTotalFacturadoPorHabitacion(idHabitacion);
    res.json(reporte[0] || { 
      idHabitacion,
      cantidadFacturas: 0, 
      totalFacturado: 0 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Reporte de reservas finalizadas 
app.get('/api/reportes/reservaciones-finalizadas-tipo', async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'fechaInicio y fechaFin son requeridos' });
  }

  try {
    const reporte = await dbService.obtenerReservacionesFinalizadasPorTipo(fechaInicio, fechaFin);
    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Rango de edadaes de los clientes por establecimiento 
app.get('/api/reportes/rango-edades-establecimiento/:id', async (req, res) => {
  const idEstablecimiento = parseInt(req.params.id);
  
  if (isNaN(idEstablecimiento)) {
    return res.status(400).json({ error: 'ID de establecimiento inválido' });
  }

  try {
    const reporte = await dbService.obtenerRangoEdadesClientes(idEstablecimiento);
    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Hoteles con mayor demanda por fecha 

app.get('/api/reportes/hotel-mayor-demanda', async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'fechaInicio y fechaFin son requeridos' });
  }

  try {
    const hotel = await dbService.obtenerHotelMayorDemanda(fechaInicio, fechaFin);
    res.json(hotel[0] || { message: 'No se encontraron reservaciones en el rango de fechas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Hoteles con mayor demanda por provincia 
app.get('/api/reportes/hotel-mayor-demanda-provincia', async (req, res) => {
  const { provincia } = req.query;

  if (!provincia) {
    return res.status(400).json({ error: 'El parámetro provincia es requerido' });
  }

  try {
    const hotel = await dbService.obtenerHotelMayorDemandaProvincia(provincia);
    res.json(hotel[0] || { message: 'No se encontraron hoteles en la provincia especificada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// BUSQUEDAS ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Búsqueda de establecimientos
app.get('/api/establecimientos/buscar', async (req, res) => {
  try {
    const filtros = {
      nombre: req.query.nombre || null,
      provincia: req.query.provincia || null,
      canton: req.query.canton || null,
      servicio: req.query.servicio || null,
      tipoEstablecimiento: req.query.tipoEstablecimiento || null
    };

    const resultados = await dbService.buscarEstablecimientos(filtros);
    res.json(resultados);
  } catch (error) {
    console.error('Error en búsqueda de establecimientos:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
});

// Busqueda de Clientes

app.get('/api/clientes/buscar', async (req, res) => {
  try {
    const resultados = await dbService.buscarClientes({
      textoBusqueda: req.query.busqueda,
      paisResidencia: req.query.pais,
      provincia: req.query.provincia,
      canton: req.query.canton,
      soloConReservaciones: req.query.reservaciones // 'true' o 'false' (string)
    });
    
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// Busqueda de Empresas de recreacion 

app.get('/api/empresas-recreacion/buscar', async (req, res) => {
  try {
    const resultados = await dbService.buscarEmpresasRecreacion({
      textoBusqueda: req.query.busqueda,
      tipoActividad: req.query.actividad,
      provincia: req.query.provincia,
      canton: req.query.canton,
      precioMin: req.query.precio_min,
      precioMax: req.query.precio_max
    });
    
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});











const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});