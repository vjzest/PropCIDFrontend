import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Building2, DollarSign, Star, Calendar, Users } from 'lucide-react';

// Mock data for demonstration
const MOCK_BROKER = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.j@realtypros.com",
  phone: "+1 (555) 123-7890",
  address: "123 Main St, New York, NY",
  licenseNumber: "REB123456",
  experience: "8 years",
  specialization: "Luxury Properties",
  about: "Experienced broker specializing in luxury properties in New York City.",
  website: "www.sarahjohnsonrealty.com",
  languages: "English, Spanish",
  certifications: "Certified Luxury Home Marketing Specialist, National Association of Realtors",
  status: "active",
  rating: 4.9,
  totalSales: "$48M",
  propertiesCount: 24,
  joinedDate: "2023-09-15",
  properties: [
    {
      id: 1,
      title: "Luxury Penthouse",
      type: "Apartment",
      location: "Manhattan, NY",
      price: "$2.5M",
      area: "2,500 sq.ft",
      status: "Active",
      views: 1250,
      enquiries: 45,
      listedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Waterfront Villa",
      type: "Villa",
      location: "Brooklyn, NY",
      price: "$3.8M",
      area: "4,200 sq.ft",
      status: "Active",
      views: 980,
      enquiries: 32,
      listedDate: "2024-02-01"
    }
  ]
};

const ViewBrokerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [broker, setBroker] = useState(MOCK_BROKER);

  useEffect(() => {
    // In a real application, you would fetch the broker data here
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Broker Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{broker.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={broker.status === 'active' ? 'default' : 'secondary'}>
                {broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{broker.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{broker.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{broker.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{broker.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{broker.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Total Sales: {broker.totalSales}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Properties: {broker.propertiesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined: {new Date(broker.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broker Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Broker Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-gray-600">{broker.about}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">License Information</h3>
                <p className="text-gray-600">License Number: {broker.licenseNumber}</p>
                <p className="text-gray-600">Experience: {broker.experience}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {broker.languages.split(',').map((lang, index) => (
                    <Badge key={index} variant="secondary">
                      {lang.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {broker.certifications.split(',').map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Website</h3>
                <a 
                  href={`https://${broker.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {broker.website}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewBrokerPage; 