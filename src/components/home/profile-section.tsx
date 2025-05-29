const mockProfile = {
  name: 'Nikhil Chaudhary',
  email: 'nikhil@example.com',
  profileImage: '/images/profile1.png',
  role: 'Property Agent',
};

const ProfileSection = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 w-full">
        <img
          src={mockProfile.profileImage}
          alt={mockProfile.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-primary"
        />
        <div className="text-center w-full">
          <h2 className="font-bold text-lg text-neutral-900">{mockProfile.name}</h2>
          <p className="text-sm text-neutral-600">{mockProfile.email}</p>
          <p className="text-xs text-neutral-500 mt-1">{mockProfile.role}</p>
        </div>
        <button className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-primary/90 transition mt-2 w-full">Profile</button>
      </div>
    </div>
  );
};

export default ProfileSection;