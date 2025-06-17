const { getConnection } = require('./db');
const sql = require('mssql');

module.exports = {
  // Operaciones con direcciones
  insertarDireccion: async (direccionData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    request.input('CodigoProvincia', sql.Char(2), direccionData.codigoProvincia);
    request.input('CodigoCanton', sql.Char(2), direccionData.codigoCanton);
    request.input('CodigoDistrito', sql.Char(2), direccionData.codigoDistrito);
    request.input('CodigoBarrio', sql.Char(2), direccionData.codigoBarrio);
    request.input('SenasExactas', sql.VarChar(200), direccionData.senasExactas);
    request.input('GPS', sql.VarChar(100), direccionData.gps || null);
    request.output('IDDireccion', sql.Int);
    
    await request.execute('sp_InsertarDireccion');
    return request.parameters.IDDireccion.value;
  },

  obtenerProvincias: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_ObtenerProvincias');
    return result.recordset;
  },

  obtenerCantones: async (codigoProvincia) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoProvincia', sql.Char(2), codigoProvincia)
      .execute('sp_ObtenerCantonesPorProvincia');
    return result.recordset;
  },

  obtenerDistritos: async (codigoProvincia, codigoCanton) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoProvincia', sql.Char(2), codigoProvincia)
      .input('CodigoCanton', sql.Char(2), codigoCanton)
      .execute('sp_ObtenerDistritosPorCanton');
    return result.recordset;
  },

  obtenerBarrios: async (codigoProvincia, codigoCanton, codigoDistrito) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoProvincia', sql.Char(2), codigoProvincia)
      .input('CodigoCanton', sql.Char(2), codigoCanton)
      .input('CodigoDistrito', sql.Char(2), codigoDistrito)
      .execute('sp_ObtenerBarriosPorDistrito');
    return result.recordset;
  },


  // ESTABLECIMIENTOS ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  insertarEstablecimiento: async (hotelData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    // Parametros requeridos
    request.input('Nombre', sql.VarChar(100), hotelData.nombre);
    request.input('CedulaJuridica', sql.VarChar(20), hotelData.cedulaJuridica);
    request.input('Tipo', sql.VarChar(50), hotelData.tipo);                       // El tipo dse va a encontrar en el front y se pasa como parametro 
    request.input('IDDireccion', sql.Int, hotelData.idDireccion);
    
    // Parametros opcionales
    request.input('Telefono1', sql.VarChar(20), hotelData.telefono1 || null);
    request.input('Telefono2', sql.VarChar(20), hotelData.telefono2 || null);
    request.input('Email', sql.VarChar(100), hotelData.email || null);
    request.input('WebURL', sql.VarChar(100), hotelData.webURL || null);
    request.input('FacebookURL', sql.VarChar(100), hotelData.facebookURL || null);
    request.input('InstagramURL', sql.VarChar(100), hotelData.instagramURL || null);
    request.input('YoutubeURL', sql.VarChar(100), hotelData.youtubeURL || null);
    request.input('TiktokURL', sql.VarChar(100), hotelData.tiktokURL || null);
    request.input('AirbnbURL', sql.VarChar(100), hotelData.airbnbURL || null);
    request.input('ThreadsURL', sql.VarChar(100), hotelData.threadsURL || null);
    request.input('XURL', sql.VarChar(100), hotelData.xURL || null);
    
    request.output('IDEstablecimiento', sql.Int);
    
    await request.execute('sp_InsertarEstablecimiento');
    return request.parameters.IDEstablecimiento.value;
  },

  // SERVICIOS
  asignarServicioEstablecimiento: async (idEstablecimiento, idServicio) => {
      const pool = await getConnection();
      const request = pool.request();
      
      request.input('IDEstablecimiento', sql.Int, idEstablecimiento);
      request.input('IDServicio', sql.Int, idServicio);
      
      await request.execute('sp_AsignarServicioEstablecimiento');
  },

  obtenerServicios: async () => {
      const pool = await getConnection();
      const result = await pool.request().execute('sp_ObtenerServicios');  // los servicios se obtendran preguardados de la base de datos
      return result.recordset;
  },

    // TIPOS DE HABITACION
  insertarTipoHabitacion: async (tipoHabitacionData) => {
      const pool = await getConnection();
      const request = pool.request();
      
      request.input('IDEstablecimiento', sql.Int, tipoHabitacionData.idEstablecimiento);
      request.input('Nombre', sql.VarChar(50), tipoHabitacionData.nombre);
      request.input('Precio', sql.Decimal(10, 2), tipoHabitacionData.precio);
      request.input('Cantidad', sql.Int, tipoHabitacionData.cantidad);
      
      request.input('Descripcion', sql.Text, tipoHabitacionData.descripcion || null);
      request.input('TipoCama', sql.VarChar(50), tipoHabitacionData.tipoCama || null);
      
      request.output('IDTipoHabitacion', sql.Int);
      
      await request.execute('sp_InsertarTipoHabitacion');
      return request.parameters.IDTipoHabitacion.value;
  },

  obtenerTiposHabitacion: async (idEstablecimiento) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('ID_Establecimiento', sql.Int, idEstablecimiento)
      .execute('sp_ObtenerTiposHabitacionPorHotel');
    
    return result.recordset; 
  },

  // COMODIDADES

  // Asignar Comodidad a una habitacion 
  asignarComodidadHabitacion: async (idTipoHabitacion, idComodidad) => {
    const pool = await getConnection();
    const request = pool.request();
    
    request.input('IDTipoHabitacion', sql.Int, idTipoHabitacion);
    request.input('IDComodidad', sql.Int, idComodidad);
    
    await request.execute('sp_AsignarComodidadHabitacion');
  },

  // obtener todas las comodidades
  obtenerComodidades: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute(sp_ObtenerComodidades);  // las comodidades se obtendra directamente de la base de datos al front
      return result.recordset;
  },

  // obtener las comodidades por el tipo de habitacion

  obtenerComodidadesHabitacion: async (idTipoHabitacion) => {
    const pool = await getConnection();
    const result = await pool.request().execute(sp_ObtenerComodidadesPorTipoHabitacion)
    return result.recordset;
  },

  // HABITACIONES

  insertarHabitacion: async (habitacionData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    // Parametros requeridos
    request.input('IDTipoHabitacion', sql.Int, habitacionData.idTipoHabitacion);
    request.input('Numero', sql.VarChar(10), habitacionData.numero);
    
    // Parametro opcional con valor por defecto
    request.input('Estado', sql.VarChar(20), habitacionData.estado || 'Disponible');
    
    request.output('IDHabitacion', sql.Int);
    
    await request.execute('sp_InsertarHabitacion');
    return request.parameters.IDHabitacion.value;
  },

  // CLIENTES ---------------------------------------------------------------------------------------------------------------------------------------------------------------

    insertarCliente: async (clienteData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    // Parametros requeridos
    request.input('Nombre', sql.VarChar(50), clienteData.nombre);
    request.input('Apellido1', sql.VarChar(50), clienteData.apellido1);
    request.input('FechaNacimiento', sql.Date, clienteData.fechaNacimiento);
    request.input('Cedula', sql.VarChar(20), clienteData.cedula);
    request.input('PaisResidencia', sql.VarChar(50), clienteData.paisResidencia);
    
    // Parametros opcionales
    request.input('Apellido2', sql.VarChar(50), clienteData.apellido2 || null);
    request.input('IDDireccion', sql.Int, clienteData.idDireccion || null);
    request.input('Telefono1', sql.VarChar(20), clienteData.telefono1 || null);
    request.input('Telefono2', sql.VarChar(20), clienteData.telefono2 || null);
    request.input('Telefono3', sql.VarChar(20), clienteData.telefono3 || null);
    request.input('Email', sql.VarChar(100), clienteData.email || null);
    
    request.output('IDCliente', sql.Int);
    
    await request.execute('sp_InsertarCliente');
    return request.parameters.IDCliente.value;
  },
  
  insertarReservacion: async (reservacionData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    // Parametros requeridos
    request.input('ID_Cliente', sql.Int, reservacionData.idCliente);
    request.input('ID_Habitacion', sql.Int, reservacionData.idHabitacion);
    request.input('Fecha_Ingreso', sql.Date, reservacionData.fechaIngreso);
    request.input('Fecha_Salida', sql.Date, reservacionData.fechaSalida);
    request.input('Cantidad_Personas', sql.Int, reservacionData.cantidadPersonas);
    
    // Parametros opcionales
    request.input('Hora_Ingreso', sql.Time, reservacionData.horaIngreso || null);
    request.input('Hora_Salida', sql.Time, reservacionData.horaSalida || null);
    request.input('Tiene_Vehiculo', sql.Bit, reservacionData.tieneVehiculo || false);
    
    // Parametros de salida
    request.output('ID_Reservacion', sql.Int);
    request.output('Mensaje', sql.VarChar(200));
    
    await request.execute('sp_InsertarReservacion');
    
    return {
      idReservacion: request.parameters.ID_Reservacion.value,
      mensaje: request.parameters.Mensaje.value
    };
  },

  // FINALIZACION DE RESERVA Y FACTURAS

   finalizarReservacion: async (idReservacion) => {
    const pool = await getConnection();
    const request = pool.request();

    request.input('ID_Reservacion', sql.Int, idReservacion);
    
    request.output('Mensaje', sql.VarChar(200));
    
    await request.execute('sp_FinalizarReservacion');
    
    const mensaje = request.parameters.Mensaje.value;
    const exito = !mensaje.startsWith('Error:');    
    return { exito, mensaje };
  },

  // Confirma que se realizo el pago correctamente 
  actualizarEstadoPagoFactura: async (idFactura) => {
    const pool = await getConnection();
    const request = pool.request();

    request.input('ID_Factura', sql.Int, idFactura);
    
    request.output('Mensaje', sql.VarChar(200));
    
    await request.execute('sp_ActualizarEstadoPagoFactura');
    
    const mensaje = request.parameters.Mensaje.value;
    const exito = !mensaje.startsWith('Error:');
    
    return { exito, mensaje };
  },

  insertarEmpresaRecreacion: async (empresaData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    request.input('Nombre', sql.VarChar(100), empresaData.nombre);
    request.input('CedulaJuridica', sql.VarChar(20), empresaData.cedulaJuridica);
  
    request.input('Email', sql.VarChar(100), empresaData.email || null);
    request.input('Telefono', sql.VarChar(20), empresaData.telefono || null);
    request.input('ContactoNombre', sql.VarChar(100), empresaData.contactoNombre || null);
    request.input('ID_Direccion', sql.Int, empresaData.idDireccion || null);
    request.input('Descripcion', sql.Text, empresaData.descripcion || null);
    
    request.output('ID_Empresa', sql.Int);
    
    try {
      await request.execute('sp_InsertarEmpresaRecreacion');
      return request.parameters.ID_Empresa.value;
    } catch (error) {
      console.error('Error en sp_InsertarEmpresaRecreacion:', error);
      return -1; 
    }
  },

  // ASIGNAR ACTIVIDAD A EMPRESA
  asignarActividadEmpresa: async (idEmpresa, idTipoActividad, precio, descripcion = null) => {
    const pool = await getConnection();
    const request = pool.request();
    
    request.input('ID_Empresa', sql.Int, idEmpresa);
    request.input('ID_Tipo_Actividad', sql.Int, idTipoActividad);
    request.input('Precio', sql.Decimal(10, 2), precio);
    
    request.input('Descripcion', sql.Text, descripcion || null);
    
    request.output('Mensaje', sql.VarChar(200));
    
    await request.execute('sp_AsignarActividadEmpresa');
    
    const mensaje = request.parameters.Mensaje.value;
    const exito = !mensaje.startsWith('Error:');
    
    return { exito, mensaje };
  },

  // obtener todas las actividades 
  obtenerTiposActividad: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_ObtenerTiposActividad');
    return result.recordset;
  },

  //obtener todas las actividades de un establecimiento
  obtenerActividadesPorEstablecimiento: async (idEmpresa = null) => {
    const pool = await getConnection();
    const request = pool.request();
    
    if (idEmpresa !== null) {
      request.input('ID_Empresa', sql.Int, idEmpresa);
    } else {
      request.input('ID_Empresa', sql.Int, null);
    }
    
    const result = await request.execute('sp_ObtenerActividadesPorEstablecimiento');
    return result.recordset;
  },

  // Compra de alguna actividad
  registrarCompraActividad: async (compraData) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Cliente', sql.Int, compraData.idCliente);
  request.input('ID_Actividad_Empresa', sql.Int, compraData.idActividadEmpresa);
  request.input('Fecha_Actividad', sql.Date, compraData.fechaActividad);
  request.input('Cantidad_Personas', sql.Int, compraData.cantidadPersonas || 1);
  request.input('Metodo_Pago', sql.VarChar(20), compraData.metodoPago);
  request.output('ID_Compra', sql.Int);
  request.output('Mensaje', sql.VarChar(200));
  
  await request.execute('sp_RegistrarCompraActividad');
  
  return {
    idCompra: request.parameters.ID_Compra.value,
    mensaje: request.parameters.Mensaje.value
  };
},

