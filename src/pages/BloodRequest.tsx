import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Building,
} from 'lucide-react';
import { BloodType, UrgencyLevel } from '../types';

export const BloodRequest: React.FC = () => {
  const { user } = useAuth();
  const { addBloodRequest } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_blood_type: 'O+' as BloodType,
    medical_condition: '',
    urgency_level: 'regular' as UrgencyLevel,
    units_required: '',
    hospital_name: '',
    hospital_address: '',
    hospital_contact: '',
    required_by_date: '',
    special_requirements: '',
    contact_person: '',
    contact_number: user?.phone || '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Life-threatening)', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', color: 'text-orange-600' },
    { value: 'regular', label: 'Regular (Within 7 days)', color: 'text-green-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if(!user) throw new Error("User not authenticated");

      const requestData = {
        patient_name: formData.patient_name,
        patient_age: parseInt(formData.patient_age),
        patient_blood_type: formData.patient_blood_type,
        medical_condition: formData.medical_condition,
        urgency_level: formData.urgency_level,
        units_required: parseInt(formData.units_required),
        units_fulfilled: 0,
        hospital_name: formData.hospital_name,
        hospital_address: formData.hospital_address,
        hospital_contact: formData.hospital_contact,
        required_by_date: new Date(formData.required_by_date).toISOString(),
        special_requirements: formData.special_requirements,
        status: 'active' as const,
        contact_person: formData.contact_person,
        contact_number: formData.contact_number,
        district_id: user.district_id || '3232',
        coordinates: { lat: 12.9716, lng: 77.5946 }
      };

      await addBloodRequest(requestData);
      navigate('/my-requests');
    } catch (error) {
      console.error('Error creating blood request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-600" />
          Patient Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">
              Patient Name *
            </label>
            <input
              id="patient_name"
              name="patient_name"
              type="text"
              required
              value={formData.patient_name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter patient's full name"
            />
          </div>

          <div>
            <label htmlFor="patient_age" className="block text-sm font-medium text-gray-700">
              Patient Age *
            </label>
            <input
              id="patient_age"
              name="patient_age"
              type="number"
              min="1"
              max="120"
              required
              value={formData.patient_age}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Age"
            />
          </div>

          <div>
            <label htmlFor="patient_blood_type" className="block text-sm font-medium text-gray-700">
              Blood Type Required *
            </label>
            <select
              id="patient_blood_type"
              name="patient_blood_type"
              required
              value={formData.patient_blood_type}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="units_required" className="block text-sm font-medium text-gray-700">
              Units Required *
            </label>
            <input
              id="units_required"
              name="units_required"
              type="number"
              min="1"
              max="10"
              required
              value={formData.units_required}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Number of units"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="medical_condition" className="block text-sm font-medium text-gray-700">
              Medical Condition *
            </label>
            <textarea
              id="medical_condition"
              name="medical_condition"
              required
              rows={3}
              value={formData.medical_condition}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describe the medical condition requiring blood transfusion"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderUrgencyInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Urgency & Timeline
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Urgency Level *
            </label>
            <div className="space-y-3">
              {urgencyLevels.map((level) => (
                <label key={level.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency_level"
                    value={level.value}
                    checked={formData.urgency_level === level.value}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <div className={`font-medium ${level.color}`}>
                      {level.label}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="required_by_date" className="block text-sm font-medium text-gray-700">
              Required By Date & Time *
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="required_by_date"
                name="required_by_date"
                type="datetime-local"
                required
                value={formData.required_by_date}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700">
              Special Requirements
            </label>
            <textarea
              id="special_requirements"
              name="special_requirements"
              rows={3}
              value={formData.special_requirements}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Any special requirements (CMV negative, HLA matched, etc.)"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHospitalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-blue-600" />
          Hospital & Contact Information
        </h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="hospital_name" className="block text-sm font-medium text-gray-700">
              Hospital Name *
            </label>
            <input
              id="hospital_name"
              name="hospital_name"
              type="text"
              required
              value={formData.hospital_name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Hospital or medical facility name"
            />
          </div>

          <div>
            <label htmlFor="hospital_address" className="block text-sm font-medium text-gray-700">
              Hospital Address *
            </label>
            <div className="mt-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="hospital_address"
                name="hospital_address"
                required
                rows={3}
                value={formData.hospital_address}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Complete hospital address with landmarks"
              />
            </div>
          </div>

          <div>
            <label htmlFor="hospital_contact" className="block text-sm font-medium text-gray-700">
              Hospital Contact Number *
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="hospital_contact"
                name="hospital_contact"
                type="tel"
                required
                value={formData.hospital_contact}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Hospital main contact number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                Contact Person *
              </label>
              <input
                id="contact_person"
                name="contact_person"
                type="text"
                required
                value={formData.contact_person}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Primary contact person name"
              />
            </div>

            <div>
              <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  required
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Your contact number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Heart className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Request Blood</h1>
            <p className="text-red-100 mt-2">Connect with donors to save a life</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[
          { step: 1, label: 'Patient Info' },
          { step: 2, label: 'Urgency' },
          { step: 3, label: 'Hospital Details' }
        ].map(({ step, label }) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            <span className={`ml-2 text-sm ${step <= currentStep ? 'text-red-600' : 'text-gray-500'}`}>
              {label}
            </span>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-4 ${
                  step < currentStep ? 'bg-red-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && renderPatientInfo()}
          {currentStep === 2 && renderUrgencyInfo()}
          {currentStep === 3 && renderHospitalInfo()}

          {/* Navigation Buttons */}
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
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="ml-auto px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Request...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Emergency Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-red-800">Emergency Situations</h3>
            <p className="text-red-700 mt-2">
              For critical, life-threatening emergencies, please also contact our 24/7 emergency hotline 
              at <span className="font-mono font-bold">+91-80-BLOOD-01</span> immediately after submitting this request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};