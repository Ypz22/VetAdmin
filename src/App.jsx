import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Home from './pages/home/Home.jsx'
import { Toaster } from "react-hot-toast";
import AppLayout from './components/AppLayout.jsx';
import Register from './pages/register/Register.jsx';
import Admin from './pages/admin/Admin.jsx';
import Calendar from './pages/calendar/Calendar.jsx';
import Agenda from './pages/agenda/Agenda.jsx';
import AppointmentResponse from './pages/appointmentResponse/AppointmentResponse.jsx';


function App() {

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            padding: "12px 14px",
            maxWidth: "min(92vw, 420px)",
          },
        }}
      />
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/appointment/respond" element={<AppointmentResponse />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="/admin" element={<Admin />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/agenda' element={<Agenda />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