// MODIFICACIONES

actualizarEstablecimiento: async (establecimientoData) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Establecimiento', sql.Int, establecimientoData.idEstablecimiento);
  request.input('Nombre', sql.VarChar(100), establecimientoData.nombre);
  request.input('Tipo', sql.VarChar(50), establecimientoData.tipo);
  request.input('Telefono1', sql.VarChar(20), establecimientoData.telefono1);
  request.input('Telefono2', sql.VarChar(20), establecimientoData.telefono2);
  request.input('Email', sql.VarChar(100), establecimientoData.email);
  request.input('WebURL', sql.VarChar(100), establecimientoData.webURL);
  request.input('FacebookURL', sql.VarChar(100), establecimientoData.facebookURL);
  request.input('InstagramURL', sql.VarChar(100), establecimientoData.instagramURL);
  request.input('YoutubeURL', sql.VarChar(100), establecimientoData.youtubeURL);
  request.input('TiktokURL', sql.VarChar(100), establecimientoData.tiktokURL);
  request.input('AirbnbURL', sql.VarChar(100), establecimientoData.airbnbURL);
  request.input('ThreadsURL', sql.VarChar(100), establecimientoData.threadsURL);
  request.input('XURL', sql.VarChar(100), establecimientoData.xURL);
  request.output('Mensaje', sql.VarChar(200));

  await request.execute('sp_ActualizarEstablecimiento');
  
  return {
    mensaje: request.parameters.Mensaje.value
  };
},
// Actualizar tipo de habitación
actualizarTipoHabitacion: async (tipoHabitacionData) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Tipo_Habitacion', sql.Int, tipoHabitacionData.idTipoHabitacion);
  request.input('Nombre', sql.VarChar(50), tipoHabitacionData.nombre);
  request.input('Descripcion', sql.Text, tipoHabitacionData.descripcion);
  request.input('TipoCama', sql.VarChar(50), tipoHabitacionData.tipoCama);
  request.input('Precio', sql.Decimal(10, 2), tipoHabitacionData.precio);
  request.input('Cantidad', sql.Int, tipoHabitacionData.cantidad);
  request.output('Mensaje', sql.VarChar(200));

  await request.execute('sp_ActualizarTipoHabitacion');
  
  return {
    mensaje: request.parameters.Mensaje.value
  };
},

