import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, MapPin, Phone, Mail, Calendar, Award, Briefcase, Globe, Star, Users, DollarSign, Target, Upload, Lock, Shield, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BrokerNavbar from '@/components/BrokerNavbar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface BrokerProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  about: string;
  yearsOfExperience: number;
  totalSales: string;
  website: string;
  specializations: string[];
  certifications: string[];
  activeListings: number;
  completedDeals: number;
  rating: number;
  languages: string[];
  profileImage?: string;
}

const BrokerProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<BrokerProfileData>({
    name: "Sarah Johnson",
    email: "sarah.j@realestate.com",
    phone: "+91 9876543210",
    address: "123 Business District, Mumbai, Maharashtra",
    licenseNumber: "RERA2023456",
    about: "Experienced real estate broker with over 10 years of expertise in luxury and commercial properties. Specializing in high-value transactions and international clients.",
    yearsOfExperience: 10,
    totalSales: "₹85.2M",
    website: "www.sarahjohnson.com",
    specializations: ["Luxury Properties", "Commercial Real Estate", "International Sales", "Property Investment"],
    certifications: ["RERA Certified", "Luxury Property Specialist", "International Property Consultant"],
    activeListings: 15,
    completedDeals: 145,
    rating: 4.8,
    languages: ["English", "Hindi", "Marathi"],
    profileImage: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');

  useEffect(() => {
    // Fetch profile data from backend
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/broker/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
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

  const handleInputChange = (field: keyof BrokerProfileData, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('/api/broker/upload-profile-image', {
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/broker/profile', {
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

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/broker/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASetup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/broker/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: twoFACode }),
      });

      if (response.ok) {
        setIs2FAEnabled(true);
        setIs2FASetupOpen(false);
        toast({
          title: "Success",
          description: "Two-factor authentication enabled successfully",
        });
      } else {
        throw new Error('Failed to enable 2FA');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/broker/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to login or home page after successful deletion
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BrokerNavbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Profile Image Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profileImage} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
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
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your name"
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
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">License Number</label>
                    <Input
                      value={profile.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter license number"
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
                      placeholder="Enter your professional summary"
                    />
                  </div>
                  {isEditing && (
                    <Button onClick={handleSubmit} className="w-full">
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Professional Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Statistics</CardTitle>
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
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        {isEditing ? (
                          <Input
                            value={profile.totalSales}
                            onChange={(e) => handleInputChange('totalSales', e.target.value)}
                            placeholder="Enter total sales"
                          />
                        ) : (
                          <p className="text-2xl font-bold">{profile.totalSales}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Active Listings</p>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profile.activeListings}
                            onChange={(e) => handleInputChange('activeListings', parseInt(e.target.value))}
                            className="w-24"
                          />
                        ) : (
                          <p className="text-2xl font-bold">{profile.activeListings}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Completed Deals</p>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profile.completedDeals}
                            onChange={(e) => handleInputChange('completedDeals', parseInt(e.target.value))}
                            className="w-24"
                          />
                        ) : (
                          <p className="text-2xl font-bold">{profile.completedDeals}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profile.rating}
                            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="5"
                            className="w-24"
                          />
                        ) : (
                          <p className="text-2xl font-bold">{profile.rating}/5.0</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Specializations</h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={profile.specializations.join(', ')}
                          onChange={(e) => handleInputChange('specializations', e.target.value.split(',').map(s => s.trim()))}
                          placeholder="Enter specializations separated by commas"
                        />
                        <p className="text-sm text-muted-foreground">Separate specializations with commas</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.specializations.map((specialization, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {specialization}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Certifications</h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={profile.certifications.join(', ')}
                          onChange={(e) => handleInputChange('certifications', e.target.value.split(',').map(c => c.trim()))}
                          placeholder="Enter certifications separated by commas"
                        />
                        <p className="text-sm text-muted-foreground">Separate certifications with commas</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {profile.certifications.map((certification, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            <span>{certification}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Languages</h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={profile.languages.join(', ')}
                          onChange={(e) => handleInputChange('languages', e.target.value.split(',').map(l => l.trim()))}
                          placeholder="Enter languages separated by commas"
                        />
                        <p className="text-sm text-muted-foreground">Separate languages with commas</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and new password to update your account security.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handlePasswordChange} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Dialog open={is2FASetupOpen} onOpenChange={setIs2FASetupOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Shield className="mr-2 h-4 w-4" />
                          {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                          <DialogDescription>
                            Scan the QR code with your authenticator app and enter the code below.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="2faCode">Verification Code</Label>
                            <Input
                              id="2faCode"
                              value={twoFACode}
                              onChange={(e) => setTwoFACode(e.target.value)}
                              placeholder="Enter 6-digit code"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handle2FASetup} disabled={isLoading}>
                            {isLoading ? "Setting up..." : "Complete Setup"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isLoading ? "Deleting..." : "Delete Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrokerProfile; 