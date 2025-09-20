import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Plus, 
  Edit3, 
  Eye, 
  MapPin, 
  Clock, 
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Phone
} from 'lucide-react';
import { BloodRequest } from '../types';

export const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const { bloodRequests, updateBloodRequest } = useApp();
  
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  const userRequests = bloodRequests.filter(request => request.requesterId === user?.id);
  
  const filteredRequests = userRequests.filter(request => {
    switch (activeTab) {
      case 'active':
        return request.status === 'active' || request.status === 'partial';
      case 'completed':
        return request.status === 'fulfilled' || request.status === 'received';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'received':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'urgent':
        return 'text-orange-600 bg-orange-50';
      case 'regular':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: 'received') => {
    updateBloodRequest(requestId, { status: newStatus });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (requiredByDate: string) => {
    const now = new Date();
    const required = new Date(requiredByDate);
    const diffInHours = (required.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (diffInHours < 24) {
      return { text: `${Math.floor(diffInHours)}h remaining`, color: 'text-orange-600' };
    } else {
      const days = Math.floor(diffInHours / 24);
      return { text: `${days}d remaining`, color: 'text-green-600' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Blood Requests</h1>
              <p className="text-red-100 mt-2">Manage and track your blood requests</p>
            </div>
          </div>
          <Link
            to="/request"
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{userRequests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {userRequests.filter(r => r.status === 'active' || r.status === 'partial').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Units Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {userRequests.reduce((sum, req) => sum + req.unitsFulfilled, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'active', label: 'Active Requests', count: userRequests.filter(r => r.status === 'active' || r.status === 'partial').length },
              { key: 'completed', label: 'Completed', count: userRequests.filter(r => r.status === 'fulfilled' || r.status === 'received').length },
              { key: 'all', label: 'All Requests', count: userRequests.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Requests List */}
        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active' 
                  ? "You don't have any active blood requests."
                  : `No ${activeTab} requests to display.`}
              </p>
              <Link
                to="/request"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Create New Request
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => {
                const timeRemaining = getTimeRemaining(request.requiredByDate);
                
                return (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.patientName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                            {request.urgencyLevel}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {request.patientBloodType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-gray-600">
                              {request.unitsFulfilled}/{request.unitsRequired} units
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{request.hospitalName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className={`h-4 w-4 ${timeRemaining.color}`} />
                            <span className={`text-sm ${timeRemaining.color}`}>
                              {timeRemaining.text}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Required by: {formatDate(request.requiredByDate)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{request.contactNumber}</span>
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {request.medicalCondition}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {(request.status === 'active' || request.status === 'partial') && (
                          <Link
                            to={`/request/${request.id}`}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Request"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        )}

                        {request.status === 'fulfilled' && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'received')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Mark as Received
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((request.unitsFulfilled / request.unitsRequired) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(request.unitsFulfilled / request.unitsRequired) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedRequest.patientName}</p>
                    <p><span className="text-gray-500">Age:</span> {selectedRequest.patientAge} years</p>
                    <p><span className="text-gray-500">Blood Type:</span> {selectedRequest.patientBloodType}</p>
                    <p><span className="text-gray-500">Units Required:</span> {selectedRequest.unitsRequired}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Urgency:</span> {selectedRequest.urgencyLevel}</p>
                    <p><span className="text-gray-500">Status:</span> {selectedRequest.status}</p>
                    <p><span className="text-gray-500">Required By:</span> {formatDate(selectedRequest.requiredByDate)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Medical Condition</h3>
                <p className="text-sm text-gray-600">{selectedRequest.medicalCondition}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hospital Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Hospital:</span> {selectedRequest.hospitalName}</p>
                  <p><span className="text-gray-500">Address:</span> {selectedRequest.hospitalAddress}</p>
                  <p><span className="text-gray-500">Contact:</span> {selectedRequest.hospitalContact}</p>
                </div>
              </div>
              
              {selectedRequest.specialRequirements && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Special Requirements</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.specialRequirements}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};