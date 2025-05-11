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
import { Search, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnquiriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const navigate = useNavigate();
  const BASE_URL='https://propb1.onrender.com'
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

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleBack = () => {
    setSelectedEnquiry(null);
  };

  if (selectedEnquiry) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Enquiries
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Enquiry Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User Name</h3>
                    <p className="mt-1">{selectedEnquiry.user}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="mt-1">{selectedEnquiry.date}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                Close
              </Button>
              <Button>Reply to Enquiry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search enquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
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
                      onClick={() => handleView(enquiry)}
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
