const sql = require('mssql');

const dbConfig = {
  server: '192.168.100.225', 
  port: 1433, 
  user: 'admin',
  password: 'admin123',
  database: 'PY1BD',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS' 
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

async function getConnection() {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    return pool;
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(`No se pudo conectar a SQL Server: ${error.message}`);
  }
}

module.exports = { getConnection, sql };