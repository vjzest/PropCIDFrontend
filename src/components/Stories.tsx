// src/components/Stories.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 
import { Button } from "./ui/button";
import { X } from "lucide-react";

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

// --- AddStoryModal Component ---
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
  const { isAuthenticated, userEmail } = useAuth(); 

  useEffect(() => {
    // console.log(`[AddStoryModal] Auth State Check: isAuthenticated: ${isAuthenticated}, userEmail: ${userEmail}`);
  }, [isAuthenticated, userEmail]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !userEmail) {
      console.warn("[AddStoryModal] User not authenticated or email missing.");
      alert("Authentication error. Please log in again."); 
      onClose(); 
      return;
    }
    if (!Title || !file) {
      alert("Please provide a title and a file.");
      return;
    }

    // console.log(`[AddStoryModal] Submitting story with userEmail: ${userEmail}`);
    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("file", file);
    formData.append("email", userEmail); 

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, { // Corrected URL path
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const { id, Title: storyTitle, profileImage, mediaUrl, isVideo, createdAt, email: storyUserId } = res.data;
      onAdd({ id, Title: storyTitle, imageUrl: mediaUrl, profileImage, isVideo, createdAt, userId: storyUserId });
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Story upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" aria-label="Close add story modal">×</button>
        <h2 className="text-lg font-semibold mb-4">Add New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Enter story title" value={Title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
          <input 
            type="file" 
            accept="image/*,video/*" // Corrected accept attribute
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required 
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- StoryItem Component ---
const StoryItem = ({ story, onClick, currentUserEmail }: { story: StoryType; onClick: () => void; currentUserEmail?: string; }) => {
  const [viewed, setViewed] = useState(false); 
  const isCurrentUser = currentUserEmail && story.userId === currentUserEmail;
  return (
    <div className="flex flex-col items-center cursor-pointer text-center relative" onClick={() => { setViewed(true); onClick(); }}>
      {isCurrentUser && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl-md">you</div>
      )}
      <div className={`w-16 h-16 rounded-full p-0.5 ${viewed ? "bg-gray-300" : "bg-gradient-to-tr from-blue-500 to-green-400"}`}>
        <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
          {story.imageUrl ? (
            story.isVideo ? (
              <video src={story.imageUrl} className="w-full h-full object-cover rounded-full" muted autoPlay loop playsInline />
            ) : (
              <img src={story.imageUrl} alt={story.Title || "story"} className="w-full h-full object-cover rounded-full" />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">?</div> 
          )}
        </div>
      </div>
      <span className="mt-1 text-xs truncate max-w-[60px]">{story.Title || "User"}</span>
    </div>
  );
};

// --- StoryModal Component (Viewer) ---
const StoryModal = ({ story, onClose, onDelete }: { story: StoryType; onClose: () => void; onDelete: () => void; }) => {
  const { userEmail, isAuthenticated } = useAuth();
  const canDelete = isAuthenticated && story.userId === userEmail;
  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"> 
      <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden shadow-2xl"> 
        <div className="p-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center">
                {story.profileImage && <img src={story.profileImage} className="w-8 h-8 rounded-full mr-2" alt={story.Title || "profile"} />}
                <span className="font-medium text-white text-sm">{story.Title}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close story viewer">×</button>
        </div>
        <div className="w-full aspect-[9/16] max-h-[75vh] bg-black flex items-center justify-center">
            {story.isVideo ? (
            <video src={story.imageUrl} controls autoPlay playsInline className="max-w-full max-h-full object-contain" />
            ) : (
            <img src={story.imageUrl} alt="story content" className="max-w-full max-h-full object-contain" />
            )}
        </div>
        {canDelete && (
          <div className="p-3 border-t border-gray-700 text-center">
            <Button onClick={(e) => { e.stopPropagation(); onDelete(); }} variant="destructive" size="sm" className="w-full">Delete Story</Button>
          </div>
        )}
      </div>
    </div>
  );
};


