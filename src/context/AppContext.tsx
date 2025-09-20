import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';
import { BloodRequest, Donation, Message, Achievement, User } from '../types';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter';

interface AppContextType {
  bloodRequests: BloodRequest[];
  donations: Donation[];
  messages: Message[];
  achievements: Achievement[];
  addBloodRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'requesterId'>) => Promise<void>;
  updateBloodRequest: (id: string, updates: Partial<BloodRequest>) => Promise<void>;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt' | 'donorId'>) => Promise<void>;
  updateDonation: (id: string, updates: Partial<Donation>) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'senderId'>) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  getMatchingDonors: (request: BloodRequest) => Promise<User[]>;
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
  const { user } = useAuth();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      fetchInitialData();
      const subscriptions = [
        subscribeToTable('blood_requests', (payload) => setBloodRequests(current => [...current, toCamelCase(payload.new) as BloodRequest])),
        subscribeToTable('donations', (payload) => setDonations(current => [...current, toCamelCase(payload.new) as Donation])),
        subscribeToMessages(),
      ];
      return () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      };
    }
  }, [user]);

  const fetchInitialData = async () => {
    const [requestsRes, donationsRes, messagesRes, achievementsRes] = await Promise.all([
      supabase.from('blood_requests').select('*'),
      supabase.from('donations').select('*'),
      supabase.from('messages').select('*').or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`),
      supabase.from('achievements').select('*'),
    ]);

    if (requestsRes.error) console.error('Error fetching blood requests', requestsRes.error);
    else setBloodRequests(toCamelCase(requestsRes.data) as BloodRequest[]);

    if (donationsRes.error) console.error('Error fetching donations', donationsRes.error);
    else setDonations(toCamelCase(donationsRes.data) as Donation[]);

    if (messagesRes.error) console.error('Error fetching messages', messagesRes.error);
    else setMessages(toCamelCase(messagesRes.data) as Message[]);

    if (achievementsRes.error) console.error('Error fetching achievements', achievementsRes.error);
    else setAchievements(toCamelCase(achievementsRes.data) as Achievement[]);
  };

  const subscribeToTable = (table: string, onInsert: (payload: any) => void) => {
    return supabase.channel(`public:${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, onInsert)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, () => fetchInitialData())
      .subscribe();
  };

  const subscribeToMessages = () => {
    return supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if(payload.new.receiver_id === user?.id || payload.new.sender_id === user?.id) {
          setMessages(current => [...current, toCamelCase(payload.new) as Message]);
        }
      })
      .subscribe();
  };

  const addBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'requesterId'>) => {
    if (!user) throw new Error("User not authenticated");
    const snakeCaseData = toSnakeCase({ ...requestData, requesterId: user.id });
    const { error } = await supabase.from('blood_requests').insert(snakeCaseData);
    if (error) console.error('Error adding blood request:', error);
  };

  const updateBloodRequest = async (id: string, updates: Partial<BloodRequest>) => {
    const { error } = await supabase.from('blood_requests').update(toSnakeCase(updates)).eq('id', id);
    if (error) console.error('Error updating blood request:', error);
  };

  const addDonation = async (donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt' | 'donorId'>) => {
    if (!user) throw new Error("User not authenticated");
    const snakeCaseData = toSnakeCase({ ...donationData, donorId: user.id });
    const { error } = await supabase.from('donations').insert(snakeCaseData);
    if (error) console.error('Error adding donation:', error);
  };

  const updateDonation = async (id: string, updates: Partial<Donation>) => {
    const { error } = await supabase.from('donations').update(toSnakeCase(updates)).eq('id', id);
    if (error) console.error('Error updating donation:', error);
  };

  const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp' | 'senderId'>) => {
    if (!user) throw new Error("User not authenticated");
    const snakeCaseData = toSnakeCase({ ...messageData, senderId: user.id });
    const { error } = await supabase.from('messages').insert(snakeCaseData);
    if (error) console.error('Error sending message:', error);
  };

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', messageId);
    if (error) console.error('Error marking message as read:', error);
  };

  const getCompatibleBloodTypes = (patientType: string): string[] => {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'], 'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'], 'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'], 'O+': ['O+', 'O-'], 'O-': ['O-'],
    };
    return compatibility[patientType] || [];
  };

  const getMatchingDonors = async (request: BloodRequest): Promise<User[]> => {
    const compatibleTypes = getCompatibleBloodTypes(request.patientBloodType);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data, error } = await supabase.from('users')
      .select('*')
      .in('blood_type', compatibleTypes)
      .or(`last_donation_date.is.null,last_donation_date.lte.${threeMonthsAgo.toISOString()}`)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching matching donors:', error);
      return [];
    }
    return toCamelCase(data) as User[];
  };

  const getRequestsForDonor = (userId: string, bloodType: string): BloodRequest[] => {
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