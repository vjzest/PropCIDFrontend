import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
const BASE_URL = "https://propcidback.onrender.com";

interface Property {
  _id: string;
  title: string;
  images: string;
  image?: string;
  price: string;
  location: string;
  ownerName: string;
  ownerImage?: string;
  beds?: number;
  baths?: number;
  area?: number;
  features?: string[];
  description?: string;
  address?: string;
  contactNumber?: string;
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_URL}/v1/property/getProperties`
        );
        const data = response.data?.data || [];

        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties. Please try again later.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="w-[70%] mx-auto">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Discover Your Dream Property
          </h1>
          <p className="text-lg text-neutral-600">
            Explore our extensive collection of premium properties
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8">
            <p>No properties found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