// --- Stories Component (Main) ---
const Stories = () => {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // const [pendingUpload, setPendingUpload] = useState(false); // Removed as logic is simplified
  const scrollContainer = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, userEmail, loading: authLoading } = useAuth(); 

  // Log auth state changes
  useEffect(() => {
    // console.log(`[Stories Component] Auth State Update: isAuthenticated: ${isAuthenticated}, authLoading: ${authLoading}`);
    
    // If user becomes authenticated, and there was a pending upload attempt from localStorage
    const storedPending = localStorage.getItem("pendingUpload") === "true";
    if (isAuthenticated && storedPending) {
      // console.log("[Stories EFFECT] User authenticated with pending upload. Opening AddStoryModal.");
      setShowAddModal(true);
      setShowLoginPrompt(false); // Hide login prompt if it was shown
      localStorage.removeItem("pendingUpload"); // Clear the flag
    }
    
    // If user logs out while AddStoryModal is open, close it
    if (!isAuthenticated && showAddModal) {
      // console.log("[Stories EFFECT] User logged out while AddStoryModal was open. Closing it.");
      setShowAddModal(false);
    }
  }, [isAuthenticated, authLoading, showAddModal]); // Added showAddModal dependency

  const fetchStories = async () => {
    // console.log(`[Stories] Fetching stories. UserEmail: ${userEmail}, isAuthenticated: ${isAuthenticated}`);
    try {
      const res = await axios.get(BASE_URL, { withCredentials: true });
      const rawStories: any[] = res.data || [];
      const updatedStories = rawStories.map((s: any) => ({
        id: s.id, Title: s.Title, imageUrl: s.mediaUrl, profileImage: s.profileImage,
        isVideo: s.isVideo, createdAt: s.createdAt, userId: s.userId || s.email,
      }));
      
      if (userEmail && isAuthenticated) {
        const userStoryIndex = updatedStories.findIndex(s => s.userId === userEmail);
        if (userStoryIndex > -1) {
          const userStory = updatedStories.splice(userStoryIndex, 1)[0];
          setStories([userStory, ...updatedStories]);
          return;
        }
      }
      setStories(updatedStories);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    if (!authLoading) { 
      fetchStories();
    }
  }, [userEmail, authLoading, isAuthenticated]); 

  const handleAddStoryToList = (newStory: StoryType) => {
    setStories((prev) => [newStory, ...prev]); 
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!selectedStory || selectedStory.id !== storyId) return;
    try {
      // Corrected URL for delete request
      await axios.delete(`${BASE_URL}/${storyId}`, { withCredentials: true }); 
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      setSelectedStory(null); 
    } catch (err) {
      console.error("Delete story failed:", err);
      alert("Failed to delete story.");
    }
  };

  const handleAddClick = () => {
    // console.log(`[Stories] handleAddClick: isAuthenticated: ${isAuthenticated}`);
    if (isAuthenticated) {
      setShowAddModal(true);
      setShowLoginPrompt(false);
      localStorage.removeItem("pendingUpload"); 
    } else {
      localStorage.setItem("pendingUpload", "true"); // Set flag for after login
      setShowLoginPrompt(true); 
    }
  };

  const scroll = (offset: number) => scrollContainer.current?.scrollBy({ left: offset, behavior: 'smooth' });

  if (authLoading && stories.length === 0) { 
    return <div className="w-full bg-white border-b py-4"><div className="container mx-auto text-center text-gray-500">Loading stories...</div></div>;
  }

  return (
    <div className="w-full bg-white border-b py-3">
      <div className="container mx-auto relative">
        <div className="flex items-center">
          {stories.length > 4 && <button onClick={() => scroll(-200)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 rounded-full bg-white/80 shadow-md items-center justify-center text-gray-600 hover:text-black backdrop-blur-sm" aria-label="Scroll left">←</button>}
          
          <div ref={scrollContainer} className="flex overflow-x-auto scroll-smooth py-2 gap-x-4 scrollbar-hide px-2">
            {/* Add Story Button: Now always visible, click logic handles auth */}
            <div className="flex flex-col items-center cursor-pointer flex-shrink-0 text-center" onClick={handleAddClick} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && handleAddClick()} aria-label="Add new story">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-green-400">
                    <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center text-blue-500 text-3xl font-bold hover:bg-gray-50 transition-colors">+</div>
                </div>
                <span className="mt-1 text-xs truncate max-w-[60px]">Add Story</span>
            </div>

            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0" role="button" tabIndex={0} onClick={() => setSelectedStory(story)} onKeyPress={(e) => e.key === 'Enter' && setSelectedStory(story)} 
                   aria-label={`View story ${story.Title || 'User'}`}>
                <StoryItem story={story} onClick={() => setSelectedStory(story)} currentUserEmail={userEmail} />
              </div>
            ))}
          </div>
          {stories.length > 4 && <button onClick={() => scroll(200)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 rounded-full bg-white/80 shadow-md items-center justify-center text-gray-600 hover:text-black backdrop-blur-sm" aria-label="Scroll right">→</button>}
        </div>
      </div>

      {selectedStory && <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} onDelete={() => handleDeleteStory(selectedStory.id)} />}
      
      {showAddModal && isAuthenticated && <AddStoryModal onClose={() => setShowAddModal(false)} onAdd={handleAddStoryToList} />}

      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-xs relative shadow-xl text-center">
            <button onClick={() => {
                setShowLoginPrompt(false); 
                localStorage.removeItem("pendingUpload"); // Clear if user cancels
            }} className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl" aria-label="Close login prompt">×</button>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Login Required</h2>
            <p className="text-gray-600 mb-4 text-sm">Please login to add your story.</p>
            <Button onClick={() => {
                setShowLoginPrompt(false); 
                localStorage.removeItem("pendingUpload");
                // Here you might want to trigger the actual login dialog from Navbar
                // For now, it just closes this prompt. User has to click login in Navbar.
            }} className="w-full bg-primary hover:bg-primary/80">OK</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
