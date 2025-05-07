import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, User, Building2, MessageSquare, Clock } from 'lucide-react';
const BASE_URL='https://propcidback.onrender.com'

const ViewEnquiryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error handling

  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/contact/data`);
        if (!response.ok) {
          throw new Error('Failed to fetch enquiry data');
        }
        const data = await response.json();

        // Ensure the 'contacts' key exists and is an array
        if (Array.isArray(data.contacts)) {
          const foundEnquiry = data.contacts.find((item) => item.id === id);
          if (foundEnquiry) {
            setEnquiry(foundEnquiry);
          } else {
            setError('Enquiry not found');
          }
        } else {
          setError('Data.contacts is not an array');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/enquiries')}>
          ← Back to Enquiries
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enquiry Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">Enquiry Details</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">New</Badge>
              <Badge variant="outline">High Priority</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  Date: {new Date(enquiry.createdAt._seconds * 1000).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Last Updated: Not available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property Name: {enquiry.subject}</h3>
                <p className="text-sm text-gray-500">Location: Not available</p>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>Status: Not available</span>
              </div>
              <p className="text-lg font-semibold">Price: Not available</p>
            </div>
          </CardContent>
        </Card>

        {/* User Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{enquiry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{enquiry.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{enquiry.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message and Notes Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Message & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Enquiry Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{enquiry.message}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-sm text-gray-500">Date: Not available</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">No notes available</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewEnquiryPage;
