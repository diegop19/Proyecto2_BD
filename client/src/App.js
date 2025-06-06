import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error: ' + err));
  }, []);

  return (
    <div>
      <h1>Prueba de conexión:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;