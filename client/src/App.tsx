import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthProvider from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Header from './components/Header';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}