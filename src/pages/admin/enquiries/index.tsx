import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const BASE_URL='https://propb1.onrender.com'

const EnquiriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  // Fetch enquiries data from the API
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/contact/data`);
        const data = await response.json();
        if (data.success) {
          // Map the API response to match the expected format
          const formattedEnquiries = data.contacts.map((enquiry) => ({
            id: enquiry.id,
            user: enquiry.name,
            email: enquiry.email,
            message: enquiry.message,
            date: new Date(enquiry.createdAt._seconds * 1000).toLocaleDateString(),
          }));
          setEnquiries(formattedEnquiries);
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleView = (id: string) => {
    navigate(`/admin/enquiries/${id}/view`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          User Enquiries
        </h1>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search enquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enquiry.user}</div>
                      <div className="text-sm text-gray-500">{enquiry.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.message}</TableCell>
                  <TableCell>{enquiry.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(enquiry.id)}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;
