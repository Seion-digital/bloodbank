import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Award,
  Clock,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { BloodRequest } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { bloodRequests, donations, getRequestsForDonor } = useApp();

  const compatibleRequests = user ? getRequestsForDonor(user.id, user.bloodType) : [];
  const urgentRequests = bloodRequests.filter(req => req.urgencyLevel === 'critical').slice(0, 3);
  const recentDonations = donations.filter(d => d.donorId === user?.id).slice(0, 3);

  const stats = [
    {
      name: 'Lives Saved',
      value: user?.totalDonations || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+2 this month'
    },
    {
      name: 'Compatible Requests',
      value: compatibleRequests.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '5 new today'
    },
    {
      name: 'District Rank',
      value: '12th',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+3 positions'
    },
    {
      name: 'Response Time',
      value: '24 mins',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '15% faster'
    }
  ];

  const renderUrgentRequests = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Critical Requests</h3>
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="space-y-4">
        {urgentRequests.map((request) => (
          <div key={request.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {request.patientBloodType}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {request.urgencyLevel}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                <p className="text-sm text-gray-600">{request.hospitalName}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {request.unitsRequired - request.unitsFulfilled} units needed
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    2.5 km away
                  </span>
                </div>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Donation completed at Apollo Hospital
            </p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              New message from Sarah Johnson
            </p>
            <p className="text-sm text-gray-500">4 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Heart className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Matched with urgent O+ request
            </p>
            <p className="text-sm text-gray-500">6 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpcomingAppointments = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>
      <div className="space-y-4">
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Blood Donation - Fortis Hospital</h4>
              <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
              <p className="text-sm text-blue-600">For Meera Patel (A+ needed)</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Confirmed
              </span>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Health Checkup - Apollo Hospital</h4>
              <p className="text-sm text-gray-600">Next Friday, 2:00 PM</p>
              <p className="text-sm text-gray-500">Quarterly donor health screening</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Scheduled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="text-red-100 mt-2">
              Thank you for being a life-saver in District {user?.districtId}
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm">Blood Type: {user?.bloodType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-sm">Donations: {user?.totalDonations}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Heart className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {renderUrgentRequests()}
          {renderUpcomingAppointments()}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {renderRecentActivity()}
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors">
                <Heart className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Request Blood</span>
              </button>
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Find Donors</span>
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">View Map</span>
              </button>
              <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Messages</span>
              </button>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievement Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Life Saver (5 donations)</span>
                  <span className="text-sm text-gray-500">{user?.totalDonations || 0}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((user?.totalDonations || 0) / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Hero (10 donations)</span>
                  <span className="text-sm text-gray-500">{user?.totalDonations || 0}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((user?.totalDonations || 0) / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};