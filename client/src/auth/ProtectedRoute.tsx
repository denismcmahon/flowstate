import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactElement } from 'react';

export default function ProtectedRoute({ children }: {children: ReactElement }) {
    const { user, loading } = useAuth();
    if(loading) return null; // show a spinner later
    return user ? children : <Navigate to='/login' replace />;
}