// Modificacion de clientes 

actualizarCliente: async (clienteData) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Cliente', sql.Int, clienteData.idCliente);
  request.input('Nombre', sql.VarChar(50), clienteData.nombre);
  request.input('Apellido1', sql.VarChar(50), clienteData.apellido1);
  request.input('Apellido2', sql.VarChar(50), clienteData.apellido2);
  request.input('FechaNacimiento', sql.Date, clienteData.fechaNacimiento);
  request.input('PaisResidencia', sql.VarChar(50), clienteData.paisResidencia);
  request.input('ID_Direccion', sql.Int, clienteData.idDireccion);
  request.input('Telefono1', sql.VarChar(20), clienteData.telefono1);
  request.input('Telefono2', sql.VarChar(20), clienteData.telefono2);
  request.input('Telefono3', sql.VarChar(20), clienteData.telefono3);
  request.input('Email', sql.VarChar(100), clienteData.email);
  request.output('Mensaje', sql.VarChar(200));
  
  await request.execute('sp_ActualizarCliente');
  
  return {
    mensaje: request.parameters.Mensaje.value
  };
},
// Actualizar Empresas de Recreacion 
actualizarEmpresaRecreacion: async (empresaData) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Empresa', sql.Int, empresaData.idEmpresa);
  request.input('Nombre', sql.VarChar(100), empresaData.nombre);
  request.input('Email', sql.VarChar(100), empresaData.email);
  request.input('Telefono', sql.VarChar(20), empresaData.telefono);
  request.input('ContactoNombre', sql.VarChar(100), empresaData.contactoNombre);
  request.input('ID_Direccion', sql.Int, empresaData.idDireccion);
  request.input('Descripcion', sql.Text, empresaData.descripcion);
  request.output('Mensaje', sql.VarChar(200));
  
  await request.execute('sp_ActualizarEmpresaRecreacion');
  
  return {
    mensaje: request.parameters.Mensaje.value
  };
},

