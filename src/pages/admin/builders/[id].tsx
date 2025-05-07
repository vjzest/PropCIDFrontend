import { useParams } from 'react-router-dom';
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
import { Eye, Phone, Mail, MapPin, Building2, DollarSign, Star, Calendar } from 'lucide-react';

// Mock data for a specific builder
const MOCK_BUILDER = {
  id: 1,
  name: "ABC Construction",
  email: "contact@abcconstruction.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  specialization: "Luxury Residential",
  totalArea: "2.5M sq.ft",
  propertiesCount: 25,
  joinedDate: "2022-01-15",
  status: "active",
  rating: 4.8,
  revenue: "$45M",
  projects: {
    underConstruction: 8,
    completed: 12,
    upcoming: 5
  },
  properties: [
    {
      id: 1,
      title: "Luxury Heights",
      type: "Apartment Complex",
      location: "Manhattan, NY",
      price: "$2.5M",
      area: "2,500 sq.ft",
      status: "Under Construction",
      completionDate: "2024-12-31",
      units: 50,
      listedDate: "2023-06-15"
    },
    {
      id: 2,
      title: "Waterfront Residences",
      type: "Condominium",
      location: "Brooklyn, NY",
      price: "$3.8M",
      area: "4,200 sq.ft",
      status: "Completed",
      completionDate: "2023-12-15",
      units: 75,
      listedDate: "2022-01-01"
    },
    // Add more properties as needed
  ]
};

const BuilderDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Builder Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{MOCK_BUILDER.name}</CardTitle>
            <CardDescription>Builder ID: {MOCK_BUILDER.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BUILDER.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BUILDER.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BUILDER.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{MOCK_BUILDER.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Total Revenue: {MOCK_BUILDER.revenue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span>Rating: {MOCK_BUILDER.rating}/5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Total Area: {MOCK_BUILDER.totalArea}</span>
              </div>
              <div>
                <Badge variant={MOCK_BUILDER.status === 'active' ? 'default' : 'secondary'}>
                  {MOCK_BUILDER.status.charAt(0).toUpperCase() + MOCK_BUILDER.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
            <CardDescription>Total Projects: {MOCK_BUILDER.propertiesCount}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_BUILDER.projects.underConstruction}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_BUILDER.projects.completed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_BUILDER.projects.upcoming}</div>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_BUILDER.properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{property.area}</TableCell>
                    <TableCell>
                      <Badge variant={property.status === 'Completed' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.units}</TableCell>
                    <TableCell>{property.completionDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
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

export default BuilderDetailsPage; 