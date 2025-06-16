import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ClientHome from './pages/ClientHome';
import ClientRooms from './pages/ClientRooms';
import ClientActivities from './pages/ClientActivities';
import AdminHome from './pages/AdminHome';
import AdminRooms from './pages/AdminRooms';
import AdminReservations from './pages/AdminReservations';
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
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;