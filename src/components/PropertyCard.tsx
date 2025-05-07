import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Property {
  _id: string;
  title: string;
  description?: string;
  price: string;
  location: string;
  images: string;
  owner?: string;
  ownerName?: string;
  ownerImage?: string;
  beds?: number;
  baths?: number;
  area?: string;
  features?: string[];
  address?: string;
  contactNumber?: string;
  ownerEmail?: string;
}

const PropertyCard = ({ property }: { property: Property }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const getInitial = (name?: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
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
            {property.ownerImage ? (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img
                  src={property.ownerImage}
                  alt={property.ownerName || 'Owner'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-2">
                {getInitial(property.ownerName)}
              </div>
            )}
            <span className="text-sm font-medium">{property.ownerName || 'Unknown Owner'}</span>
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
                src={property.images}
                alt={property.title}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>

            <div className="flex items-center mb-4">
              {property.ownerImage ? (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={property.ownerImage}
                    alt={property.ownerName || 'Owner'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mr-3">
                  {getInitial(property.ownerName)}
                </div>
              )}
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
              <div>
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
                <p className="text-sm text-neutral-700 mb-4">{property.description || 'No description available'}</p>

                <h3 className="font-bold mb-2">Address</h3>
                <p className="text-sm text-neutral-700 mb-4">{property.address || 'Address not available'}</p>

                <h3 className="font-bold mb-2">Contact Number</h3>
                <p className="text-sm text-neutral-700 mb-4">{property.contactNumber || 'Contact number not available'}</p>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full">Contact Owner</Button>
                  <Button variant="outline" className="w-full">Schedule Tour</Button>
                </div>
              </div>
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

export default PropertyCard;
