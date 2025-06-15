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
    if (!req.body.nombre || !req.body.cedulaJuridica || !req.body.tipo || !req.body.idDireccion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const idEstablecimiento = await dbService.insertarEstablecimiento(req.body);
    res.status(201).json({ idEstablecimiento });
  } catch (error) {
    console.error('Error al crear establecimiento:', error);
    res.status(500).json({ 
      error: 'Error al crear establecimiento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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






                      

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});