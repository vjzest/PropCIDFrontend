"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BASE_URL = "https://propcidback.onrender.com/story/stories";

export type StoryType = {
  id: string;
  Title: string;
  imageUrl: string;
  createdAt: number;
  profileImage?: string;
  isVideo: boolean;
};

const AddStoryModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (story: StoryType) => void;
}) => {
  const [Title, setTitle] = useState("");
  const [file, setfile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Title || !file) return;

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("file", file); // ✅ must match backend multer field

    setLoading(true);

    try {
      const res = await axios.post(BASE_URL + "/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { id, Title, profileImage, mediaUrl, isVideo, createdAt } =
        res.data;

      onAdd({
        id,
        Title,
        imageUrl: mediaUrl,
        profileImage,
        isVideo,
        createdAt,
      });

      onClose();
    } catch (err) {
      console.error("Upload failed", err);
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
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add New Story</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setfile(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`}
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
        className={`w-16 h-16 rounded-full p-0.5 ${viewed ? "bg-gray-300" : "bg-gradient-to-tr from-blue-500 to-green-400"}`}
      >
        <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
          {story.isVideo ? (
            <video
              src={story.imageUrl}
              className="w-full h-full object-cover rounded-full"
              muted
              autoPlay
              loop
            />
          ) : (
            <img
              src={story.imageUrl}
              alt={story.Title || "user"}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </div>
      <span className="mt-1 text-xs text-center truncate max-w-[70px]">
        {story.Title || "Unknown"}
      </span>
    </div>
  );
};

const StoryModal = ({
  story,
  onClose,
  onDelete,
}: {
  story: StoryType;
  onClose: () => void;
  onDelete: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
    <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-black text-xl z-10"
      >
        &times;
      </button>
      <div className="p-4 flex items-center">
        {story.profileImage && (
          <img src={story.profileImage} className="w-10 h-10 rounded-full" />
        )}
        <span className="ml-3 font-medium">{story.Title}</span>
      </div>
      {story.isVideo ? (
        <video
          src={story.imageUrl}
          controls
          className="w-full max-h-[70vh] object-cover"
        />
      ) : (
        <img
          src={story.imageUrl}
          alt="story"
          className="w-full max-h-[70vh] object-cover"
        />
      )}
      <div className="p-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-full py-2 text-red-500 font-semibold bg-gray-200 rounded"
        >
          Delete Story
        </button>
      </div>
    </div>
  </div>
);

const Stories = () => {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(BASE_URL);
        const updated = res.data.map((story: any) => ({
          id: story.id,
          Title: story.Title,
          imageUrl: story.mediaUrl,
          profileImage: story.profileImage,
          isVideo: story.isVideo,
          createdAt: story.createdAt,
        }));
        setStories(updated);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };
    fetchStories();
  }, []);

  const handleAddStory = (newStory: StoryType) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await axios.delete(`${BASE_URL}/${storyId}`);
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      setSelectedStory(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const scroll = (offset: number) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollLeft += offset;
    }
  };

  return (
    <div className="w-full bg-white border-b">
      <div className="container mx-auto py-4 relative">
        <div className="flex items-center">
          <button
            onClick={() => scroll(-200)}
            className="hidden sm:flex h-8 w-8 rounded-full bg-white shadow-md items-center justify-center mr-2"
          >
            ←
          </button>

          <div
            ref={scrollContainer}
            className="flex overflow-x-auto scroll-smooth py-2 gap-4 scrollbar-hide"
          >
            <div
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
              onClick={() => setShowAddModal(true)}
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-green-400">
                <div className="bg-white p-0.5 rounded-full w-full h-full flex items-center justify-center text-blue-500 text-3xl font-bold">
                  +
                </div>
              </div>
              <span className="mt-1 text-xs text-center truncate max-w-[70px]">
                Add Story
              </span>
            </div>

            {stories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0"
                onClick={() => setSelectedStory(story)}
              >
                <StoryItem
                  story={story}
                  onClick={() => setSelectedStory(story)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(200)}
            className="hidden sm:flex h-8 w-8 rounded-full bg-white shadow-md items-center justify-center ml-2"
          >
            →
          </button>
        </div>
      </div>

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onDelete={() => handleDeleteStory(selectedStory.id)}
        />
      )}

      {showAddModal && (
        <AddStoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStory}
        />
      )}
    </div>
  );
};

export default Stories;
