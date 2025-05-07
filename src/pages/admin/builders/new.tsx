import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AddBuilderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    about: '',
    yearsOfExperience: '',
    completedProjects: '',
    website: '',
    specialties: '',
    certifications: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Builder Added",
      description: "The builder has been added successfully",
    });
    navigate('/admin/builders');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
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
                <label className="text-sm font-medium">Registration Number</label>
                <Input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Completed Projects</label>
                <Input
                  name="completedProjects"
                  value={formData.completedProjects}
                  onChange={handleChange}
                  placeholder="Enter number of completed projects"
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
                placeholder="Enter company description"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Specialties</label>
              <Input
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                placeholder="Enter specialties (comma separated)"
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
                onClick={() => navigate('/admin/builders')}
              >
                Cancel
              </Button>
              <Button type="submit">Add Builder</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBuilderPage; 