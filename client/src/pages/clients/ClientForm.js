import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientForm = () => {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    fechaNacimiento: '',
    cedula: '',
    paisResidencia: 'Costa Rica', // Valor por defecto
    telefono1: '',
    telefono2: '',
    telefono3: '',
    email: ''
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al registrar cliente');

      const data = await response.json();
      alert(`Cliente registrado exitosamente con ID: ${data.idCliente}`);
      
      // Aquí podrías redirigir o limpiar el formulario
      setFormData({
        nombre: '',
        apellido1: '',
        apellido2: '',
        fechaNacimiento: '',
        cedula: '',
        paisResidencia: 'Costa Rica',
        telefono1: '',
        telefono2: '',
        telefono3: '',
        email: ''
      });

    } catch (error) {
      alert('Error al registrar el cliente: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Registrar Nuevo Cliente</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Primer Apellido:</label>
          <input 
            type="text"
            name="apellido1"
            value={formData.apellido1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Segundo Apellido (Opcional):</label>
          <input 
            type="text"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento:</label>
          <input 
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cédula/Pasaporte:</label>
          <input 
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>País de Residencia:</label>
          <input 
            type="text"
            name="paisResidencia"
            value={formData.paisResidencia}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono Principal:</label>
          <input 
            type="tel"
            name="telefono1"
            value={formData.telefono1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono Secundario (Opcional):</label>
          <input 
            type="tel"
            name="telefono2"
            value={formData.telefono2}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono Adicional (Opcional):</label>
          <input 
            type="tel"
            name="telefono3"
            value={formData.telefono3}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email (Opcional):</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Registrar Cliente
          </button>
        </div>
      </form>

      <button 
        onClick={() => navigate(-1)} // Volver a la página anterior
        className="text-link"
      >
        ← Cancelar
      </button>
    </div>
  );
};

export default ClientForm;