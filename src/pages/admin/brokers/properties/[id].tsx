import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Bed, 
  Bath, 
  Car, 
  Calendar, 
  Eye, 
  Phone, 
  Mail,
  Building2,
  Home,
  Users
} from 'lucide-react';

// Mock data for a specific property
const MOCK_PROPERTY = {
  id: 1,
  title: "Luxury Penthouse",
  type: "Apartment",
  location: "Manhattan, NY",
  price: "$2.5M",
  area: "2,500 sq.ft",
  status: "Active",
  views: 1250,
  enquiries: 45,
  listedDate: "2024-01-15",
  description: "Stunning luxury penthouse with panoramic city views. Features include floor-to-ceiling windows, high-end finishes, and a private terrace.",
  details: {
    bedrooms: 3,
    bathrooms: 2.5,
    parking: 2,
    yearBuilt: 2020,
    floors: 2,
    amenities: ["Swimming Pool", "Gym", "24/7 Security", "Concierge", "Parking"]
  },
  broker: {
    name: "Sarah Johnson",
    email: "sarah.j@realtypros.com",
    phone: "+1 (555) 123-7890",
    rating: 4.9
  },
  images: [
    "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4",
    "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff"
  ],
  documents: [
    { name: "Property Deed", date: "2024-01-10" },
    { name: "Floor Plan", date: "2024-01-12" },
    { name: "Inspection Report", date: "2024-01-14" }
  ]
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Broker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Property Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{MOCK_PROPERTY.title}</CardTitle>
            <CardDescription>Property ID: {MOCK_PROPERTY.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Property Images */}
              <div className="grid grid-cols-3 gap-4">
                {MOCK_PROPERTY.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Property Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{MOCK_PROPERTY.description}</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.details.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.details.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.details.parking} Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.area}</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {MOCK_PROPERTY.details.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-medium mb-2">Documents</h3>
                <div className="space-y-2">
                  {MOCK_PROPERTY.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{doc.name}</span>
                      <span className="text-sm text-gray-500">{doc.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Stats and Broker Info */}
        <div className="space-y-6">
          {/* Property Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Property Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={MOCK_PROPERTY.status === 'Active' ? 'default' : 'secondary'}>
                    {MOCK_PROPERTY.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span>{MOCK_PROPERTY.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Enquiries</span>
                  <span>{MOCK_PROPERTY.enquiries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Listed Date</span>
                  <span>{MOCK_PROPERTY.listedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Broker Information */}
          <Card>
            <CardHeader>
              <CardTitle>Broker Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.broker.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.broker.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{MOCK_PROPERTY.broker.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span>Rating: {MOCK_PROPERTY.broker.rating}/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage; 