import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Building2, DollarSign, Star, Calendar, Users, Briefcase } from 'lucide-react';

// Mock data for demonstration
const MOCK_BUILDER = {
  id: 1,
  companyName: "Elite Construction Group",
  email: "contact@eliteconstruction.com",
  phone: "+1 (555) 123-4567",
  address: "456 Business Ave, New York, NY",
  registrationNumber: "BC123456",
  experience: "15 years",
  completedProjects: "45",
  about: "Leading construction company specializing in luxury residential and commercial projects.",
  website: "www.eliteconstruction.com",
  specialties: "Luxury Homes, Commercial Complexes, Green Buildings",
  certifications: "LEED Certified, ISO 9001, National Builder Association",
  status: "active",
  rating: 4.8,
  totalProjects: 45,
  ongoingProjects: 8,
  joinedDate: "2022-01-15",
  projects: [
    {
      id: 1,
      title: "Luxury Condominium Complex",
      type: "Residential",
      location: "Manhattan, NY",
      price: "$25M",
      area: "50,000 sq.ft",
      status: "Completed",
      units: 120,
      completionDate: "2023-12-15"
    },
    {
      id: 2,
      title: "Business Park",
      type: "Commercial",
      location: "Brooklyn, NY",
      price: "$35M",
      area: "75,000 sq.ft",
      status: "Ongoing",
      units: 5,
      completionDate: "2024-06-30"
    }
  ]
};

const ViewBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [builder, setBuilder] = useState(MOCK_BUILDER);

  useEffect(() => {
    // In a real application, you would fetch the builder data here
    setBuilder(MOCK_BUILDER);
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/builders')}
        >
          ← Back to Builders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Builder Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">{builder.companyName}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={builder.status === 'active' ? 'default' : 'secondary'}>
                {builder.status.charAt(0).toUpperCase() + builder.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{builder.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{builder.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{builder.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{builder.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>Registration: {builder.registrationNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>Experience: {builder.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Completed Projects: {builder.completedProjects}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined: {new Date(builder.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Builder Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Builder Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-gray-600">{builder.about}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {builder.specialties.split(',').map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {builder.certifications.split(',').map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Website</h3>
                <a 
                  href={`https://${builder.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {builder.website}
                </a>
              </div>

              <div>
                <h3 className="font-medium mb-2">Project Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Projects</p>
                    <p className="text-2xl font-semibold">{builder.totalProjects}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Ongoing Projects</p>
                    <p className="text-2xl font-semibold">{builder.ongoingProjects}</p>
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

export default ViewBuilderPage; 