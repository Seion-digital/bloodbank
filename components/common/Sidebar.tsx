import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import {
  Heart,
  Search,
  MessageCircle,
  MapPin,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Award,
  FileText,
  AlertTriangle,
  Shield
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: BarChart3,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'Find Blood',
      path: '/search',
      icon: Search,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'Request Blood',
      path: '/request',
      icon: Heart,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'My Requests',
      path: '/my-requests',
      icon: FileText,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'My Donations',
      path: '/my-donations',
      icon: Award,
      roles: ['rotaractor', 'rotary', 'public']
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'Map View',
      path: '/map',
      icon: MapPin,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      roles: ['rotaractor', 'rotary', 'public', 'medical']
    },
    {
      name: 'Emergency',
      path: '/emergency',
      icon: AlertTriangle,
      roles: ['medical']
    },
    {
      name: 'District Members',
      path: '/members',
      icon: Users,
      roles: ['rotaractor', 'rotary']
    },
    {
      name: 'Verification',
      path: '/verification',
      icon: Shield,
      roles: ['medical', 'rotary']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.userType || 'public')
  );

  return (
    <div className="bg-white h-screen sticky top-16 shadow-lg border-r border-gray-200">
      <div className="p-4">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-600">{user?.clubName}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    {user?.bloodType}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                    {user?.userType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-red-600' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Total Donations</span>
              <span className="text-sm font-semibold text-green-600">{user?.totalDonations || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">District</span>
              <span className="text-sm font-semibold text-blue-600">{user?.districtId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Last Donation</span>
              <span className="text-xs text-gray-500">
                {user?.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Emergency Hotline</span>
          </div>
          <p className="text-sm text-red-700 font-mono">+91-80-BLOOD-01</p>
          <p className="text-xs text-red-600 mt-1">24/7 Emergency Support</p>
        </div>
      </div>
    </div>
  );
};