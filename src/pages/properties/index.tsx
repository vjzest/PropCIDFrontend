import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const BASE_URL='https://propcidback.onrender.com'

const PropertyCard = ({ property }: { property: any }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  const handleLoginPrompt = () => {
    setShowDialog(false);
    navigate('/');
  };

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
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              {property.ownerImage ? (
                <img
                  src={property.ownerImage}
                  alt={property.owner}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {property.owner ? getOwnerInitial(property.owner) : 'N/A'}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">
              {property.ownerName || property.owner}
            </span>
          </div>

          <h3 className="text-base font-bold mb-1">{property.title}</h3>
          <p className="text-sm text-neutral-600 truncate">{property.location}</p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <div>
            <div className="relative h-64 mb-4">
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>

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
        </DialogContent>
      </Dialog>
    </>
  );
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/property/getProperties`);
        setProperties(response.data.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search query
  useEffect(() => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower)
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchQuery, properties]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="w-[70%] mx-auto">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Discover Your Dream Property"}
          </h1>
          <p className="text-lg text-neutral-600">
            {searchQuery 
              ? `Found ${filteredProperties.length} properties matching your search`
              : "Explore our extensive collection of premium properties"}
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your search criteria.</p>
            <Button 
              onClick={() => window.location.href = '/properties'}
              className="mt-4"
            >
              View All Properties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
