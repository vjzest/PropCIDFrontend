"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function CreatePropertyForm() {
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    status: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    propertyType: "",
    amenities: "",
    section: "",
    UserName: "",
    owner: "", // Added owner field
    phoneNumber: "", // Added phone number field
    address: "", // Added address field
    builtInYear: "", // Added built-in year field
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const formData = new FormData();

    for (const key in form) {
      formData.append(key, form[key as keyof typeof form]);
    }

    images.forEach((img) => formData.append("images", img));
    videos.forEach((vid) => formData.append("videos", vid));

    try {
      const res = await fetch("http://localhost:4000/v1/property/newProperty", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Success", description: "Property created successfully." });
        setForm({
          title: "",
          location: "",
          price: "",
          description: "",
          status: "",
          bedrooms: "",
          bathrooms: "",
          area: "",
          propertyType: "",
          amenities: "",
          section: "",
          UserName: "",
          owner: "", // Reset owner field
          phoneNumber: "", // Reset phone number field
          address: "", // Reset address field
          builtInYear: "", // Reset built-in year field
        });
        setImages([]);
        setVideos([]);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create property.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-md w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Property</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input type="text" name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input type="number" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input type="number" name="area" value={form.area} onChange={handleChange} required />
            </div>
            <div>
              <Label>Property Type</Label>
              <Select value={form.propertyType} onValueChange={(val) => setForm({ ...form, propertyType: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section (Uploaded By)</Label>
              <Select value={form.section} onValueChange={(val) => setForm({ ...form, section: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="UserName">Uploader's Name</Label>
              <Input
                type="text"
                name="UserName"
                value={form.UserName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input type="text" name="owner" value={form.owner} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input type="text" name="address" value={form.address} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="builtInYear">Built-In Year</Label>
              <Input
                type="number"
                name="builtInYear"
                value={form.builtInYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              type="text"
              name="amenities"
              placeholder="e.g. Pool, Gym, Parking"
              value={form.amenities}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Upload Images</Label>
              <Input type="file" name="images" multiple accept="image/*" onChange={handleImagesChange} />
              <p className="text-sm text-muted-foreground">{images.length} image(s) selected</p>
            </div>

            <div>
              <Label>Upload Videos</Label>
              <Input type="file" name="videos" multiple accept="video/*" onChange={handleVideosChange} />
              <p className="text-sm text-muted-foreground">{videos.length} video(s) selected</p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Create Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
