export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: BloodType;
  weight: number;
  medicalConditions: string;
  districtId: string;
  clubName: string;
  memberId: string;
  userType: UserType;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  emergencyContact: string;
  preferredHospital: string;
  lastDonationDate: string | null;
  totalDonations: number;
  createdAt: string;
  isActive: boolean;
  profileImage?: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  patientName: string;
  patientAge: number;
  patientBloodType: BloodType;
  medicalCondition: string;
  urgencyLevel: UrgencyLevel;
  unitsRequired: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalAddress: string;
  hospitalContact: string;
  requiredByDate: string;
  specialRequirements: string;
  status: RequestStatus;
  contactPerson: string;
  contactNumber: string;
  districtId: string;
  createdAt: string;
  updatedAt: string;
  coordinates: { lat: number; lng: number };
}

export interface Donation {
  id: string;
  requestId: string;
  donorId: string;
  status: DonationStatus;
  donationDate: string;
  donationCenter: string;
  unitsDonated: number;
  verificationCode: string;
  hospitalConfirmation: boolean;
  medicalStaffId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  districtNumber: string;
  districtName: string;
  governorName: string;
  headquartersLocation: string;
  contactDetails: string;
  activeClubs: number;
  totalMembers: number;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserType = 'rotaractor' | 'rotary' | 'public' | 'medical';
export type UrgencyLevel = 'critical' | 'urgent' | 'regular';
export type RequestStatus = 'active' | 'partial' | 'fulfilled' | 'received';
export type DonationStatus = 'offered' | 'confirmed' | 'completed' | 'cancelled';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  category: 'donations' | 'requests' | 'community';
}