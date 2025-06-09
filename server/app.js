const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getConnection } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: "ola desde el back" });
});
 

app.get('/api/clientes', async (req, res) => {
  let pool;
  try {
    pool = await getConnection(); 
    const request = pool.request(); 
    
    const result = await request.query('SELECT * FROM Clientes');
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error en /api/clientes:', error);

    res.status(500).json({ 
      error: 'Error al obtener clientes',
      details: error.message 
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});


// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});