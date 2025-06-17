import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ClientHome from './pages/clients/ClientHome';
import ClientRooms from './pages/clients/ClientRooms';
import ClientActivities from './pages/clients/ClientActivities';
import AdminHome from './pages/admin/AdminHome';
import AdminEstablishments from './pages/admin/establishments/AdminEstablishments';
import AdminEstablishmentsRegister from './pages/admin/establishments/AdminEstablishmentsRegister';
import AdminReservations from './pages/admin/AdminReservations';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ClientHome />} />
            <Route path="/lodging" element={<ClientRooms />} />
            <Route path="/activities" element={<ClientActivities />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/establishments" element={<AdminEstablishments />} />
            <Route path="/admin/establishments/register" element={<AdminEstablishmentsRegister />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;