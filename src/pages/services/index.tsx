import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const BASE_URL='https://propb1.onrender.com'

const SERVICES = [
  {
    id: 1,
    icon: "🏠",
    title: "Property Listing",
    description: "List your properties and reach potential buyers easily.",
    details: {
      features: ["Premium property listing", "Professional photography", "Virtual tour integration", "Detailed property analytics"],
      benefits: ["Increased visibility", "Faster sales", "Higher property value", "Targeted buyer reach"],
      pricing: "$99 per listing"
    }
  },
  {
    id: 2,
    icon: "💼",
    title: "Investment Advisory",
    description: "Get expert advice on real estate investments.",
    details: {
      features: ["Expert Consultation", "Customized Plans", "Market Analysis", "Risk Assessment"],
      benefits: ["Maximize returns", "Reduce risk", "Strategic planning", "Portfolio optimization"],
      pricing: "$199 per session"
    }
  },
  {
    id: 3,
    icon: "📸",
    title: "Property Photography",
    description: "Professional photography services to showcase your property.",
    details: {
      features: ["High-quality images", "Drone photography", "Virtual staging", "360° tours"],
      benefits: ["Better listing appeal", "Faster sales", "Higher property value", "Professional presentation"],
      pricing: "$149 per session"
    }
  },
  {
    id: 4,
    icon: "🔍",
    title: "Property Inspection",
    description: "Comprehensive property inspection services.",
    details: {
      features: ["Structural inspection", "Electrical systems check", "Plumbing assessment", "Detailed report"],
      benefits: ["Identify issues early", "Negotiation leverage", "Peace of mind", "Informed decisions"],
      pricing: "$299 per inspection"
    }
  },
  {
    id: 5,
    icon: "⚖️",
    title: "Legal Services",
    description: "Expert legal assistance for property transactions.",
    details: {
      features: ["Contract review", "Title search", "Closing assistance", "Legal documentation"],
      benefits: ["Risk mitigation", "Legal compliance", "Smooth transactions", "Professional guidance"],
      pricing: "$399 per transaction"
    }
  },
  {
    id: 6,
    icon: "🏦",
    title: "Mortgage Services",
    description: "Comprehensive mortgage and financing solutions.",
    details: {
      features: ["Loan comparison", "Pre-approval assistance", "Documentation help", "Rate negotiation"],
      benefits: ["Best rates", "Faster approval", "Lower payments", "Financial planning"],
      pricing: "Free consultation"
    }
  },
  {
    id: 7,
    icon: "🎨",
    title: "Interior Design",
    description: "Transform your space with professional design services.",
    details: {
      features: ["Space planning", "Color consultation", "Furniture selection", "Lighting design"],
      benefits: ["Enhanced aesthetics", "Better functionality", "Increased value", "Personalized style"],
      pricing: "$249 per consultation"
    }
  },
  {
    id: 8,
    icon: "🔑",
    title: "Property Management",
    description: "Professional property management services.",
    details: {
      features: ["Tenant screening", "Rent collection", "Maintenance coordination", "Financial reporting"],
      benefits: ["Passive income", "Reduced stress", "Property protection", "Time savings"],
      pricing: "8% of monthly rent"
    }
  }
];

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/property/getProperties`)
        const data = await res.json();
        console.log('Fetched properties:', data);

        setProperties(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setProperties([]);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-50 to-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12 text-neutral-800 text-center">Our Services</h1>

        {/* ✅ Static Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service) => (
            <div key={service.id}
              className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-100 h-[400px] flex flex-col">
              <div className="text-3xl mb-3">{service.icon}</div>
              <h2 className="text-xl font-bold mb-2 text-neutral-800">{service.title}</h2>
              <p className="text-neutral-600 leading-relaxed mb-3 text-sm line-clamp-2">{service.description}</p>
              
              {/* Features Preview */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-neutral-700 mb-1">Key Features:</h3>
                <ul className="space-y-0.5">
                  {service.details.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-center gap-1.5 text-sm text-neutral-600">
                      <span className="text-primary text-xs">✓</span>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits Preview */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-neutral-700 mb-1">Benefits:</h3>
                <ul className="space-y-0.5">
                  {service.details.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-1.5 text-sm text-neutral-600">
                      <span className="text-primary text-xs">✓</span>
                      <span className="line-clamp-1">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Preview */}
              <div className="bg-primary/5 p-2 rounded-lg mb-3">
                <p className="text-sm font-medium text-primary">{service.details.pricing}</p>
              </div>

              <Button
                onClick={() => setSelectedService(service)}
                className="w-full bg-primary text-white hover:bg-primary/90 text-sm py-1.5 mt-auto"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* ✅ Dynamic Property Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.length === 0 ? (
            <p className="text-center text-neutral-600 col-span-2"></p>
          ) : (
            properties.map((property) => (
              <div key={property.id}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-100">

                {/* ✅ Show first image if available */}
                {property.images && property.images.length > 0 && (
                  <img
                    src={property.images[0]}
                    alt="Property"
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}

                <h3 className="text-lg font-bold text-neutral-800 mb-2">{property.title || 'Untitled Property'}</h3>
                <p className="text-sm text-neutral-600 mb-2">Property No: {property.propertyNo}</p>
                <p className="text-sm text-neutral-600 mb-2">
                  Created On: {property.createdOn ? new Date(property.createdOn).toLocaleDateString() : "N/A"}
                </p>
                {property.price && (
                  <p className="text-primary font-medium text-sm mb-2">Price: ${property.price}</p>
                )}
                <Button className="w-full bg-primary text-white hover:bg-primary/90 text-sm py-1">
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ✅ Service Details Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{selectedService?.icon}</span>
              {selectedService?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-2">Features</h3>
                <ul className="space-y-1 text-sm">
                  {selectedService.details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-2">Benefits</h3>
                <ul className="space-y-1 text-sm">
                  {selectedService.details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg">
                <h3 className="text-base font-semibold mb-1">Pricing</h3>
                <p className="text-primary font-medium text-sm">{selectedService.details.pricing}</p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setSelectedService(null)}
                  variant="outline"
                  className="text-sm py-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ServicesPage;
