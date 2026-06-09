import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth doit être utilisé dans un AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'auth admin au chargement
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = async (password: string): Promise<boolean> => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('VITE_ADMIN_PASSWORD non configuré');
      return false;
    }

    if (password === adminPassword) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};