// ELIMINACION DE DATOS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

eliminarEstablecimiento: async (idEstablecimiento) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Establecimiento', sql.Int, idEstablecimiento);
  request.output('Mensaje', sql.VarChar(200));

  await request.execute('sp_EliminarEstablecimiento');
  
  return {
    mensaje: request.parameters.Mensaje.value
  };
},

// Eliminar tipo de habitacion 

eliminarTipoHabitacion: async (idTipoHabitacion) => {
  let pool;
  try {
    pool = await getConnection();
    const request = pool.request();
    
    request.input('ID_Tipo_Habitacion', sql.Int, idTipoHabitacion);
    request.output('Mensaje', sql.VarChar(200));

    await request.execute('sp_EliminarTipoHabitacion');
    
    return {
      mensaje: request.parameters.Mensaje.value
    };
    
  } catch (error) {
    console.error('Error en dbService.eliminarTipoHabitacion:', {
      idTipoHabitacion,
      error: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
},

// Eliminar empresa de recreacion 

eliminarEmpresaRecreacion: async (idEmpresa) => {
  let pool;
  try {
    pool = await getConnection();
    const request = pool.request();
    
    // Configurar parámetros
    request.input('ID_Empresa', sql.Int, idEmpresa);
    request.output('Mensaje', sql.VarChar(200));
    
    // Ejecutar el stored procedure
    await request.execute('sp_EliminarEmpresaRecreacion');
    
    return {
      mensaje: request.parameters.Mensaje.value
    };
    
  } catch (error) {
    console.error('Error en dbService.eliminarEmpresaRecreacion:', {
      idEmpresa,
      error: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (err) {
        console.error('Error cerrando conexión:', err);
      }
    }
  }
},

// REPORTES -----------------------------------------------------------------------------------------------------------------------

// reporte de facturacion 
obtenerReporteFacturacion: async (fechaInicio, fechaFin) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('FechaInicio', sql.Date, fechaInicio);
  request.input('FechaFin', sql.Date, fechaFin);
  
  const result = await request.execute('sp_ReporteFacturacion');
  await pool.close();
  
  return result.recordset;
},

// Total facturado por tipo de habitacion 

obtenerTotalFacturadoPorTipoHabitacion: async (idTipoHabitacion) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_TipoHabitacion', sql.Int, idTipoHabitacion);
  const result = await request.execute('sp_TotalFacturadoPorTipoHabitacion');
  
  await pool.close();
  return result.recordset;
},

// Reporte de total facturado por habitación concreta
obtenerTotalFacturadoPorHabitacion: async (idHabitacion) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Habitacion', sql.Int, idHabitacion);
  const result = await request.execute('sp_TotalFacturadoPorHabitacion');
  
  await pool.close();
  return result.recordset;
},

// Reporte de reservas finalizadas 
obtenerReservacionesFinalizadasPorTipo: async (fechaInicio, fechaFin) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('FechaInicio', sql.Date, fechaInicio);
  request.input('FechaFin', sql.Date, fechaFin);
  
  const result = await request.execute('sp_ReporteReservacionesFinalizadasPorTipo');
  await pool.close();
  
  return result.recordset;
},

// Rango de edadaes de los clientes por establecimiento 

obtenerRangoEdadesClientes: async (idEstablecimiento) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('ID_Establecimiento', sql.Int, idEstablecimiento);
  const result = await request.execute('sp_RangoEdadesClientesPorEstablecimiento');
  
  await pool.close();
  return result.recordset;
},

// Hoteles con mayor demanda por fecha 

obtenerHotelMayorDemanda: async (fechaInicio, fechaFin) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('FechaInicio', sql.Date, fechaInicio);
  request.input('FechaFin', sql.Date, fechaFin);
  
  const result = await request.execute('sp_HotelMayorDemandaPorFecha');
  await pool.close();
  
  return result.recordset;
},

// Hoteles con mayor demanda por provincia 
obtenerHotelMayorDemandaProvincia: async (provincia) => {
  const pool = await getConnection();
  const request = pool.request();
  
  request.input('Provincia', sql.VarChar(50), provincia);
  
  const result = await request.execute('sp_HotelMayorDemandaPorProvincia');
  await pool.close();
  
  return result.recordset;
}








};
 