import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
const BASE_URL = "https://propb1.onrender.com";

const PropertyCard = ({ property }: { property: any }) => {
  const [showDialog, setShowDialog] = useState(false);
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  // Function to get the first letter of the owner's name as a fallback icon
  const getOwnerInitial = (name: string) => {
    return name.charAt(0).toUpperCase(); // Get the first letter and capitalize it
  };

  return (
    <>
      <div
        className="property-card overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 duration-300"
        onClick={() => setShowDialog(true)}
      >
        <div className="relative h-56">
          <img
            src={property.images}
            alt={property.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-primary px-2 py-1 rounded text-white text-xs font-medium">
            {property.price}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold mr-2">
              {property.owner ? getOwnerInitial(property.owner) : 'N/A'}
            </div>
            <span className="text-sm font-medium">{property.owner}</span>
          </div>

          <h3 className="text-base font-bold mb-1">{property.title}</h3>
          <p className="text-sm text-neutral-600 truncate">{property.location}</p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <div>
            <div className="relative h-64 mb-4">
              <img
                src={property.images}
                alt={property.title}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>

            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white font-bold mr-2">
                {property.owner ? getOwnerInitial(property.owner) : 'N/A'}
              </div>
              <div>
                <h3 className="font-bold">{property.owner}</h3>
                <p className="text-sm text-neutral-600">Property Owner</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{property.title}</h2>
            <p className="text-primary font-bold text-lg mb-2">{property.price}</p>
            <p className="text-sm mb-2">{property.location}</p>
            <div className="flex justify-between mb-4 p-3 bg-neutral-50 rounded-lg">
              <div className="text-center">
                <p className="font-bold">{property.beds}</p>
                <p className="text-xs text-neutral-500">Beds</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{property.baths}</p>
                <p className="text-xs text-neutral-500">Baths</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{property.area}</p>
                <p className="text-xs text-neutral-500">Area</p>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <h3 className="font-bold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(property.features) ? (
                    property.features.map((feature: string, index: number) => (
                      <span key={index} className="bg-neutral-100 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-600">No features available</p>
                  )}
                </div>

                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-sm text-neutral-700 mb-4">
                  {property.description}
                </p>

                <div className="mb-4">
                  <h3 className="font-bold mb-2">Contact Information</h3>
                  <p className="text-sm text-neutral-700">
                    Phone: {property.phoneNumber || 'Not available'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full">Contact Owner</Button>
                  <Button variant="outline" className="w-full">Schedule Tour</Button>
                </div>
              </>
            ) : (
              <div className="bg-neutral-50 p-4 rounded-lg mb-4 text-center">
                <p className="text-sm text-neutral-600">Sign in to view full property details and contact options</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/v1/property/getProperties`);
        setProperties(response.data.data);
        
        // If there's a search query from navbar or local search, filter the properties
        const activeSearchQuery = searchQuery || localSearchQuery;
        if (activeSearchQuery) {
          const filtered = response.data.data.filter(property => {
            const titleMatch = property.title.toLowerCase().includes(activeSearchQuery.toLowerCase());
            const locationMatch = property.location.toLowerCase().includes(activeSearchQuery.toLowerCase());
            return titleMatch || locationMatch;
          });
          setFilteredProperties(filtered);
        } else {
          setFilteredProperties(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to fetch properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, localSearchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="w-[70%] mx-auto">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Discover Your Dream Property</h1>
          <p className="text-lg text-neutral-600 mb-6">
            Explore our extensive collection of premium properties
          </p>
          
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-neutral-600">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-neutral-600">No properties found matching your search.</p>
          </div>
        ) : (
          <>
            {localSearchQuery && (
              <p className="text-sm text-neutral-600 mb-4">
                Showing {filteredProperties.length} results for "{localSearchQuery}"
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
