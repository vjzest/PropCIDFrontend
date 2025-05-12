import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock broker categories
const BROKER_CATEGORIES = [
  { id: 1, name: 'Luxury', icon: '💎' },
  { id: 2, name: 'Residential', icon: '🏘️' },
  { id: 3, name: 'Commercial', icon: '🏬' },
  { id: 4, name: 'International', icon: '🌎' },
  { id: 5, name: 'Investment', icon: '📈' },
];
const BASE_URL='https://propb1.onrender.com';

interface Broker {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  userType: string;
  profileImage?: string; // Optional image field
  createdAt: { _seconds: number, _nanoseconds: number }; // timestamp
  category?: string;
  experience?: string;
  location?: string;
  phone?: string;
  website?: string;
  about?: string;
  propertiesSold?: string;
  activeListings?: string;
  totalSales?: string;
  specialties?: string[];
  certifications?: string[];
  languages?: string[];
  averagePrice?: string;
  rating?: string;
}

const BrokerCard = ({ broker }: { broker: Broker }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Store broker contact data in localStorage for the contact page
    localStorage.setItem('contactData', JSON.stringify({
      type: 'broker',
      id: broker.id,
      name: broker.name,
      email: broker.email,
    }));
    navigate('/contact');
  };

  const handleViewProfile = () => {
    // Store broker profile data in localStorage for the profile page
    localStorage.setItem('profileData', JSON.stringify({
      type: 'broker',
      id: broker.id,
      name: broker.name,
      email: broker.email,
      licenseNumber: broker.licenseNumber,
      createdAt: broker.createdAt,
      profileImage: broker.profileImage,
      category: broker.category || 'Broker',
      experience: broker.experience || 'Not specified',
      location: broker.location || 'Not specified',
      phone: broker.phone || 'Not specified',
      website: broker.website || 'Not specified',
      about: broker.about || 'No description available',
      propertiesSold: broker.propertiesSold || '0',
      activeListings: broker.activeListings || '0',
      totalSales: broker.totalSales || '0',
      specialties: broker.specialties || [],
      certifications: broker.certifications || [],
      languages: broker.languages || [],
      averagePrice: broker.averagePrice || 'Not specified',
      rating: broker.rating || '0'
    }));
    navigate(`/brokers/${broker.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
            {broker.profileImage ? (
              <img 
                src={broker.profileImage} 
                alt={broker.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show the first letter
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                      ${broker.name.charAt(0).toUpperCase()}
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                {broker.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">{broker.name}</h3>
            <span className="text-xs py-0.5 px-2 bg-neutral-100 rounded-full">
              {broker.category || 'Broker'}
            </span>
          </div>
        </div>
        
        {isAuthenticated ? (
          <div className="flex justify-between text-sm mt-3">
            <div>
              <p className="text-neutral-600">License Number</p>
              <p className="font-medium">{broker.licenseNumber || 'Not specified'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={handleContact}>Contact</Button>
              <Button 
                size="sm" 
                variant="outline" 
                style={{background:"blue", color:"white"}}
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-neutral-600 text-center mt-3">
            Sign in to view broker details and contact information
          </div>
        )}
      </div>
    </div>
  );
};

const BrokerCategoryItem = ({ category }: { category: typeof BROKER_CATEGORIES[0] }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-2 text-xl">
        {category.icon}
      </div>
      <span className="text-sm">{category.name}</span>
    </div>
  );
};

const BrokersSection = () => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  
  // Fetch brokers data from the API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/user`);
        const data = await response.json();
  
        // Log data to inspect its structure
        console.log('API Response:', data);
  
        // Assuming the data is an object with a "users" field containing the array of brokers
        if (Array.isArray(data.users)) {
          const brokerData = data.users.filter((user: Broker) => user.userType === 'broker').slice(0, 4);
          console.log('Filtered Brokers:', brokerData);
  
          // Check if brokerData is not empty and then set the brokers
          if (brokerData.length > 0) {
            setBrokers(brokerData);
          } else {
            console.log("No brokers found.");
          }
        } else {
          console.error('Data is not an array or does not contain users:', data);
        }
      } catch (error) {
        console.error('Error fetching brokers data:', error);
      }
    };
  
    fetchBrokers();
  }, []);
  
  return (
    <section className="mb-12">
      <h2 className="section-title">Top Brokers</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Brokers Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between overflow-x-auto py-2 -mx-2 px-2 gap-4">
            {BROKER_CATEGORIES.map(category => (
              <BrokerCategoryItem key={category.id} category={category} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brokers.map(broker => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
          
          <div className="text-center pt-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/all-brokers')}
              style={{background:"blue", color:"white"}}
            >
              View All Brokers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrokersSection;
