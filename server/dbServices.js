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
  }

};
