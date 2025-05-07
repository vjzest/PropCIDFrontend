import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Home, Bath, Expand, Phone, Mail } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const PROPERTIES = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    price: "$4,250,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    location: "Beverly Hills, CA",
    beds: 5,
    baths: 6,
    sqft: 6500,
    owner: {
      name: "Michael Brooks",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  // ...other properties
];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = PROPERTIES.find(p => p.id === Number(id));

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <Navbar />
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => navigate('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <Navbar />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4">
        <div className="rounded-xl overflow-hidden h-48 mb-4">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center mb-3">
          <img src={property.owner.image} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <div className="font-bold">{property.owner.name}</div>
            <div className="text-xs text-gray-500">Property Owner</div>
          </div>
        </div>
        <div className="font-bold text-xl mb-1">{property.title}</div>
        <div className="text-green-600 font-bold text-lg mb-1">{property.price}</div>
        <div className="text-gray-600 mb-2">{property.location}</div>
        <div className="flex justify-between bg-neutral-50 rounded-lg p-3 mb-3">
          <div className="text-center">
            <div className="font-bold">{property.beds}</div>
            <div className="text-xs text-gray-500">Beds</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{property.baths}</div>
            <div className="text-xs text-gray-500">Baths</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{property.sqft.toLocaleString()} sq ft</div>
            <div className="text-xs text-gray-500">Area</div>
          </div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-3 text-center text-gray-500 text-sm">
          Sign in to view full property details and contact options
        </div>
        <Button variant="ghost" className="mt-4 w-full" onClick={() => navigate('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails; 