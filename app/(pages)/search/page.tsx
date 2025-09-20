"use client";

import { useState } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { useApp } from '../../../src/context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  Phone, 
  MessageCircle,
  Star,
  Award,
  Clock,
  User
} from 'lucide-react';
import { BloodType } from '../../../src/types';

export default function SearchDonorsPage() {
  const { user } = useAuth();
  const { bloodRequests } = useApp();
  
  const [searchFilters, setSearchFilters] = useState({
    bloodType: '' as BloodType | '',
    location: '',
    maxDistance: '50',
    availability: 'available',
    sortBy: 'distance'
  });

  const [searchResults, setSearchResults] = useState([
    {
      id: '1',
      name: 'John Smith',
      bloodType: 'O+' as BloodType,
      location: 'Koramangala, Bangalore',
      distance: 2.5,
      lastDonation: '2024-01-15',
      totalDonations: 8,
      clubName: 'Bangalore Central Rotary',
      verificationStatus: 'verified',
      rating: 4.9,
      responseTime: '12 mins',
      availability: 'available',
      profileImage: null
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      bloodType: 'A+' as BloodType,
      location: 'Indiranagar, Bangalore',
      distance: 3.8,
      lastDonation: '2023-12-10',
      totalDonations: 5,
      clubName: 'Indiranagar Rotaract',
      verificationStatus: 'verified',
      rating: 4.7,
      responseTime: '25 mins',
      availability: 'available',
      profileImage: null
    },
    {
      id: '3',
      name: 'Dr. Rajesh Kumar',
      bloodType: 'AB+' as BloodType,
      location: 'Whitefield, Bangalore',
      distance: 12.5,
      lastDonation: '2024-02-20',
      totalDonations: 15,
      clubName: 'Whitefield Rotary',
      verificationStatus: 'verified',
      rating: 5.0,
      responseTime: '8 mins',
      availability: 'busy',
      profileImage: null
    }
  ]);

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // In a real app, this would make an API call with the search filters
    console.log('Searching with filters:', searchFilters);
  };

  const handleContactDonor = (donorId: string) => {
    console.log('Contacting donor:', donorId);
  };

  const handleSendMessage = (donorId: string) => {
    console.log('Sending message to donor:', donorId);
  };

  const getDonationEligibility = (lastDonation: string) => {
    const lastDonationDate = new Date(lastDonation);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince >= 90) {
      return { eligible: true, message: 'Eligible to donate', color: 'text-green-600' };
    } else {
      const daysRemaining = 90 - daysSince;
      return { 
        eligible: false, 
        message: `Eligible in ${daysRemaining} days`, 
        color: 'text-orange-600' 
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Find Blood Donors</h1>
            <p className="text-blue-100 mt-2">Connect with verified donors in your area</p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={searchFilters.bloodType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={searchFilters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Max Distance (km)
            </label>
            <select
              id="maxDistance"
              name="maxDistance"
              value={searchFilters.maxDistance}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={searchFilters.availability}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Donors</option>
              <option value="available">Available Now</option>
              <option value="eligible">Eligible to Donate</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({searchResults.length} donors found)
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              name="sortBy"
              value={searchFilters.sortBy}
              onChange={handleFilterChange}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="donations">Total Donations</option>
              <option value="responseTime">Response Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {searchResults.map((donor) => {
            const eligibility = getDonationEligibility(donor.lastDonation);
            
            return (
              <div key={donor.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  {/* Profile Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {donor.name.charAt(0)}
                  </div>

                  {/* Donor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                        <p className="text-sm text-gray-600">{donor.clubName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donor.availability === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donor.availability === 'available' ? 'Available' : 'Busy'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {donor.bloodType}
                        </span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{donor.distance} km</span>
                        </div>
                        <span className="text-xs text-gray-500">Distance</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">{donor.totalDonations}</span>
                        </div>
                        <span className="text-xs text-gray-500">Donations</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{donor.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">Rating</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{donor.responseTime}</span>
                        </div>
                        <span className="text-xs text-gray-500">Response</span>
                      </div>
                    </div>

                    {/* Location and Eligibility */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{donor.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm font-medium ${eligibility.color}`}>
                          {eligibility.message}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleContactDonor(donor.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </button>
                      <button
                        onClick={() => handleSendMessage(donor.id)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Results State */}
      {searchResults.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donors Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search filters to find more donors in your area.
          </p>
          <button
            onClick={() => setSearchFilters({
              bloodType: '',
              location: '',
              maxDistance: '50',
              availability: 'available',
              sortBy: 'distance'
            })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
