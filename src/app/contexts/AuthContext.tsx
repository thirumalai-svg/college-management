import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registerNumber?: string; // For students
  department?: string;
  year?: number; // For students
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Record<string, User> = {
  'thirumalai.c@college.edu': {
    id: 'student-001',
    name: 'Thirumalai.C',
    email: 'thirumalai.c@college.edu',
    role: 'student',
    registerNumber: '711524BCS177',
    department: 'Computer Science',
    year: 3,
    verified: true,
  },
  'student@college.edu': {
    id: 'student-002',
    name: 'Priya Sharma',
    email: 'student@college.edu',
    role: 'student',
    registerNumber: '711524BCS145',
    department: 'Computer Science',
    year: 2,
    verified: true,
  },
  'faculty@college.edu': {
    id: 'faculty-001',
    name: 'Dr. Ramesh Kumar',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'Computer Science',
    verified: true,
  },
  'admin@college.edu': {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Administration',
    verified: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('college_portal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email ends with @college.edu (institutional email verification)
    if (!email.endsWith('@college.edu')) {
      return false;
    }

    // Mock authentication - in real app, this would be OAuth2.0 / Google Sign-In
    const foundUser = mockUsers[email];
    
    if (foundUser && foundUser.role === role && foundUser.verified) {
      setUser(foundUser);
      localStorage.setItem('college_portal_user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('college_portal_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
