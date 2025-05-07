import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';

// Mock data for demonstration
const mockProperties = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    type: 'Apartment',
    location: 'Mumbai',
    price: '₹2.5 Cr',
    area: '1200 sq.ft',
    status: 'Active',
    views: 245,
    enquiries: 12,
    listedDate: '2024-02-15',
    ownerName: 'Rahul Sharma',
    ownerContact: '+91 9876543210',
    ownerEmail: 'rahul@example.com',
  },
  {
    id: 2,
    title: 'Modern Villa in Suburbs',
    type: 'Villa',
    location: 'Bangalore',
    price: '₹4.8 Cr',
    area: '2500 sq.ft',
    status: 'Active',
    views: 189,
    enquiries: 8,
    listedDate: '2024-02-10',
    ownerName: 'Priya Patel',
    ownerContact: '+91 9876543211',
    ownerEmail: 'priya@example.com',
  },
  {
    id: 3,
    title: 'Commercial Space in Business District',
    type: 'Commercial',
    location: 'Delhi',
    price: '₹3.2 Cr',
    area: '1800 sq.ft',
    status: 'Pending',
    views: 156,
    enquiries: 5,
    listedDate: '2024-02-05',
    ownerName: 'Amit Kumar',
    ownerContact: '+91 9876543212',
    ownerEmail: 'amit@example.com',
  },
];

const ViewPropertyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (id: number) => {
    // Handle edit property
    console.log('Edit property:', id);
  };

  const handleDelete = (id: number) => {
    // Handle delete property
    console.log('Delete property:', id);
  };

  const handleViewDetails = (id: number) => {
    // Handle view property details
    console.log('View property details:', id);
  };

  const handleContactOwner = (contact: string) => {
    // Handle contact owner
    console.log('Contact owner:', contact);
  };

  const handleEmailOwner = (email: string) => {
    // Handle email owner
    console.log('Email owner:', email);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Button>Add New Property</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Property Listings</CardTitle>
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Enquiries</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Listed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell>{property.area}</TableCell>
                  <TableCell>
                    <Badge
                      variant={property.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.views}</TableCell>
                  <TableCell>{property.enquiries}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{property.ownerName}</span>
                      <div className="flex gap-2 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleContactOwner(property.ownerContact)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEmailOwner(property.ownerEmail)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{property.listedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(property.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(property.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewPropertyPage; 