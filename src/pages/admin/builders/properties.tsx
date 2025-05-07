import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock builder property data
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Green Valley Heights",
    builder: "Horizon Developers",
    location: "Brooklyn, NY",
    price: "$750,000 - $1.2M",
    type: "Apartment Complex",
    status: "Under Construction",
    units: 120,
    availableUnits: 78,
    listedDate: "2024-02-15",
  },
  {
    id: 2,
    title: "Riverside Residences",
    builder: "Summit Construction Group",
    location: "Chicago, IL",
    price: "$450,000 - $890,000",
    type: "Township",
    status: "Pre-Launch",
    units: 250,
    availableUnits: 250,
    listedDate: "2024-03-20",
  },
  {
    id: 3,
    title: "Urban Lofts",
    builder: "Urban Innovators LLC",
    location: "Los Angeles, CA",
    price: "$600,000 - $950,000",
    type: "Luxury Apartments",
    status: "Ready To Move",
    units: 85,
    availableUnits: 32,
    listedDate: "2023-11-05",
  },
  {
    id: 4,
    title: "Seaside Villas",
    builder: "Metro Housing Solutions",
    location: "Miami, FL",
    price: "$1.2M - $3.5M",
    type: "Villa Community",
    status: "Under Construction",
    units: 45,
    availableUnits: 20,
    listedDate: "2024-01-30",
  },
  {
    id: 5,
    title: "Evergreen Heights",
    builder: "Pinnacle Estate Builders",
    location: "Seattle, WA",
    price: "$520,000 - $780,000",
    type: "Mixed Use Development",
    status: "Partially Completed",
    units: 150,
    availableUnits: 67,
    listedDate: "2023-10-12",
  }
];

const AdminBuilderPropertiesPage = () => {
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? property.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 flex-grow">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Builder Properties</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Builder</TableHead>
                  <TableHead>Bedrooms</TableHead>
                  <TableHead>Bathrooms</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>${property.price}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.builder}</TableCell>
                    <TableCell>{property.availableUnits} / {property.units}</TableCell>
                    <TableCell>
                      <Badge variant={property.status === 'Ready To Move' ? 'default' : 
                        property.status === 'Under Construction' ? 'secondary' : 
                          property.status === 'Pre-Launch' ? 'destructive' : 'outline'}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.builder}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
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
      <Footer />
    </div>
  );
};

export default AdminBuilderPropertiesPage;
