import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import AuthProvider from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            } />
          <Route path='/habits' element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
            } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}