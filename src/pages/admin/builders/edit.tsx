import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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
  status: "active"
};

const EditBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    experience: '',
    completedProjects: '',
    about: '',
    website: '',
    specialties: '',
    certifications: '',
    status: 'active'
  });

  useEffect(() => {
    // In a real application, you would fetch the builder data here
    setFormData(MOCK_BUILDER);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save the changes here
    console.log('Form data:', formData);
    toast({
      title: "Builder updated",
      description: "The builder information has been successfully updated.",
    });
    navigate('/admin/builders');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Edit Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="registrationNumber" className="text-sm font-medium">
                  Registration Number
                </label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">
                  Experience
                </label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="completedProjects" className="text-sm font-medium">
                  Completed Projects
                </label>
                <Input
                  id="completedProjects"
                  name="completedProjects"
                  value={formData.completedProjects}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="specialties" className="text-sm font-medium">
                  Specialties (comma-separated)
                </label>
                <Input
                  id="specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="certifications" className="text-sm font-medium">
                  Certifications (comma-separated)
                </label>
                <Input
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="about" className="text-sm font-medium">
                About
              </label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/builders')}
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

export default EditBuilderPage; 