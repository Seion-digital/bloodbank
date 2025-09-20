export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_type: BloodType;
  weight: number;
  medical_conditions: string;
  district_id: string;
  club_name: string;
  member_id: string;
  user_type: UserType;
  verification_status: 'pending' | 'verified' | 'rejected';
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  emergency_contact: string;
  preferred_hospital: string;
  last_donation_date: string | null;
  total_donations: number;
  created_at: string;
  is_active: boolean;
  profile_image?: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  patient_name: string;
  patient_age: number;
  patient_blood_type: BloodType;
  medical_condition: string;
  urgency_level: UrgencyLevel;
  units_required: number;
  units_fulfilled: number;
  hospital_name: string;
  hospital_address: string;
  hospital_contact: string;
  required_by_date: string;
  special_requirements: string;
  status: RequestStatus;
  contact_person: string;
  contact_number: string;
  district_id: string;
  created_at: string;
  updated_at: string;
  coordinates: { lat: number; lng: number };
}

export interface Donation {
  id: string;
  request_id: string;
  donor_id: string;
  status: DonationStatus;
  donation_date: string;
  donation_center: string;
  units_donated: number;
  verification_code: string;
  hospital_confirmation: boolean;
  medical_staff_id?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  district_number: string;
  district_name: string;
  governor_name: string;
  headquarters_location: string;
  contact_details: string;
  active_clubs: number;
  total_members: number;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserType = 'rotaractor' | 'rotary' | 'public' | 'medical' | 'admin';
export type UrgencyLevel = 'critical' | 'urgent' | 'regular';
export type RequestStatus = 'active' | 'partial' | 'fulfilled' | 'received';
export type DonationStatus = 'offered' | 'confirmed' | 'completed' | 'cancelled';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  request_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  category: 'donations' | 'requests' | 'community';
}