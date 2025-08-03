import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  Bell, 
  Search, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  MessageCircle,
  MapPin
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">BloodLink</h1>
                <p className="text-xs text-gray-500">Rotary Districts Platform</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          {user && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests, donors, hospitals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Emergency Request Button */}
                <Link
                  to="/request/emergency"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Emergency Request</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="bg-red-100 p-1 rounded-full">
                              <Heart className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">New urgent request nearby</p>
                              <p className="text-xs text-gray-500">O+ blood needed at Apollo Hospital</p>
                              <p className="text-xs text-gray-400">2 minutes ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-100 p-1 rounded-full">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Message from donor</p>
                              <p className="text-xs text-gray-500">John Smith wants to help with your request</p>
                              <p className="text-xs text-gray-400">5 minutes ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-1 rounded-full">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Donation completed</p>
                              <p className="text-xs text-gray-500">Your donation at Fortis Hospital was confirmed</p>
                              <p className="text-xs text-gray-400">1 hour ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link to="/notifications" className="text-sm text-red-600 hover:text-red-700">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline font-medium">{user.fullName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-red-600 capitalize">{user.userType}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};