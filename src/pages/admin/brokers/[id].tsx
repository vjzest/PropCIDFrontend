import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Mail, MapPin, Building2, DollarSign, Star } from 'lucide-react';

// Mock data for a specific broker
const MOCK_BROKER = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.j@realtypros.com",
  phone: "+1 (555) 123-7890",
  location: "New York, NY",
  specialization: "Luxury Properties",
  sales: "$48M",
  propertiesCount: 24,
  joinedDate: "2023-09-15",
  status: "active",
  rating: 4.9,
  experience: "8 years",
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
    },
    // Add more properties as needed
  ]
};

const BrokerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Broker Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{MOCK_BROKER.name}</CardTitle>
            <CardDescription>Broker ID: {MOCK_BROKER.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BROKER.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BROKER.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BROKER.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BROKER.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Total Sales: {MOCK_BROKER.sales}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span>Rating: {MOCK_BROKER.rating}/5.0</span>
              </div>
              <div>
                <Badge variant={MOCK_BROKER.status === 'active' ? 'default' : 'secondary'}>
                  {MOCK_BROKER.status.charAt(0).toUpperCase() + MOCK_BROKER.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Total Properties: {MOCK_BROKER.properties.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Enquiries</TableHead>
                  <TableHead>Listed Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_BROKER.properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{property.area}</TableCell>
                    <TableCell>
                      <Badge variant={property.status === 'Active' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.views}</TableCell>
                    <TableCell>{property.enquiries}</TableCell>
                    <TableCell>{property.listedDate}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/admin/brokers/properties/${property.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerDetailsPage; 