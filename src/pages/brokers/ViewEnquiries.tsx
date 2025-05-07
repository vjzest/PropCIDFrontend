import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BrokerNavbar from '@/components/BrokerNavbar';

// Mock data for enquiries
const enquiries = [
  {
    id: 1,
    property: 'Luxury Villa in Mumbai',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    message: 'Interested in viewing the property. Please share more details.',
    date: '2024-03-20',
    status: 'Pending',
  },
  {
    id: 2,
    property: '3BHK Apartment in Bangalore',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43211',
    message: 'Would like to know about the payment plans and amenities.',
    date: '2024-03-18',
    status: 'Replied',
  },
  {
    id: 3,
    property: 'Commercial Space in Delhi',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43212',
    message: 'Need information about the commercial space for office setup.',
    date: '2024-03-15',
    status: 'Pending',
  },
  {
    id: 4,
    property: 'Plot in Hyderabad',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 98765 43213',
    message: 'Interested in the plot. Please share the exact location.',
    date: '2024-03-12',
    status: 'Replied',
  },
];

const ViewEnquiries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <BrokerNavbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Property Enquiries</h1>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.property}</TableCell>
                      <TableCell>
                        <div>
                          <div>{enquiry.name}</div>
                          <div className="text-sm text-muted-foreground">{enquiry.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{enquiry.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{enquiry.message}</TableCell>
                      <TableCell>{enquiry.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          enquiry.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {enquiry.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Reply</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewEnquiries; 