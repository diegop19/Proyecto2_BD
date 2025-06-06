const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: "ola desde el back" });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});