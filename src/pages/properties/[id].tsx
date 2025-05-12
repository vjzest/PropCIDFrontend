import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = "https://propb1.onrender.com";

interface Property {
  _id: string;
  title: string;
  images: string;
  price: string;
  location: string;
  ownerName: string;
  ownerImage?: string;
  beds?: number;
  baths?: number;
  area?: string;
  features?: string[];
  description?: string;
  address?: string;
  contactNumber?: string;
  owner?: string;
  ownerEmail?: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/v1/property/${id}`);
        setProperty(response.data.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to fetch property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const getOwnerInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 text-center">
          <p className="text-lg text-neutral-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 overflow-y-auto">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/properties')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
          <div>
            <div className="relative h-64 mb-4">
              <img
                src={property.images}
                alt={property.title}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold mr-2">
                    {property.owner ? getOwnerInitial(property.owner) : 'N/A'}
                  </div>
                  <span className="text-sm font-medium">
                    {property.ownerName || property.owner}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold">{property.ownerName || 'Unknown Owner'}</h3>
                  <p className="text-sm text-neutral-600">Property Owner</p>
          </div>
        </div>

              <h2 className="text-xl font-bold mb-2">{property.title}</h2>
              <p className="text-primary font-bold text-lg mb-2">{property.price}</p>
              <p className="text-sm mb-4">{property.location}</p>

              <div className="flex justify-between mb-4 p-3 bg-neutral-50 rounded-lg">
          <div className="text-center">
                  <p className="font-bold">{property.beds || 'N/A'}</p>
                  <p className="text-xs text-neutral-500">Beds</p>
          </div>
          <div className="text-center">
                  <p className="font-bold">{property.baths || 'N/A'}</p>
                  <p className="text-xs text-neutral-500">Baths</p>
          </div>
          <div className="text-center">
                  <p className="font-bold">{property.area || 'N/A'}</p>
                  <p className="text-xs text-neutral-500">Area</p>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  {Array.isArray(property.features) && property.features.length > 0 && (
                    <>
                      <h3 className="font-bold mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.features.map((feature: string, index: number) => (
                          <span key={index} className="bg-neutral-100 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-sm text-neutral-700 mb-4">{property.description || 'N/A'}</p>

                  <h3 className="font-bold mb-2">Address</h3>
                  <p className="text-sm text-neutral-700 mb-4">{property.address || 'N/A'}</p>

                  <h3 className="font-bold mb-2">Contact Number</h3>
                  <p className="text-sm text-neutral-700 mb-4">{property.contactNumber || 'N/A'}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full">Contact Owner</Button>
                    <Button variant="outline" className="w-full">Schedule Tour</Button>
                  </div>
                </>
              ) : (
                <div className="bg-neutral-50 p-4 rounded-lg mb-4 text-center">
                  <p className="text-sm text-neutral-600">
                    Sign in to view full property details and contact options
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails; 
