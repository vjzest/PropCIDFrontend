import React, { useState } from 'react';

const mockFollowedUsers = [
  {
    id: 1,
    name: 'Amit Sharma',
    profileImage: '/images/profile2.png',
    role: 'Investor',
  },
  {
    id: 2,
    name: 'Priya Singh',
    profileImage: '/images/profile3.png',
    role: 'Agent',
  },
];

const mockSuggestions = [
  {
    id: 3,
    name: 'Rahul Verma',
    profileImage: '/images/profile4.png',
    role: 'Broker',
  },
  {
    id: 4,
    name: 'Sneha Kapoor',
    profileImage: '/images/profile5.png',
    role: 'Investor',
  },
];

const UserCard = ({ user, isFollowing, onFollow }: { user: any; isFollowing?: boolean; onFollow?: () => void }) => (
  <div className="flex items-center gap-3 bg-white rounded-lg shadow p-3">
    <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
    <div className="flex-1">
      <div className="font-semibold text-neutral-900">{user.name}</div>
      <div className="text-xs text-neutral-500">{user.role}</div>
    </div>
    {isFollowing !== undefined && (
      <button
        className={`px-3 py-1 rounded text-xs font-semibold transition ${isFollowing ? 'bg-neutral-200 text-neutral-600' : 'bg-primary text-white hover:bg-primary/90'}`}
        onClick={onFollow}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    )}
  </div>
);

const NetworkSection = () => {
  const [search, setSearch] = useState('');
  const [followed, setFollowed] = useState(mockFollowedUsers);
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  // Filter users based on search
  const filteredFollowed = followed.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = suggestions.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Handle follow/unfollow
  const handleFollow = (user: any) => {
    setFollowed([...followed, user]);
    setSuggestions(suggestions.filter(u => u.id !== user.id));
  };

  return (
    <div className="bg-neutral-50 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Network</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Following</h3>
        {filteredFollowed.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredFollowed.map(user => (
              <UserCard key={user.id} user={user} isFollowing />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">No users found.</div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-3">Suggestions</h3>
        {filteredSuggestions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredSuggestions.map(user => (
              <UserCard key={user.id} user={user} isFollowing={false} onFollow={() => handleFollow(user)} />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">No suggestions found.</div>
        )}
      </div>
    </div>
  );
};

export default NetworkSection;