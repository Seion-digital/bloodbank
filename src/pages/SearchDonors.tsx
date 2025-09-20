import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
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
  User as UserIcon
} from 'lucide-react';
import { BloodType, User } from '../types';

export const SearchDonors: React.FC = () => {
  const { getMatchingDonors } = useApp();
  const navigate = useNavigate();
  
  const [searchFilters, setSearchFilters] = useState({
    bloodType: '' as BloodType | '',
    location: '',
    maxDistance: '50',
    availability: 'available',
    sortBy: 'distance'
  });

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const dummyRequest = {
        patientBloodType: searchFilters.bloodType || 'A+',
    } as any;

    const donors = await getMatchingDonors(dummyRequest);

    setSearchResults(donors);
    setIsLoading(false);
  };

  const handleSendMessage = (donorId: string) => {
    navigate(`/messages?recipient=${donorId}`);
  };

  const getDonationEligibility = (lastDonation: string | null) => {
    if (!lastDonation) {
        return { eligible: true, message: 'Eligible to donate', color: 'text-green-600' };
    }
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
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search className="h-4 w-4" />}
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
          {/* ... Sort by dropdown ... */}
        </div>

        {isLoading ? (
          <div className="text-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchResults.map((donor) => {
              const eligibility = getDonationEligibility(donor.lastDonationDate);

              return (
                <div key={donor.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {donor.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{donor.fullName}</h3>
                          <p className="text-sm text-gray-600">{donor.clubName}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {donor.bloodType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center space-x-2"><Heart className="h-4 w-4 text-red-500" /><span className="text-sm font-medium text-gray-900">{donor.totalDonations} Donations</span></div>
                        <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{donor.city}</span></div>
                        <div className="flex items-center space-x-2"><Award className="h-4 w-4 text-gray-400" /><span className={`text-sm font-medium ${eligibility.color}`}>{eligibility.message}</span></div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => alert(`Contacting ${donor.fullName} at ${donor.phone}`)}
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
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donors Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters to find more donors.
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
    </div>
  );
};