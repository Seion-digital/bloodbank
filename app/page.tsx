import Link from 'next/link';
import { 
  Heart, 
  Users, 
  MapPin, 
  Shield, 
  Clock, 
  Award,
  ArrowRight,
  Phone,
  Star
} from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: 'Lives Saved', value: '5,247', icon: Heart },
    { label: 'Active Donors', value: '12,458', icon: Users },
    { label: 'Districts Covered', value: '4', icon: MapPin },
    { label: 'Response Time', value: '< 2 hrs', icon: Clock }
  ];

  const features = [
    {
      icon: Heart,
      title: 'Smart Matching',
      description: 'AI-powered blood type compatibility matching with location-based donor suggestions'
    },
    {
      icon: Shield,
      title: 'Verified Network',
      description: 'All donors and medical staff are verified through Rotary clubs and medical institutions'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Live updates on request status, donor availability, and appointment scheduling'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by Rotary International for transparent, community-based blood donation'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Emergency Medicine, Apollo Hospital',
      content: 'BloodLink has revolutionized how we connect with donors. Response times have improved by 60%.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Rotary Club Bangalore Central',
      content: 'As a regular donor, this platform makes it so easy to help save lives in my community.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'Patient Family Member',
      content: 'When my father needed emergency blood, BloodLink connected us with donors within 30 minutes.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save Lives with <span className="text-yellow-300">BloodLink</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Connecting blood donors with those in need across Rotary Districts 3232, 3230, 3233, and 3234
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Join as Donor</span>
              </Link>
              <Link
                href="/request"
                className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-400 transition-colors duration-200 flex items-center justify-center space-x-2 border-2 border-white border-opacity-50"
              >
                <Users className="h-5 w-5" />
                <span>Request Blood</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for the Rotary community with advanced features for efficient blood donation coordination
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to save lives or get help when you need it
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Request</h3>
              <p className="text-gray-600">
                Submit blood request with patient details, location, and urgency level
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI finds compatible donors nearby and sends instant notifications
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Lives</h3>
              <p className="text-gray-600">
                Donors respond, schedule donation, and help save lives in the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Hear from doctors, donors, and families who have experienced BloodLink
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Emergency Blood Needed?</h2>
          <p className="text-xl text-red-100 mb-8">
            For critical, life-threatening situations, call our 24/7 emergency hotline
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-2xl flex items-center space-x-3">
              <Phone className="h-6 w-6" />
              <span>+91-80-BLOOD-01</span>
            </div>
            <Link
              href="/request/emergency"
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-400 transition-colors duration-200 flex items-center space-x-2 border-2 border-white border-opacity-50"
            >
              <span>Submit Emergency Request</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Rotarians and community members who are already saving lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Register Now</span>
            </Link>
            <Link
              href="/search"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center space-x-2 border-2 border-white border-opacity-50"
            >
              <Heart className="h-5 w-5" />
              <span>Find Donors</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
