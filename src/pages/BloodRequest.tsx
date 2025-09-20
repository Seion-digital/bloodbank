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
  Clock,
  Building,
  FileText
} from 'lucide-react';
import { BloodType, UrgencyLevel } from '../types';

export const BloodRequest: React.FC = () => {
  const { user } = useAuth();
  const { addBloodRequest } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientBloodType: 'O+' as BloodType,
    medicalCondition: '',
    urgencyLevel: 'regular' as UrgencyLevel,
    unitsRequired: '',
    hospitalName: '',
    hospitalAddress: '',
    hospitalContact: '',
    requiredByDate: '',
    specialRequirements: '',
    contactPerson: '',
    contactNumber: user?.phone || '',
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
      const requestData = {
        requesterId: user?.id || '',
        patientName: formData.patientName,
        patientAge: parseInt(formData.patientAge),
        patientBloodType: formData.patientBloodType,
        medicalCondition: formData.medicalCondition,
        urgencyLevel: formData.urgencyLevel,
        unitsRequired: parseInt(formData.unitsRequired),
        unitsFulfilled: 0,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        hospitalContact: formData.hospitalContact,
        requiredByDate: formData.requiredByDate,
        specialRequirements: formData.specialRequirements,
        status: 'active' as const,
        contactPerson: formData.contactPerson,
        contactNumber: formData.contactNumber,
        districtId: user?.districtId || '3232',
        coordinates: { lat: 12.9716, lng: 77.5946 }
      };

      addBloodRequest(requestData);
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
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
              Patient Name *
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              required
              value={formData.patientName}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter patient's full name"
            />
          </div>

          <div>
            <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
              Patient Age *
            </label>
            <input
              id="patientAge"
              name="patientAge"
              type="number"
              min="1"
              max="120"
              required
              value={formData.patientAge}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Age"
            />
          </div>

          <div>
            <label htmlFor="patientBloodType" className="block text-sm font-medium text-gray-700">
              Blood Type Required *
            </label>
            <select
              id="patientBloodType"
              name="patientBloodType"
              required
              value={formData.patientBloodType}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="unitsRequired" className="block text-sm font-medium text-gray-700">
              Units Required *
            </label>
            <input
              id="unitsRequired"
              name="unitsRequired"
              type="number"
              min="1"
              max="10"
              required
              value={formData.unitsRequired}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Number of units"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="medicalCondition" className="block text-sm font-medium text-gray-700">
              Medical Condition *
            </label>
            <textarea
              id="medicalCondition"
              name="medicalCondition"
              required
              rows={3}
              value={formData.medicalCondition}
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
                    name="urgencyLevel"
                    value={level.value}
                    checked={formData.urgencyLevel === level.value}
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
            <label htmlFor="requiredByDate" className="block text-sm font-medium text-gray-700">
              Required By Date & Time *
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="requiredByDate"
                name="requiredByDate"
                type="datetime-local"
                required
                value={formData.requiredByDate}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700">
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              rows={3}
              value={formData.specialRequirements}
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
            <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
              Hospital Name *
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              required
              value={formData.hospitalName}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Hospital or medical facility name"
            />
          </div>

          <div>
            <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700">
              Hospital Address *
            </label>
            <div className="mt-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="hospitalAddress"
                name="hospitalAddress"
                required
                rows={3}
                value={formData.hospitalAddress}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Complete hospital address with landmarks"
              />
            </div>
          </div>

          <div>
            <label htmlFor="hospitalContact" className="block text-sm font-medium text-gray-700">
              Hospital Contact Number *
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="hospitalContact"
                name="hospitalContact"
                type="tel"
                required
                value={formData.hospitalContact}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Hospital main contact number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                Contact Person *
              </label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                required
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Primary contact person name"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  required
                  value={formData.contactNumber}
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