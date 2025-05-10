import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogContent } from '@/components/ui/dialog';
const BASE_URL = "http://localhost:4000";

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
            <p className="text-sm mb-4">{property.location}</p>

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

const PropertyFeed = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const handleViewAllProperties = () => {
    navigate('/properties', {
      state: {
        withNavbar: true,
        withFooter: true
      }
    });
  };

  return (
    <section className="mb-12">
      <h2 className="section-title">Featured Properties</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.slice(0, 4).map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleViewAllProperties}
          style={{ background: 'blue', color: 'white' }}
        >
          View All Properties
        </Button>
      </div>
    </section>
  );
};

export default PropertyFeed;
