import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import AITools from './pages/AITools';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useAuth } from './context/AuthContext';



function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={ <Register />} />
        <Route path="/dashboard" element={ <Dashboard  />} />
        <Route path="/add-job" element={token ? <AddJob /> : <Navigate to="/login" />} />
        <Route path="/edit-job/:id" element={token ? <EditJob /> : <Navigate to="/login" />} />
        <Route path="/ai-tools" element={token ? <AITools /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;