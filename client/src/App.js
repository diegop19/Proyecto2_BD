import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Aquí iría el Navbar si lo tienes */}
        
        <main className="main-content">
          <Routes>
            {/* Ruta principal - HomePage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Otras rutas básicas */}
            <Route path="/about" element={<AboutPage />} />
            
          </Routes>
        </main>
        

      </div>
    </Router>
  );
}

export default App;