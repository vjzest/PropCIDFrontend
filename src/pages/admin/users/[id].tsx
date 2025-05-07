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
import { Eye, Phone, Mail, MapPin, Home, DollarSign, Calendar, Heart } from 'lucide-react';

// Mock data for a specific user
const MOCK_USER = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  type: "Buyer",
  joinedDate: "2023-01-15",
  status: "active",
  preferences: {
    propertyType: "Apartment",
    budget: "$500,000 - $1,000,000",
    location: "Manhattan, Brooklyn",
    bedrooms: "2-3",
    bathrooms: "2"
  },
  interests: [
    {
      id: 1,
      propertyId: 101,
      title: "Luxury Heights",
      type: "Apartment",
      location: "Manhattan, NY",
      price: "$750,000",
      area: "1,200 sq.ft",
      status: "Interested",
      viewedDate: "2024-01-15",
      lastContact: "2024-01-20"
    },
    {
      id: 2,
      propertyId: 102,
      title: "Waterfront Residences",
      type: "Condominium",
      location: "Brooklyn, NY",
      price: "$850,000",
      area: "1,500 sq.ft",
      status: "Shortlisted",
      viewedDate: "2024-02-01",
      lastContact: "2024-02-05"
    },
    // Add more interests as needed
  ],
  enquiries: [
    {
      id: 1,
      propertyId: 101,
      title: "Luxury Heights",
      date: "2024-01-20",
      status: "Replied",
      message: "Interested in scheduling a viewing"
    },
    {
      id: 2,
      propertyId: 102,
      title: "Waterfront Residences",
      date: "2024-02-05",
      status: "Pending",
      message: "Would like to know more about the amenities"
    },
    // Add more enquiries as needed
  ]
};

const UserDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{MOCK_USER.name}</CardTitle>
            <CardDescription>User ID: {MOCK_USER.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{MOCK_USER.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{MOCK_USER.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{MOCK_USER.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span>Type: {MOCK_USER.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Member since: {MOCK_USER.joinedDate}</span>
              </div>
              <div>
                <Badge variant={MOCK_USER.status === 'active' ? 'default' : 'secondary'}>
                  {MOCK_USER.status.charAt(0).toUpperCase() + MOCK_USER.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Preferences</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Property Type:</span> {MOCK_USER.preferences.propertyType}</p>
                <p><span className="font-medium">Budget:</span> {MOCK_USER.preferences.budget}</p>
                <p><span className="font-medium">Location:</span> {MOCK_USER.preferences.location}</p>
                <p><span className="font-medium">Bedrooms:</span> {MOCK_USER.preferences.bedrooms}</p>
                <p><span className="font-medium">Bathrooms:</span> {MOCK_USER.preferences.bathrooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Interests Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Property Interests</CardTitle>
            <CardDescription>Total Properties: {MOCK_USER.interests.length}</CardDescription>
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
                  <TableHead>Viewed</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_USER.interests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell className="font-medium">{interest.title}</TableCell>
                    <TableCell>{interest.type}</TableCell>
                    <TableCell>{interest.location}</TableCell>
                    <TableCell>{interest.price}</TableCell>
                    <TableCell>{interest.area}</TableCell>
                    <TableCell>
                      <Badge variant={interest.status === 'Shortlisted' ? 'default' : 'secondary'}>
                        {interest.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{interest.viewedDate}</TableCell>
                    <TableCell>{interest.lastContact}</TableCell>
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

        {/* Enquiries Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Enquiries</CardTitle>
            <CardDescription>Total Enquiries: {MOCK_USER.enquiries.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_USER.enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.title}</TableCell>
                    <TableCell>{enquiry.date}</TableCell>
                    <TableCell>
                      <Badge variant={enquiry.status === 'Replied' ? 'default' : 'secondary'}>
                        {enquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{enquiry.message}</TableCell>
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

export default UserDetailsPage; 