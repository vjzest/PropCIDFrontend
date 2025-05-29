import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, User as FirebaseUser } from "firebase/auth"; // Import FirebaseUser
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://propb1.onrender.com";

interface BrokerProfileSummary {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  companyName?: string;
}

const ProfileSection = () => {
  const [profile, setProfile] = useState<BrokerProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrokerProfile = async (currentUser: FirebaseUser) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<{
          name: string;
          email: string;
          profileImage?: string;
          companyName?: string;
        }>(`${BASE_URL}/builder/${currentUser.uid}`);

        setProfile({
          uid: currentUser.uid,
          name: data.name || "Broker User", // Fallback name
          email: data.email,
          profileImage: data.profileImage,
          companyName: data.companyName,
        });
      } catch (error) {
        console.error("Failed to load broker profile summary:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchBrokerProfile(user);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    if (auth.currentUser) {
      fetchBrokerProfile(auth.currentUser);
    } else {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, [auth]);

  const handleNavigateToProfile = () => {
    navigate("/broker/profile");
  };

  const displayInitial = profile?.name?.[0]?.toUpperCase() || "?";

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 w-full animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-300"></div>
          <div className="text-center w-full">
            <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="bg-gray-300 h-8 rounded w-full mt-2"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 w-full">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary"
            onError={(e) => {
              e.currentTarget.style.display = "none"; // Hide broken image
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold border-2 border-primary">
            {displayInitial}
          </div>
        )}
        <div className="text-center w-full">
          <h2 className="font-bold text-lg text-neutral-900">{profile.name}</h2>
          <p className="text-sm text-neutral-600">{profile.email}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {profile.companyName || "Property Agent"}
          </p>
        </div>
        <button
          onClick={handleNavigateToProfile}
          className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-primary/90 transition mt-2 w-full"
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
