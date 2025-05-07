import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageSquare } from 'lucide-react';

// Mock enquiry data
const MOCK_ENQUIRIES = [
  {
    id: 1,
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567"
    },
    property: {
      id: "PROP-1023",
      title: "Luxury Villa with Ocean View",
      type: "Villa"
    },
    message: "I'm interested in scheduling a viewing this weekend. Is the property still available?",
    date: "2024-04-25",
    assignedTo: "Sarah Johnson",
    status: "new"
  },
  {
    id: 2,
    user: {
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "+1 (555) 234-5678"
    },
    property: {
      id: "PROP-2047",
      title: "Modern Downtown Apartment",
      type: "Apartment"
    },
    message: "What are the terms for a 12-month lease? And is parking included?",
    date: "2024-04-24",
    assignedTo: "Michael Zhang",
    status: "replied"
  },
  {
    id: 3,
    user: {
      name: "Carlos Rodriguez",
      email: "carlos.r@example.com",
      phone: "+1 (555) 345-6789"
    },
    property: {
      id: "PRJ-003",
      title: "Riverside Residences",
      type: "Project"
    },
    message: "I'm interested in a 3BHK unit. Can you provide the floor plans and payment options?",
    date: "2024-04-23",
    assignedTo: "Summit Construction Group",
    status: "new"
  },
  {
    id: 4,
    user: {
      name: "David Chen",
      email: "david.c@example.com",
      phone: "+1 (555) 567-8901"
    },
    property: {
      id: "PROP-3089",
      title: "Beach Cottage",
      type: "House"
    },
    message: "I'd like to know more about the surrounding area and amenities.",
    date: "2024-04-22",
    assignedTo: "Elena Rodriguez",
    status: "closed"
  },
  {
    id: 5,
    user: {
      name: "David Chen",
      email: "david.c@example.com",
      phone: "+1 (555) 567-8901"
    },
    property: {
      id: "PRJ-001",
      title: "Green Valley Heights",
      type: "Project"
    },
    message: "Is there any special discount for early bookings?",
    date: "2024-04-21",
    assignedTo: "Horizon Developers",
    status: "replied"
  }
];

const AdminUserEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" ? true : enquiry.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 flex-grow">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Property Enquiries</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell>{enquiry.property.title}</TableCell>
                    <TableCell>{enquiry.user.name}</TableCell>
                    <TableCell>{enquiry.user.email}</TableCell>
                    <TableCell>{enquiry.user.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">{enquiry.message}</TableCell>
                    <TableCell>
                      <Badge variant={enquiry.status === 'new' ? 'default' : 'secondary'}>
                        {enquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{enquiry.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
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

export default AdminUserEnquiriesPage;
