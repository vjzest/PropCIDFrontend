import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const MOCK_BROKER = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.j@realtypros.com",
  phone: "+1 (555) 123-7890",
  address: "123 Main St, New York, NY",
  licenseNumber: "REB123456",
  experience: "8 years",
  specialization: "Luxury Properties",
  about: "Experienced broker specializing in luxury properties in New York City.",
  website: "www.sarahjohnsonrealty.com",
  languages: "English, Spanish",
  certifications: "Certified Luxury Home Marketing Specialist, National Association of Realtors"
};

const EditBrokerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    experience: '',
    specialization: '',
    about: '',
    website: '',
    languages: '',
    certifications: ''
  });

  useEffect(() => {
    // In a real application, you would fetch the broker data here
    setFormData({
      name: MOCK_BROKER.name,
      email: MOCK_BROKER.email,
      phone: MOCK_BROKER.phone,
      address: MOCK_BROKER.address,
      licenseNumber: MOCK_BROKER.licenseNumber,
      experience: MOCK_BROKER.experience,
      specialization: MOCK_BROKER.specialization,
      about: MOCK_BROKER.about,
      website: MOCK_BROKER.website,
      languages: MOCK_BROKER.languages,
      certifications: MOCK_BROKER.certifications
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Broker Updated",
      description: "The broker has been updated successfully",
    });
    navigate('/admin/brokers');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Broker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter specialization"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About</label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Enter broker description"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Languages</label>
              <Input
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="Enter languages (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certifications</label>
              <Input
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Enter certifications (comma separated)"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/brokers')}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBrokerPage; 