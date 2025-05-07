import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Phone, Mail, Calendar, Award, Briefcase, Globe, Star, Users, DollarSign, Target, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface BuilderProfileData {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  about: string;
  yearsOfExperience: number;
  completedProjects: number;
  website: string;
  specialties: string[];
  certifications: string[];
  totalRevenue: string;
  activeProjects: number;
  teamSize: number;
  awards: string[];
  profileImage?: string;
}

const defaultProfile: BuilderProfileData = {
  companyName: "Elite Construction Group",
  email: "contact@eliteconstruction.com",
  phone: "+91 9876543210",
  address: "123 Business Park, Mumbai, Maharashtra",
  registrationNumber: "REG123456",
  about: "Leading construction company with over 20 years of experience in residential and commercial projects. Specializing in luxury developments and sustainable building practices.",
  yearsOfExperience: 20,
  completedProjects: 45,
  website: "www.eliteconstruction.com",
  specialties: ["Luxury Residential", "Commercial Complexes", "Green Buildings", "Smart Homes"],
  certifications: ["ISO 9001:2015", "LEED Platinum Certified", "Safety Excellence Award 2023"],
  totalRevenue: "₹2.5B",
  activeProjects: 12,
  teamSize: 250,
  awards: ["Best Builder Award 2023", "Green Building Excellence 2022", "Innovation in Construction 2021"],
  profileImage: ""
};

const BuilderProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<BuilderProfileData>(defaultProfile);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newAward, setNewAward] = useState("");

  // Load profile data from API when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/builder/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof BuilderProfileData, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('/api/builder/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, profileImage: data.imageUrl }));
        toast({
          title: "Success",
          description: "Profile image uploaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !profile.certifications.includes(newCertification.trim())) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (certification: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleAddAward = () => {
    if (newAward.trim() && !profile.awards.includes(newAward.trim())) {
      setProfile(prev => ({
        ...prev,
        awards: [...prev.awards, newAward.trim()]
      }));
      setNewAward("");
    }
  };

  const handleRemoveAward = (award: string) => {
    setProfile(prev => ({
      ...prev,
      awards: prev.awards.filter(a => a !== award)
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/builder/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground">
            Manage your company information and credentials.
          </p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Image Section - Now smaller and above company information */}
      <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.profileImage} />
          <AvatarFallback>{profile.companyName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{profile.companyName}</h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
        {isEditing && (
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('profile-image')?.click()}
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Change Image
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information Form */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={profile.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                type="email"
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter company address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Number</label>
              <Input
                value={profile.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter registration number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input
                value={profile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter website URL"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">About</label>
              <Textarea
                value={profile.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter company description"
              />
            </div>
            {isEditing && (
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Company Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Company Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Years of Experience</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value))}
                      className="w-24"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{profile.yearsOfExperience}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Completed Projects</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.completedProjects}
                      onChange={(e) => handleInputChange('completedProjects', parseInt(e.target.value))}
                      className="w-24"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{profile.completedProjects}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  {isEditing ? (
                    <Input
                      value={profile.totalRevenue}
                      onChange={(e) => handleInputChange('totalRevenue', e.target.value)}
                      className="w-32"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{profile.totalRevenue}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.activeProjects}
                      onChange={(e) => handleInputChange('activeProjects', parseInt(e.target.value))}
                      className="w-24"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{profile.activeProjects}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.teamSize}
                      onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                      className="w-24"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{profile.teamSize}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                  >
                    {specialty}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add new specialty"
                    className="flex-1"
                  />
                  <Button onClick={handleAddSpecialty}>Add</Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((certification, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="flex-1">{certification}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveCertification(certification)}
                        className="text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add new certification"
                    className="flex-1"
                  />
                  <Button onClick={handleAddCertification}>Add</Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Awards & Recognition</h3>
              <div className="space-y-2">
                {profile.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="flex-1">{award}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveAward(award)}
                        className="text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    placeholder="Add new award"
                    className="flex-1"
                  />
                  <Button onClick={handleAddAward}>Add</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuilderProfile; 