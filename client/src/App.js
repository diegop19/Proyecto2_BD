import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ClientHome from './pages/clients/ClientHome';
import ClientRooms from './pages/clients/ClientRooms';
import ClientActivities from './pages/clients/ClientActivities';
import AdminHome from './pages/admin/AdminHome';
import AdminEstablishments from './pages/admin/establishments/AdminEstablishments';
import AdminEstablishmentsRegister from './pages/admin/establishments/AdminEstablishmentsRegister';
import AdminRoomsTypeRegister from './pages/admin/establishments/rooms/type/AdminRoomsTypeRegister';
import AdminRoomsRegister from './pages/admin/establishments/rooms/AdminRoomsRegister';
import AdminCompanies from './pages/admin/companies/AdminCompanies';
import AdminCompaniesRegister from './pages/admin/companies/AdminCompaniesRegister';
import AdminReservations from './pages/admin/reservations/AdminReservations';
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
            <Route path="/admin/establishments/rooms/type/register" element={<AdminRoomsTypeRegister />} />
            <Route path="/admin/establishments/rooms/register" element={<AdminRoomsRegister />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/companies/register" element={<AdminCompaniesRegister />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;