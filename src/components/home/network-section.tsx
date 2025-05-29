import React, { useState, useEffect } from "react";
import { getAuth, User as FirebaseUser } from "firebase/auth";
import axios from "axios";

const BASE_URL = "https://propb1.onrender.com";

// Mock data (can be replaced with API data later)
const mockFollowedUsersData = [
  {
    id: 1,
    name: "Amit Sharma",
    profileImage: "/images/profile2.png", // Assume this path is valid or leads to an image
    // profileImage: "https://broken-image-link.com/profile2.png", // For testing onError
    // profileImage: "", // For testing no image
    role: "Investor",
  },
  {
    id: 2,
    name: "Priya Singh",
    profileImage: "/images/profile3.png",
    role: "Agent",
  },
];

const mockSuggestionsData = [
  {
    id: 3,
    name: "Rahul Verma",
    profileImage: "/images/profile4.png",
    role: "Broker",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    // profileImage: "", // Test case for no image
    profileImage: "/images/profile5.png",
    role: "Investor",
  },
];

interface User {
  id: number;
  name: string;
  profileImage?: string; // Made profileImage optional to better reflect real-world data
  role: string;
}

const UserCard = ({
  user,
  isFollowing,
  onFollow,
}: {
  user: User;
  isFollowing?: boolean;
  onFollow?: () => void;
}) => {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Get the first letter of the name, or '?' if name is empty/undefined
  const displayInitial = user.name?.[0]?.toUpperCase() || "?";

  // Reset imageLoadFailed when the user prop changes (e.g., in a list)
  useEffect(() => {
    setImageLoadFailed(false);
  }, [user.profileImage, user.id]); // Depend on profileImage and id to reset

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow p-3">
      {user.profileImage && !imageLoadFailed ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border"
          onError={() => setImageLoadFailed(true)} // Set state on error
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-semibold border">
          {/* You can customize the background/text color for initials */}
          {displayInitial}
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-neutral-900">{user.name}</div>
        <div className="text-xs text-neutral-500">{user.role}</div>
      </div>
      {isFollowing !== undefined && (
        <button
          className={`px-3 py-1 rounded text-xs font-semibold transition ${isFollowing ? "bg-neutral-200 text-neutral-600" : "bg-primary text-white hover:bg-primary/90"}`}
          onClick={onFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

const NetworkSection = () => {
  const [search, setSearch] = useState("");
  // Ensure your state types match the User interface with optional profileImage
  const [followed, setFollowed] = useState<User[]>(mockFollowedUsersData);
  const [suggestions, setSuggestions] = useState<User[]>(mockSuggestionsData);

  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const checkBrokerStatus = async (user: FirebaseUser | null) => {
      if (user) {
        try {
          await axios.get(`${BASE_URL}/builder/${user.uid}`);
          setIsBrokerLoggedIn(true);
        } catch (error) {
          console.warn(
            "NetworkSection: User logged in, but not verified as broker/builder or API error:",
            error
          );
          setIsBrokerLoggedIn(false);
        }
      } else {
        setIsBrokerLoggedIn(false);
      }
      setIsLoadingAuth(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoadingAuth(true);
      checkBrokerStatus(user);
    });

    checkBrokerStatus(auth.currentUser);

    return () => unsubscribe();
  }, [auth]);

  const filteredFollowed = followed.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = suggestions.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleFollow = (userToFollow: User) => {
    setFollowed([...followed, userToFollow]);
    setSuggestions(suggestions.filter((u) => u.id !== userToFollow.id));
  };

  if (isLoadingAuth) {
    return (
      <div className="bg-neutral-50 p-6 rounded-xl shadow-md max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
        <div className="mb-8">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-3"></div>
          <div className="h-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isBrokerLoggedIn) {
    return null;
  }

  return (
    <div className="bg-neutral-50 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-neutral-800">My Network</h2>
      <input
        type="text"
        placeholder="Search users by name or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3 text-neutral-700">
          Following
        </h3>
        {filteredFollowed.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredFollowed.map((user) => (
              <UserCard key={user.id} user={user} isFollowing />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm p-3 bg-white rounded-lg shadow">
            {search
              ? `No users found for "${search}" in your followed list.`
              : "You are not following anyone yet."}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-3 text-neutral-700">
          Suggestions
        </h3>
        {filteredSuggestions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredSuggestions.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFollowing={false}
                onFollow={() => handleFollow(user)}
              />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm p-3 bg-white rounded-lg shadow">
            {search
              ? `No suggestions found for "${search}".`
              : "No new suggestions at the moment."}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkSection;
