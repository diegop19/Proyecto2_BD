import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ClientHome from './pages/clients/ClientHome';
import ClientRooms from './pages/clients/ClientRooms';
import ClientActivities from './pages/clients/ClientActivities';
import AdminHome from './pages/admin/AdminHome';
import AdminEstablishments from './pages/admin/establishments/AdminEstablishments';
import AdminEstablishmentsForm from './pages/admin/establishments/AdminEstablishmentsForm';
import AdminRoomsTypesForm from './pages/admin/establishments/rooms/types/AdminRoomsTypesForm';
import AdminRoomsForm from './pages/admin/establishments/rooms/AdminRoomsForm';
import AdminCompanies from './pages/admin/companies/AdminCompanies';
import AdminCompaniesForm from './pages/admin/companies/AdminCompaniesForm';
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
            <Route path="/admin/establishments/register" element={<AdminEstablishmentsForm />} />
            <Route path="/admin/establishments/edit/:id" element={<AdminEstablishmentsForm />} />
            <Route path="/admin/establishments/rooms/types/register" element={<AdminRoomsTypesForm />} />
            <Route path="/admin/establishments/rooms/types/edit/:id" element={<AdminRoomsTypesForm />} />
            <Route path="/admin/establishments/rooms/register" element={<AdminRoomsForm />} />
            <Route path="/admin/establishments/rooms/edit/:id" element={<AdminRoomsForm />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/companies/register" element={<AdminCompaniesForm />} />
            <Route path="/admin/companies/edit/:id" element={<AdminCompaniesForm />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;