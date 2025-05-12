import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Award,
  Star,
  Calendar,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ViewBuilder = () => {
  const { id } = useParams();
  const [builder, setBuilder] = useState<any>(null);

  useEffect(() => {
    // Get builder data from localStorage
    const profileData = localStorage.getItem("profileData");
    if (profileData) {
      setBuilder(JSON.parse(profileData));
    }
  }, [id]);

  if (!builder) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Builder Information Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
                    {builder.profileImage ? (
                      <img
                        src={builder.profileImage}
                        alt={builder.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show the first letter
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                      ${builder.name.charAt(0).toUpperCase()}
                    </div>
                  `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                        {builder.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{builder.name}</CardTitle>
                    <Badge className="mt-2">{builder.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{builder.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{builder.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{builder.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={`https://${builder.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {builder.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{builder.rating} Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Builder Details Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>About {builder.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-600">{builder.about}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{builder.experience}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Team Size</p>
                      <p className="font-medium">{builder.teamSize} Members</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Completed Projects
                      </p>
                      <p className="font-medium">{builder.completedProjects}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Current Projects</p>
                      <p className="font-medium">{builder.currentProjects}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {builder.specialties.map(
                        (specialty: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {builder.certifications.map(
                        (certification: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Award className="h-3 w-3" />
                            {certification}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Average Project Size
                      </p>
                      <p className="font-medium">
                        {builder.averageProjectSize}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Total Value Built</p>
                      <p className="font-medium">{builder.totalValueBuilt}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ViewBuilder;
