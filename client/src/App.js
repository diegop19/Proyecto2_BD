import { useEffect, useState } from 'react';

function App() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Datos recibidos:', data);
        
        setClientes(data);
      } catch (err) {
        console.error('Error al obtener clientes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Listado de Clientes</h1>
      
      {clientes.length === 0 ? (
        <p>No hay clientes registrados</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clientes.map(cliente => (
            <li key={cliente.id || cliente.ID} style={{ 
              margin: '10px 0',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <strong>ID:</strong> {cliente.id || cliente.ID}<br />
              <strong>Nombre:</strong> {cliente.nombre || cliente.Nombre}<br />
              <strong>Email:</strong> {cliente.email || cliente.Email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;