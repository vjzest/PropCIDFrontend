import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

// Broker categories to filter by
const CATEGORIES = [
  "All",
  "Luxury",
  "Residential",
  "Commercial",
  "International",
];
const BASE_URL = "https://propb1.onrender.com";

const BrokerCard = ({ broker }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  const handleViewProfile = () => {
    // Store builder profile data in localStorage for the profile page
    localStorage.setItem(
      "profileData",
      JSON.stringify({
        type: "builder",
        id: broker.id,
        name: broker.name,
        email: broker.email,
        companyName: broker.companyName || "Not specified",
        registrationNumber: broker.registrationNumber || "Not specified",
        createdAt: broker.createdAt,
        profileImage: broker.profileImage,
        category: broker.category || "Builder",
        experience: broker.experience || "Not specified",
        location: broker.location || "Not specified",
        phone: broker.phone || "Not specified",
        website: broker.website || "Not specified",
        about: broker.about || "No description available",
        completedProjects: broker.completedProjects || "0",
        activeProjects: broker.activeProjects || "0",
        totalRevenue: broker.totalRevenue || "0",
        specialties: broker.specialties || [],
        certifications: broker.certifications || [],
        teamSize: broker.teamSize || "0",
        awards: broker.awards || []
      })
    );
    navigate(`/builders/${broker.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            {broker.profileImage ? (
              <img
                src={broker.profileImage}
                alt={broker.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show the first letter
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                      ${broker.name.charAt(0).toUpperCase()}
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                {broker.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold">{broker.name}</h3>
            <span className="text-xs py-0.5 px-2 bg-neutral-100 rounded-full">
              {broker.category || "Builder"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-neutral-600 text-xs">Location</p>
            <p className="font-medium text-sm">{broker.location || "Not specified"}</p>
          </div>
          <div>
            <p className="text-neutral-600 text-xs">Experience</p>
            <p className="font-medium text-sm">{broker.experience || "Not specified"}</p>
          </div>
          {isAuthenticated && (
            <>
              <div>
                <p className="text-neutral-600 text-xs">Completed Projects</p>
                <p className="font-medium text-sm">{broker.completedProjects || "0"}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-xs">Active Projects</p>
                <p className="font-medium text-sm">{broker.activeProjects || "0"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-neutral-600 text-xs">Specialties</p>
                <p className="font-medium text-sm">
                  {broker.specialties?.join(", ") || "Not specified"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            style={{ background: "blue", color: "white" }}
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

const AllBrokers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [brokers, setBrokers] = useState<any[]>([]);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch broker data from API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/user`);
        const data = await response.json();

        // Log the data to check its structure
        console.log("API Response:", data);

        // Access the 'users' field and check if it's an array
        if (Array.isArray(data.users)) {
          const brokerData = data.users.filter(
            (user: any) => user.userType === "builder"
          );
          setBrokers(brokerData);
        } else {
          console.error(
            'API response does not contain a valid "users" array:',
            data
          );
          // Optionally, handle cases when the response is not in the expected format
        }
      } catch (error) {
        console.error("Error fetching broker data:", error);
      }
    };

    fetchBrokers();
  }, []);

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch =
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || broker.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">All Brokers</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search brokers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md p-2"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrokers.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllBrokers;
