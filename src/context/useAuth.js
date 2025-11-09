import { useContext } from 'react';
import { AuthContext } from './authContext.js';

// Hook separado para evitar el error del Fast Refresh
export const useAuth = () => useContext(AuthContext);
