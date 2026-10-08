import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  officerId: string;
  role: UserRole;
  roleLabel: string;
  name: string;
  badgeNumber: string;
  authenticatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (
    officerId: string,
    password: string,
    role: UserRole,
    remember: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_INFO: Record<UserRole, { label: string; name: string; badge: string }> = {
  LEA: {
    label: 'LEA Cyber Cell Officer',
    name: 'Insp. V. K. Sharma',
    badge: 'MH-CY-1049',
  },
  BANK: {
    label: 'Bank & FI Nodal Officer',
    name: 'Rajeshwar Rao (Fraud Desk)',
    badge: 'FRM-NODAL-04',
  },
  I4C: {
    label: 'I4C National Coordinator',
    name: 'Amitabh Sen (MHA)',
    badge: 'MHA-I4C-982',
  },
  ADMIN: {
    label: 'Data Science Administrator',
    name: 'Dr. Shalini Deshmukh',
    badge: 'AI-MLOPS-01',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cyberpehra_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const isAuth = localStorage.getItem('cyberpehra_authenticated') === 'true';
      if (!isAuth) return null;

      const storedRole = (localStorage.getItem('cyberpehra_role') as UserRole) || 'LEA';
      const storedId = localStorage.getItem('cyberpehra_officer_id') || 'demo@cyberpehra.gov.in';
      const info = ROLE_INFO[storedRole] || ROLE_INFO.LEA;

      return {
        officerId: storedId,
        role: storedRole,
        roleLabel: info.label,
        name: info.name,
        badgeNumber: info.badge,
        authenticatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  });

  const login = async (
    officerId: string,
    password: string,
    role: UserRole,
    remember: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay to simulate secure authentication handshake
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanId = officerId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepted demo credentials
    const validEmails = ['demo@cyberpehra.gov.in', 'officer@cyberpehra.gov.in', 'admin@cyberpehra.gov.in'];
    const isValidId = validEmails.includes(cleanId);
    const isValidPass = cleanPass === 'CyberPehra@123';

    if (!isValidId || !isValidPass) {
      return {
        success: false,
        error: 'Invalid Officer ID or password.',
      };
    }

    const info = ROLE_INFO[role] || ROLE_INFO.LEA;
    const authUser: AuthUser = {
      officerId: cleanId,
      role,
      roleLabel: info.label,
      name: info.name,
      badgeNumber: info.badge,
      authenticatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('cyberpehra_authenticated', 'true');
      localStorage.setItem('cyberpehra_role', role);
      localStorage.setItem('cyberpehra_officer_id', cleanId);
      // Keep existing context persona in sync
      localStorage.setItem('CYBER_PEHRA_V1_role', JSON.stringify(role));

      if (remember) {
        localStorage.setItem('cyberpehra_remember', 'true');
        localStorage.setItem('cyberpehra_saved_id', cleanId);
      } else {
        localStorage.removeItem('cyberpehra_remember');
        localStorage.removeItem('cyberpehra_saved_id');
      }
    } catch (e) {
      console.warn('LocalStorage error during authentication:', e);
    }

    setIsAuthenticated(true);
    setUser(authUser);

    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem('cyberpehra_authenticated');
      localStorage.removeItem('cyberpehra_role');
      localStorage.removeItem('cyberpehra_officer_id');
      localStorage.removeItem('CYBER_PEHRA_AUTH_TOKEN');
    } catch (e) {
      console.warn('LocalStorage error during logout:', e);
    }

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
