import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, MapPin, Building } from 'lucide-react';
import { BloodType, UserType } from '../../types';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    blood_type: 'O+' as BloodType,
    weight: '',
    medical_conditions: '',
    user_type: 'public' as UserType,
    club_name: '',
    member_id: '',
    district_id: '3232',
    address: '',
    city: '',
    state: '',
    emergency_contact: '',
    preferred_hospital: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const districts = [
    { id: '3232', name: 'District 3232 - Karnataka & Goa' },
    { id: '3230', name: 'District 3230 - Tamil Nadu & Puducherry' },
    { id: '3233', name: 'District 3233 - Kerala' },
    { id: '3234', name: 'District 3234 - Andhra Pradesh & Telangana' }
  ];

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.full_name || !formData.date_of_birth || !formData.blood_type) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.user_type !== 'public' && !formData.club_name) {
      setError('Club name is required for Rotary members');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // a partial user from the form data
      const userData: Partial<User> & { password?: string } = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        blood_type: formData.blood_type,
        weight: parseInt(formData.weight) || 0,
        medical_conditions: formData.medical_conditions,
        user_type: formData.user_type,
        club_name: formData.club_name,
        member_id: formData.member_id,
        district_id: formData.district_id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        emergency_contact: formData.emergency_contact,
        preferred_hospital: formData.preferred_hospital,
      };

      const success = await register(userData);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">
                Blood Type *
              </label>
              <select
                id="blood_type"
                name="blood_type"
                required
                value={formData.blood_type}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="45"
                max="200"
                value={formData.weight}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter weight"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
              User Type *
            </label>
            <select
              id="user_type"
              name="user_type"
              required
              value={formData.user_type}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="public">General Public</option>
              <option value="rotaractor">Rotaractor</option>
              <option value="rotary">Rotary Club Member</option>
              <option value="medical">Medical Professional</option>
            </select>
          </div>

          {(formData.user_type === 'rotaractor' || formData.user_type === 'rotary') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="club_name" className="block text-sm font-medium text-gray-700">
                  Club Name *
                </label>
                <div className="mt-1 relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="club_name"
                    name="club_name"
                    type="text"
                    required
                    value={formData.club_name}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter club name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="member_id" className="block text-sm font-medium text-gray-700">
                  Member ID
                </label>
                <input
                  id="member_id"
                  name="member_id"
                  type="text"
                  value={formData.member_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Member ID"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="district_id" className="block text-sm font-medium text-gray-700">
              Rotary District *
            </label>
            <select
              id="district_id"
              name="district_id"
              required
              value={formData.district_id}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Emergency Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="City"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
              Emergency Contact
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="emergency_contact"
                name="emergency_contact"
                type="tel"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="preferred_hospital" className="block text-sm font-medium text-gray-700">
              Preferred Hospital
            </label>
            <input
              id="preferred_hospital"
              name="preferred_hospital"
              type="text"
              value={formData.preferred_hospital}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Preferred hospital name"
            />
          </div>

          <div>
            <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700">
              Medical Conditions (if any)
            </label>
            <textarea
              id="medical_conditions"
              name="medical_conditions"
              rows={3}
              value={formData.medical_conditions}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Any medical conditions, allergies, or medications"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Join the BloodLink Community
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register to start saving lives in your community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};