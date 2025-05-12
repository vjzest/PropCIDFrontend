import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BUILDER_CATEGORIES = [
  { id: 1, name: "Luxury", icon: "🏰" },
  { id: 2, name: "Residential", icon: "🏠" },
  { id: 3, name: "Commercial", icon: "🏢" },
  { id: 4, name: "Eco-Friendly", icon: "🌱" },
  { id: 5, name: "Modern", icon: "🏗️" },
];
const BASE_URL = "https://propb1.onrender.com";

interface Builder {
  id: number;
  name: string;
  image: string;
  projects: number;
  rating: number;
  category: string;
  experience: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  specialties: string[];
  certifications: string[];
  about: string;
  currentProjects: number;
  completedProjects: number;
  averageProjectSize: string;
  totalValueBuilt: string;
  teamSize?: number;
}

const BuilderCard = ({ builder }: { builder: Builder }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    localStorage.setItem(
      "contactData",
      JSON.stringify({
        type: "builder",
        id: builder.id,
        name: builder.name,
        email: builder.email,
        phone: builder.phone,
        location: builder.location,
        image: builder.image,
      })
    );
    navigate("/contact");
  };

  const handleViewProfile = () => {
    // Store builder profile data in localStorage for the profile page
    localStorage.setItem('profileData', JSON.stringify({
      type: 'builder',
      id: builder.id,
      name: builder.name,
      email: builder.email,
      image: builder.image,
      category: builder.category || 'Builder',
      experience: builder.experience || 'Not specified',
      location: builder.location || 'Not specified',
      phone: builder.phone || 'Not specified',
      website: builder.website || 'Not specified',
      about: builder.about || 'No description available',
      projects: builder.projects || '0',
      rating: builder.rating || '0',
      teamSize: builder.teamSize || '0',
      completedProjects: builder.completedProjects || '0',
      currentProjects: builder.currentProjects || '0',
      specialties: builder.specialties || [],
      certifications: builder.certifications || []
    }));
    navigate(`/builders/${builder.id}`);
  };

  const renderProfileImage = builder.image ? (
    <img
      src={builder.image}
      alt={builder.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
      {builder.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
            {renderProfileImage}
          </div>
          <div>
            <h3 className="font-bold">{builder.name}</h3>
            <span className="text-xs py-0.5 px-2 bg-neutral-100 rounded-full">
              {builder.category}
            </span>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex justify-between text-sm mt-3">
            <div>
              <p className="text-neutral-600">Projects</p>
              <p className="font-medium">{builder.projects}</p>
            </div>
            <div>
              <p className="text-neutral-600">Rating</p>
              <p className="font-medium flex items-center">
                <span className="mr-1">{builder.rating}</span>
                <span className="text-yellow-500">★</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={handleContact}>
                Contact
              </Button>
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
        ) : (
          <div className="text-sm text-neutral-600 text-center mt-3">
            Sign in to view builder details and contact information
          </div>
        )}
      </div>
    </div>
  );
};

const BuilderCategoryItem = ({
  category,
}: {
  category: (typeof BUILDER_CATEGORIES)[0];
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-2 text-xl">
        {category.icon}
      </div>
      <span className="text-sm">{category.name}</span>
    </div>
  );
};

const BuildersSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [builders, setBuilders] = useState<Builder[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/user`);
        if (res.data?.user?.type === "builder") {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchBuilders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/user`);
        if (Array.isArray(res.data.users)) {
          const filteredBuilders = res.data.users
            .filter((user: any) => user.userType === "builder")
            .slice(0, 4); // only first 4
          setBuilders(filteredBuilders);
        } else {
          console.error("Builder API did not return an array:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch builders:", error);
      }
    };

    fetchUser();
    fetchBuilders();
  }, []);

  return (
    <section className="mb-12">
      <h2 className="section-title">Top Builders</h2>

      {user && (
        <div
          className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/builder-profile")}
        >
          {user.userProfile ? (
            <img
              src={user.userProfile}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="text-xs text-blue-600 font-medium uppercase">
              {user.type}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Builders Banner"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between overflow-x-auto py-2 -mx-2 px-2 gap-4">
            {BUILDER_CATEGORIES.map((category) => (
              <BuilderCategoryItem key={category.id} category={category} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {builders.length > 0 ? (
              builders.map((builder) => (
                <BuilderCard key={builder.id} builder={builder} />
              ))
            ) : (
              <p className="text-gray-500">No builders found.</p>
            )}
          </div>

          <div className="text-center pt-2">
            <Button
              variant="outline"
              onClick={() => navigate("/all-builders")}
              style={{ background: "blue", color: "white" }}
              className="w-full md:w-auto"
            >
              View All Builders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildersSection;
