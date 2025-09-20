import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BloodRequest, Donation, Message, Achievement, User } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  bloodRequests: BloodRequest[];
  donations: Donation[];
  messages: Message[];
  achievements: Achievement[];
  districts: any[]; // Consider creating a District type
  users: User[];
  addBloodRequest: (request: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at' | 'requester_id'>) => Promise<void>;
  updateBloodRequest: (id: string, updates: Partial<BloodRequest>) => Promise<void>;
  addDonation: (donation: Omit<Donation, 'id' | 'created_at' | 'updated_at' | 'donor_id'>) => Promise<void>;
  updateDonation: (id: string, updates: Partial<Donation>) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'sender_id'>) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  getMatchingDonors: (request: BloodRequest) => User[];
  getRequestsForDonor: (userId: string, bloodType: string) => BloodRequest[];
  loading: boolean;
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
  const { user } = useAuth();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          requestsRes,
          donationsRes,
          messagesRes,
          achievementsRes,
          districtsRes,
          usersRes
        ] = await Promise.all([
          supabase.from('blood_requests').select('*'),
          supabase.from('donations').select('*'),
          supabase.from('messages').select('*'),
          supabase.from('achievements').select('*'),
          supabase.from('districts').select('*'),
          supabase.from('users').select('*'),
        ]);

        if (requestsRes.error) throw requestsRes.error;
        if (donationsRes.error) throw donationsRes.error;
        if (messagesRes.error) throw messagesRes.error;
        if (achievementsRes.error) throw achievementsRes.error;
        if (districtsRes.error) throw districtsRes.error;
        if (usersRes.error) throw usersRes.error;

        setBloodRequests(requestsRes.data as BloodRequest[]);
        setDonations(donationsRes.data as Donation[]);
        setMessages(messagesRes.data as Message[]);
        setAchievements(achievementsRes.data as Achievement[]);
        setDistricts(districtsRes.data);
        setUsers(usersRes.data as User[]);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at' | 'requester_id'>) => {
    if (!user) throw new Error("User must be logged in to create a request.");
    const { data, error } = await supabase
      .from('blood_requests')
      .insert([{ ...requestData, requester_id: user.id }])
      .select();

    if (error) throw error;
    if (data) setBloodRequests(prev => [...prev, data[0] as BloodRequest]);
  };

  const updateBloodRequest = async (id: string, updates: Partial<BloodRequest>) => {
    const { data, error } = await supabase
      .from('blood_requests')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data) {
      setBloodRequests(prev => prev.map(req => req.id === id ? data[0] as BloodRequest : req));
    }
  };

  const addDonation = async (donationData: Omit<Donation, 'id' | 'created_at' | 'updated_at' | 'donor_id'>) => {
    if (!user) throw new Error("User must be logged in to make a donation.");
    const { data, error } = await supabase
      .from('donations')
      .insert([{ ...donationData, donor_id: user.id }])
      .select();

    if (error) throw error;
    if (data) setDonations(prev => [...prev, data[0] as Donation]);
  };

  const updateDonation = async (id: string, updates: Partial<Donation>) => {
    const { data, error } = await supabase
      .from('donations')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data) {
      setDonations(prev => prev.map(d => d.id === id ? data[0] as Donation : d));
    }
  };

  const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp' | 'sender_id'>) => {
    if (!user) throw new Error("User must be logged in to send a message.");
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...messageData, sender_id: user.id }])
      .select();

    if (error) throw error;
    if (data) setMessages(prev => [...prev, data[0] as Message]);
  };

  const markMessageAsRead = async (messageId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select();

    if (error) throw error;
    if (data) {
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, is_read: true } : msg));
    }
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

  const getMatchingDonors = (request: BloodRequest): User[] => {
    const compatibleTypes = getCompatibleBloodTypes(request.patient_blood_type);
    return users.filter(u => compatibleTypes.includes(u.blood_type));
  };

  const getRequestsForDonor = (userId: string, bloodType: string): BloodRequest[] => {
    return bloodRequests.filter(request => {
      const compatibleTypes = getCompatibleBloodTypes(request.patient_blood_type);
      return compatibleTypes.includes(bloodType) && request.status === 'active';
    });
  };

  return (
    <AppContext.Provider value={{
      bloodRequests,
      donations,
      messages,
      achievements,
      districts,
      users,
      addBloodRequest,
      updateBloodRequest,
      addDonation,
      updateDonation,
      sendMessage,
      markMessageAsRead,
      getMatchingDonors,
      getRequestsForDonor,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};