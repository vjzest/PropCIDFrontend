import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, User, Calendar, Shield, Building2, Briefcase } from 'lucide-react';

// Mock data for demonstration
const MOCK_USER = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY",
  role: "admin",
  status: "active",
  joinedDate: "2023-01-15",
  lastLogin: "2024-03-20T10:30:00",
  properties: [
    {
      id: 1,
      title: "Luxury Apartment",
      type: "Residential",
      location: "Manhattan, NY",
      price: "$1.2M",
      status: "Active"
    },
    {
      id: 2,
      title: "Commercial Space",
      type: "Commercial",
      location: "Brooklyn, NY",
      price: "$2.5M",
      status: "Pending"
    }
  ],
  enquiries: [
    {
      id: 1,
      property: "Luxury Villa",
      date: "2024-03-15",
      status: "New"
    },
    {
      id: 2,
      property: "Office Space",
      date: "2024-03-18",
      status: "In Progress"
    }
  ]
};

const ViewUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(MOCK_USER);

  useEffect(() => {
    // In a real application, you would fetch the user data here
    setUser(MOCK_USER);
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/users')}
        >
          ← Back to Users
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
              <Badge variant="outline">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{user.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined: {new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>Last Login: {new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Properties Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{property.title}</h3>
                      <p className="text-sm text-gray-500">{property.type} • {property.location}</p>
                    </div>
                    <Badge variant={property.status === 'Active' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold mt-2">{property.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Enquiries Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.enquiries.map((enquiry) => (
                <div key={enquiry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{enquiry.property}</h3>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(enquiry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      enquiry.status === 'New' ? 'default' :
                      enquiry.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {enquiry.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewUserPage; 