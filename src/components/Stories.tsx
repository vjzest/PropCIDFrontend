// src/components/Stories.js (या आपका पाथ)
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://propcidback.onrender.com/story/stories";

export type StoryType = {
  id: string;
  Title: string;
  imageUrl: string;
  createdAt: number;
  profileImage?: string;
  isVideo: boolean;
  userId: string;
};
const AddStoryModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (story: StoryType) => void;
}) => {
  const [Title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, userEmail } = useAuth(); // Modal uses its own instance of auth state

  // Log when AddStoryModal's auth state is observed
  useEffect(() => {
    console.log("[AddStoryModal] Auth State Check: isAuthenticated:", isAuthenticated, "userEmail:", userEmail);
  }, [isAuthenticated, userEmail]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Crucial check: Is isAuthenticated true here when it should be?
    if (!Title || !file || !isAuthenticated || !userEmail) {
      console.warn("[AddStoryModal] Submit Validation Failed. State:", { Title: !!Title, file: !!file, isAuthenticated, userEmail });
      // Potentially show user an error message
      if (!isAuthenticated) alert("You are not logged in. Please close this and log in again.");
      return;
    }

    console.log("[AddStoryModal] Submitting story with userEmail:", userEmail);
    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("file", file);
    formData.append("email", userEmail);

    setLoading(true);
    try {
      const res = await axios.post(BASE_URL + "/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const { id, Title: storyTitle, profileImage, mediaUrl, isVideo, createdAt, email: storyUserId } = res.data;

      onAdd({
        id,
        Title: storyTitle,
        imageUrl: mediaUrl,
        profileImage,
        isVideo,
        createdAt,
        userId: storyUserId,
      });

      onClose();
    } catch (err) {
      console.error("Upload failed", err);
      // Show error to user
      alert("Story upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          aria-label="Close add story modal"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Add New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter story title"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/,video/"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// AddStoryModal END


// StoryItem START (Paste from your original code)
const StoryItem = ({
  story,
  onClick,
}: {
  story: StoryType;
  onClick: () => void;
}) => {
  const [viewed, setViewed] = useState(false);

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => {
        setViewed(true);
        onClick();
      }}
    >
      <div
        className={`w-16 h-16 rounded-full p-0.5 ${
          viewed ? "bg-gray-300" : "bg-gradient-to-tr from-blue-500 to-green-400"
        }`}
      >
        <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
          {story.isVideo ? (
            <video
              src={story.imageUrl}
              className="w-full h-full object-cover rounded-full"
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img
              src={story.imageUrl}
              alt={story.Title || "story image"}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </div>
      <span className="mt-1 text-xs text-center truncate max-w-[70px]">
        {story.Title || "User"}
      </span>
    </div>
  );
};
// StoryItem END


// StoryModal START (Paste from your original code)
const StoryModal = ({
  story,
  onClose,
  onDelete,
}: {
  story: StoryType;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const { userEmail } = useAuth();
  const canDelete = story.userId === userEmail;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black text-xl z-10 bg-white/50 hover:bg-white/80 rounded-full p-1"
          aria-label="Close story viewer"
        >
          ×
        </button>
        <div className="p-4 flex items-center border-b">
          {story.profileImage && (
            <img src={story.profileImage} className="w-10 h-10 rounded-full" alt={story.Title || "profile"} />
          )}
          <span className="ml-3 font-medium">{story.Title}</span>
        </div>
        {story.isVideo ? (
          <video
            src={story.imageUrl}
            controls
            autoPlay
            playsInline
            className="w-full max-h-[70vh] object-contain bg-black"
          />
        ) : (
          <img
            src={story.imageUrl}
            alt="story content"
            className="w-full max-h-[70vh] object-contain bg-black"
          />
        )}
        {canDelete && (
          <div className="p-4 text-center border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full py-2 text-red-500 font-semibold bg-gray-100 hover:bg-red-100 rounded"
            >
              Delete Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
// StoryModal END


const Stories = () => {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(false); // Local state for pending upload UI flow
  const scrollContainer = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, userEmail, loading: authLoading } = useAuth();

  // Log 1: Log whenever Stories component re-renders and its current auth state
  console.log(
    `[Stories RENDER] isAuthenticated: ${isAuthenticated}, userEmail: ${userEmail}, authLoading: ${authLoading}, showAddModal: ${showAddModal}, showLoginPrompt: ${showLoginPrompt}`
  );

  // Log 2: Specifically log when isAuthenticated changes
  useEffect(() => {
    console.log(`[Stories EFFECT - isAuthenticated changed] Now: ${isAuthenticated}`);
    // If user becomes authenticated, and there was a pending upload attempt, try to show the modal
    const storedPending = localStorage.getItem("pendingUpload") === "true";
    if (isAuthenticated && storedPending) {
      console.log("[Stories EFFECT] User authenticated with pending upload. Opening AddStoryModal.");
      setShowAddModal(true);
      setShowLoginPrompt(false);
      setPendingUpload(false); // Clear the component's pending state
      localStorage.removeItem("pendingUpload");
    } else if (!isAuthenticated && showAddModal) {
      // If user logs out while add modal is open (edge case)
      console.log("[Stories EFFECT] User logged out while AddStoryModal was open. Closing it.");
      setShowAddModal(false);
    }
  }, [isAuthenticated]); // Only re-run if isAuthenticated changes

  // Log 3: Specifically log when userEmail changes
  useEffect(() => {
    console.log(`[Stories EFFECT - userEmail changed] Now: ${userEmail}`);
    if (!authLoading) {
        fetchStories();
    }
  }, [userEmail, authLoading]);


  const fetchStories = async () => {
    console.log(`[Stories] fetchStories called. Current userEmail: ${userEmail}`);
    try {
      const res = await axios.get(BASE_URL, { withCredentials: true });
      const rawStories: any[] = res.data || [];
      const updatedStories = rawStories.map((story: any) => ({
        id: story.id,
        Title: story.Title,
        imageUrl: story.mediaUrl,
        profileImage: story.profileImage,
        isVideo: story.isVideo,
        createdAt: story.createdAt,
        userId: story.userId || story.email, 
      }));

      if (userEmail) {
        const userStoryIndex = updatedStories.findIndex(story => story.userId === userEmail);
        if (userStoryIndex > -1) {
          const userStory = updatedStories.splice(userStoryIndex, 1)[0];
          setStories([userStory, ...updatedStories]);
        } else {
          setStories(updatedStories);
        }
      } else {
        setStories(updatedStories);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  
  const handleAddStoryToList = (newStory: StoryType) => {
    setStories((prevStories) => [newStory, ...prevStories]);
  };

  const handleDeleteStory = async (id: string) => {
    if (!selectedStory || selectedStory.id !== id) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
      setStories((prevStories) => prevStories.filter((s) => s.id !== id));
      setSelectedStory(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddClick = () => {
    // Log 4: Log auth state AT THE MOMENT of clicking the "Add Story" button
    console.log(`[Stories handleAddClick] Clicked! Current isAuthenticated: ${isAuthenticated}`);
    if (isAuthenticated) {
      console.log("[Stories handleAddClick] User IS authenticated. Setting showAddModal=true.");
      setShowAddModal(true);
      setShowLoginPrompt(false);
      setPendingUpload(false); // Clear any pending upload state
      localStorage.removeItem("pendingUpload"); // Clear from storage
    } else {
      console.log("[Stories handleAddClick] User IS NOT authenticated. Setting up login prompt.");
      localStorage.setItem("pendingUpload", "true");
      setPendingUpload(true); // Set local state to potentially trigger other effects if needed
      setShowLoginPrompt(true);
    }
  };

  const scroll = (offset: number) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollLeft += offset;
    }
  };

  // Optional: Show a loading state for the entire Stories component while auth is loading
  if (authLoading) {
    return <div className="container mx-auto py-4 text-center">Verifying user...</div>;
  }

  return (
    <div className="w-full bg-white border-b">
      <div className="container mx-auto py-4 relative">
        <div className="flex items-center">
          {/* Scroll Buttons */}
          <button onClick={() => scroll(-200)} className="hidden sm:flex h-8 w-8 rounded-full bg-white shadow-md items-center justify-center mr-2 text-gray-600 hover:text-black" aria-label="Scroll left">←</button>
          
          <div ref={scrollContainer} className="flex overflow-x-auto scroll-smooth py-2 gap-4 scrollbar-hide">
            {/* Add Story Button */}
            <div
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
              onClick={handleAddClick} // Critical: This calls handleAddClick
              role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && handleAddClick()} aria-label="Add new story"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-green-400">
                <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center text-blue-500 text-3xl font-bold">+</div>
              </div>
              <span className="mt-1 text-xs text-center truncate max-w-[70px]">Add Story</span>
            </div>

            {/* Story Items */}
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 relative group" role="button" tabIndex={0} onClick={() => setSelectedStory(story)} onKeyPress={(e) => e.key === 'Enter' && setSelectedStory(story)} aria-label={`View story ${story.Title || 'User'}`}>
                <StoryItem story={story} onClick={() => setSelectedStory(story)} />
                {story.userId === userEmail && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white px-1 py-0.5 rounded-full text-[9px] leading-tight">You</span>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => scroll(200)} className="hidden sm:flex h-8 w-8 rounded-full bg-white shadow-md items-center justify-center ml-2 text-gray-600 hover:text-black" aria-label="Scroll right">→</button>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} onDelete={() => handleDeleteStory(selectedStory.id)} />}

      {/* Add Story Modal - Renders if showAddModal is true AND user is authenticated */}
      {/* The isAuthenticated check here is an important final gatekeeper */}
      {showAddModal && isAuthenticated && (
        <AddStoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStoryToList}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm relative shadow-xl">
            <button onClick={() => { setShowLoginPrompt(false); setPendingUpload(false); localStorage.removeItem("pendingUpload");}} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" aria-label="Close login prompt">×</button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Login Required</h2>
            <p className="text-gray-600 mb-4">Please login to add your story.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
