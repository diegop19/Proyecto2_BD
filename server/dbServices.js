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

  insertarFactura: async (facturaData) => {
    const pool = await getConnection();
    const request = pool.request();
    
    // Parametros requeridos
    request.input('ID_Reservacion', sql.Int, facturaData.idReservacion);
    request.input('Metodo_Pago', sql.VarChar(20), facturaData.metodoPago);
    
    // Parametros opcionales
    request.input('Detalles', sql.VarChar(200), facturaData.detalles || null);
    
    // Parámetros de salida
    request.output('ID_Factura', sql.Int);
    request.output('Mensaje', sql.VarChar(200));
    
    await request.execute('sp_InsertarFactura');
    
    return {
      idFactura: request.parameters.ID_Factura.value,
      mensaje: request.parameters.Mensaje.value
    };
  }



};
 