import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth
    const storedUser = localStorage.getItem('bloodDonationUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let mockUser: User;

    if (email === 'admin' && password === 'admin@123') {
      mockUser = {
        id: 'admin-001',
        email: 'admin',
        phone: '+1111111111',
        fullName: 'Administrator',
        dateOfBirth: '1980-01-01',
        gender: 'other',
        bloodType: 'O+',
        weight: 80,
        medicalConditions: 'None',
        districtId: 'N/A',
        clubName: 'Admin',
        memberId: 'ADMIN001',
        userType: 'admin',
        verificationStatus: 'verified',
        address: '1 Admin Way',
        city: 'Adminville',
        state: 'State of Admin',
        coordinates: { lat: 0, lng: 0 },
        emergencyContact: '+1111111111',
        preferredHospital: 'Admin General',
        lastDonationDate: null,
        totalDonations: 100,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
    } else {
      mockUser = {
        id: '1',
        email,
        phone: '+1234567890',
        fullName: 'Demo User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        bloodType: 'O+',
        weight: 70,
        medicalConditions: 'None',
        districtId: '3232',
        clubName: 'Bangalore Central',
        memberId: 'RC001',
        userType: 'public',
        verificationStatus: 'verified',
        address: '123 Main St',
        city: 'Bangalore',
        state: 'Karnataka',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        emergencyContact: '+1234567891',
        preferredHospital: 'Apollo Hospital',
        lastDonationDate: '2024-01-15',
        totalDonations: 5,
        createdAt: '2024-01-01',
        isActive: true,
      };
    }

    setUser(mockUser);
    localStorage.setItem('bloodDonationUser', JSON.stringify(mockUser));
    setIsLoading(false);
    return mockUser;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email || '',
      phone: userData.phone || '',
      fullName: userData.fullName || '',
      dateOfBirth: userData.dateOfBirth || '',
      gender: userData.gender || 'male',
      bloodType: userData.bloodType || 'O+',
      weight: userData.weight || 60,
      medicalConditions: userData.medicalConditions || 'None',
      districtId: userData.districtId || '3232',
      clubName: userData.clubName || '',
      memberId: userData.memberId || '',
      userType: userData.userType || 'public',
      verificationStatus: 'pending',
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      emergencyContact: userData.emergencyContact || '',
      preferredHospital: userData.preferredHospital || '',
      lastDonationDate: null,
      totalDonations: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setUser(newUser);
    localStorage.setItem('bloodDonationUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodDonationUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('bloodDonationUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};