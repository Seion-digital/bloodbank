import React, { createContext, useContext, useState, useEffect } from 'react';
import { BloodRequest, Donation, Message, Achievement } from '../types';

interface AppContextType {
  bloodRequests: BloodRequest[];
  donations: Donation[];
  messages: Message[];
  achievements: Achievement[];
  addBloodRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBloodRequest: (id: string, updates: Partial<BloodRequest>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDonation: (id: string, updates: Partial<Donation>) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getMatchingDonors: (request: BloodRequest) => any[];
  getRequestsForDonor: (userId: string, bloodType: string) => BloodRequest[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'First Drop',
      description: 'Complete your first blood donation',
      icon: '🩸',
      threshold: 1,
      category: 'donations',
    },
    {
      id: '2',
      name: 'Life Saver',
      description: 'Complete 5 blood donations',
      icon: '🏆',
      threshold: 5,
      category: 'donations',
    },
    {
      id: '3',
      name: 'Hero',
      description: 'Complete 10 blood donations',
      icon: '🦸',
      threshold: 10,
      category: 'donations',
    },
  ]);

  useEffect(() => {
    // Initialize with mock data
    const mockRequests: BloodRequest[] = [
      {
        id: '1',
        requesterId: '2',
        patientName: 'Rajesh Kumar',
        patientAge: 45,
        patientBloodType: 'O+',
        medicalCondition: 'Emergency surgery required',
        urgencyLevel: 'critical',
        unitsRequired: 3,
        unitsFulfilled: 1,
        hospitalName: 'Apollo Hospital',
        hospitalAddress: 'Bannerghatta Road, Bangalore',
        hospitalContact: '+91-80-26304050',
        requiredByDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        specialRequirements: 'CMV negative preferred',
        status: 'partial',
        contactPerson: 'Dr. Priya Sharma',
        contactNumber: '+91-9876543210',
        districtId: '3232',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        coordinates: { lat: 12.9051, lng: 77.5960 },
      },
      {
        id: '2',
        requesterId: '3',
        patientName: 'Meera Patel',
        patientAge: 28,
        patientBloodType: 'A+',
        medicalCondition: 'Post-partum complications',
        urgencyLevel: 'urgent',
        unitsRequired: 2,
        unitsFulfilled: 0,
        hospitalName: 'Fortis Hospital',
        hospitalAddress: 'Cunningham Road, Bangalore',
        hospitalContact: '+91-80-66214444',
        requiredByDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        specialRequirements: 'None',
        status: 'active',
        contactPerson: 'Nurse Anjali',
        contactNumber: '+91-9876543211',
        districtId: '3232',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        coordinates: { lat: 12.9698, lng: 77.5986 },
      },
    ];

    setBloodRequests(mockRequests);
  }, []);

  const addBloodRequest = (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: BloodRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBloodRequests(prev => [...prev, newRequest]);
  };

  const updateBloodRequest = (id: string, updates: Partial<BloodRequest>) => {
    setBloodRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, ...updates, updatedAt: new Date().toISOString() }
        : request
    ));
  };

  const addDonation = (donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDonation: Donation = {
      ...donationData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDonations(prev => [...prev, newDonation]);
  };

  const updateDonation = (id: string, updates: Partial<Donation>) => {
    setDonations(prev => prev.map(donation => 
      donation.id === id 
        ? { ...donation, ...updates, updatedAt: new Date().toISOString() }
        : donation
    ));
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, isRead: true } : message
    ));
  };

  const getCompatibleBloodTypes = (patientType: string): string[] => {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    };
    return compatibility[patientType] || [];
  };

  const getMatchingDonors = (request: BloodRequest) => {
    const compatibleTypes = getCompatibleBloodTypes(request.patientBloodType);
    // Mock donor data - in real app, this would query the database
    return [
      {
        id: '1',
        name: 'John Smith',
        bloodType: 'O+',
        distance: 2.5,
        lastDonation: '2024-01-15',
        totalDonations: 5,
        clubName: 'Bangalore Central',
        verificationStatus: 'verified',
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        bloodType: 'O-',
        distance: 3.8,
        lastDonation: '2023-12-10',
        totalDonations: 3,
        clubName: 'Koramangala Rotary',
        verificationStatus: 'verified',
      },
    ].filter(donor => compatibleTypes.includes(donor.bloodType));
  };

  const getRequestsForDonor = (userId: string, bloodType: string) => {
    return bloodRequests.filter(request => {
      const compatibleTypes = getCompatibleBloodTypes(request.patientBloodType);
      return compatibleTypes.includes(bloodType) && request.status === 'active';
    });
  };

  return (
    <AppContext.Provider value={{
      bloodRequests,
      donations,
      messages,
      achievements,
      addBloodRequest,
      updateBloodRequest,
      addDonation,
      updateDonation,
      sendMessage,
      markMessageAsRead,
      getMatchingDonors,
      getRequestsForDonor,
    }}>
      {children}
    </AppContext.Provider>
  );
};