import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, DollarSign, Bed, Bath, Ruler, Calendar } from 'lucide-react';

// Mock data for demonstration
const MOCK_BROKER = {
  id: 1,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  properties: [
    {
      id: 1,
      title: "Luxury Villa",
      type: "Residential",
      category: "Villa",
      price: 2500000,
      location: "Beverly Hills, CA",
      area: 3500,
      bedrooms: 5,
      bathrooms: 4,
      status: "Available",
      listedDate: "2024-03-15",
      features: ["Swimming Pool", "Garden", "Garage"],
      images: ["villa1.jpg", "villa2.jpg"]
    },
    {
      id: 2,
      title: "Downtown Apartment",
      type: "Residential",
      category: "Apartment",
      price: 850000,
      location: "New York, NY",
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      status: "Sold",
      listedDate: "2024-02-20",
      features: ["Gym", "Concierge", "Parking"],
      images: ["apt1.jpg", "apt2.jpg"]
    },
    {
      id: 3,
      title: "Commercial Space",
      type: "Commercial",
      category: "Office",
      price: 1500000,
      location: "Chicago, IL",
      area: 2500,
      status: "Available",
      listedDate: "2024-03-01",
      features: ["Elevator", "Security", "Parking"],
      images: ["office1.jpg", "office2.jpg"]
    }
  ]
};

const BrokerPropertiesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [broker, setBroker] = useState(MOCK_BROKER);

  useEffect(() => {
    // In a real application, you would fetch the broker and their properties here
    setBroker(MOCK_BROKER);
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/brokers')}
        >
          ← Back to Brokers
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{broker.name}'s Properties</h1>
        <p className="text-gray-500">Total Properties: {broker.properties.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {broker.properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{property.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{property.type}</Badge>
                <Badge variant={property.status === 'Available' ? 'default' : 'secondary'}>
                  {property.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>${property.price.toLocaleString()}</span>
                </div>
                {property.type === 'Residential' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-gray-500" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-gray-500" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span>{property.area} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Listed: {new Date(property.listedDate).toLocaleDateString()}</span>
                </div>
                <div className="pt-2">
                  <h4 className="font-medium mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrokerPropertiesPage;
