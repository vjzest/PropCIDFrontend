import React from "react";

interface BrokerProfileSummary {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  companyName?: string;
}

const ProfileSection = ({ profile }: { profile: BrokerProfileSummary }) => {
  const displayInitial = profile?.name?.[0]?.toUpperCase() || "?";

  const handleNavigateToProfile = () => {
    window.location.href = "/broker/profile";
  };

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
