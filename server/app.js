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

// Registrar Hotel 











const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});