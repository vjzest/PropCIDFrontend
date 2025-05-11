import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

// Broker categories to filter by
const CATEGORIES = ['All', 'Luxury', 'Residential', 'Commercial', 'International'];
const BASE_URL='https://propb1.onrender.com'

const BrokerCard = ({ broker }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  const handleViewProfile = () => {
    // Store broker profile data in localStorage for the profile page
    localStorage.setItem('profileData', JSON.stringify({
      type: 'broker',
      id: broker.id,
      name: broker.name,
      image: broker.image,
      category: broker.category,
      experience: broker.experience,
      location: broker.location,
      email: broker.email,
      phone: broker.phone,
      website: broker.website,
      languages: broker.languages,
      certifications: broker.certifications,
      about: broker.about,
      activeListings: broker.activeListings,
      totalSales: broker.totalSales,
      averagePrice: broker.averagePrice,
      specialties: broker.specialties,
      rating: broker.rating
    }));
    navigate(`/brokers/${broker.id}`);
  };

  // If no profile image, show an icon with the first letter of the name
  const renderProfileImage = broker.image ? (
    <img src={broker.image} alt={broker.name} className="w-full h-full object-cover" />
  ) : (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
      {broker.name.charAt(0)}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            {renderProfileImage}
          </div>
          <div>
            <h3 className="text-base font-bold">{broker.name}</h3>
            <span className="text-xs py-0.5 px-2 bg-neutral-100 rounded-full">{broker.category}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-neutral-600 text-xs">Location</p>
            <p className="font-medium text-sm">{broker.location}</p>
          </div>
          <div>
            <p className="text-neutral-600 text-xs">Experience</p>
            <p className="font-medium text-sm">{broker.experience}</p>
          </div>
          {isAuthenticated && (
            <>
              <div>
                <p className="text-neutral-600 text-xs">Properties</p>
                <p className="font-medium text-sm">{broker.properties}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-xs">Annual Sales</p>
                <p className="font-medium text-sm">{broker.sales}</p>
              </div>
              <div className="col-span-2">
                <p className="text-neutral-600 text-xs">Specialties</p>
                <p className="font-medium text-sm">{broker.specialties?.join(', ')}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-between mt-3">
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
    </div>
  );
};


const AllBrokers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [brokers, setBrokers] = useState<any[]>([]);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch broker data from API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/user`);
        const data = await response.json();
        
        // Log the data to check its structure
        console.log('API Response:', data);
  
        // Access the 'users' field and check if it's an array
        if (Array.isArray(data.users)) {
          const brokerData = data.users.filter((user: any) => user.userType === 'broker');
          setBrokers(brokerData);
        } else {
          console.error('API response does not contain a valid "users" array:', data);
          // Optionally, handle cases when the response is not in the expected format
        }
      } catch (error) {
        console.error('Error fetching broker data:', error);
      }
    };
  
    fetchBrokers();
  }, []);
  
  
  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broker.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || broker.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">All Brokers</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search brokers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md p-2"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrokers.map(broker => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllBrokers;
