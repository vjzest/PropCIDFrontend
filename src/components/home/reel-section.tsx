import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Reel {
  id: string;
  videoUrl: string;
  profileImage: string;
  owner: string;
  location: string;
  price: string;
  description: string;
  likes: number;
  comments: number;
}
const BASE_URL = "https://propb1.onrender.com";

const ReelItem = ({ reel }: { reel: Reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  return (
    <div
      className="reel-item relative bg-black rounded-xl overflow-hidden shadow-lg h-74 w-full flex flex-col"
      style={{ minWidth: "0" }}
    >
      <div
        className="relative h-2/3 w-full cursor-pointer"
        onClick={() => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current
                .play()
                .catch((error) => console.error("Error playing video:", error));
            }
            setIsPlaying(!isPlaying);
          }
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={reel.videoUrl}
          loop
          muted={isMuted}
          playsInline
        />
        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
        {/* Mute/Unmute button */}
        <button
          className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white text-xs z-10" // Added z-10
          onClick={(e) => {
            e.stopPropagation(); // Prevent video play/pause on button click
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      {/* Info and Controls */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={reel.profileImage || "/images/default-profile.png"} 
            alt={reel.owner}
            className="w-8 h-8 rounded-full border-2 border-white object-cover" 
            onError={(e) =>
              (e.currentTarget.src = "/images/default-profile.png")
            } // Fallback if image fails to load
          />
          <div className="flex-1 min-w-0">
            {" "}
            {/* Added min-w-0 for better truncation */}
            <p className="font-bold text-white text-sm truncate">
              {reel.owner}
            </p>
            <p className="text-xs text-white/80 truncate">{reel.location}</p>
          </div>
          <span className="text-yellow-400 font-semibold text-sm whitespace-nowrap">
            ₹ {reel.price}
          </span>{" "}
          {/* Added whitespace-nowrap */}
        </div>
        <p className="text-xs text-white/90 mt-1 line-clamp-2">
          {reel.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1 text-white text-xs"
          >
            <span className={`text-lg ${liked ? "text-green-400" : ""}`}>
              ❤️
            </span>{" "}
            {liked ? reel.likes + 1 : reel.likes}
          </button>
          <button
            onClick={() => alert("Comment feature coming soon.")}
            className="flex items-center gap-1 text-white text-xs"
          >
            💬 {reel.comments}
          </button>
          <button
            onClick={() => alert("Share feature coming soon.")}
            className="flex items-center gap-1 text-white text-xs"
          >
            📤 Share
          </button>
          <button
            onClick={() => setSubscribed(!subscribed)}
            className="flex items-center gap-1 text-white text-xs"
          >
            <span className={subscribed ? "text-green-400" : ""}>🛎️</span>{" "}
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReelsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/v1/property/getProperties`);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();

        if (
          json.status !== "success" ||
          !json.data ||
          !Array.isArray(json.data)
        ) {
          console.error("Invalid API response structure:", json);
          throw new Error("Invalid data format from API");
        }

        const fetchedReels: Reel[] = json.data
          .map((item: any) => ({
            id: String(item.id || Date.now() + Math.random()), 
            videoUrl: item.videos?.[0] || null,
            profileImage: item.images?.[0] || "/images/default-profile.png", 
            owner: item.owner?.name || item.owner || "Unknown Owner",             location: item.location || "Unknown Location",
            price: String(item.rate || "N/A"),
            description: item.title || "No description available.", 
            likes: Number(item.likes || 0), 
            comments: Number(item.comments || 0), 
          }))
          .filter((reel: Reel) => reel.videoUrl); 

        if (fetchedReels.length === 0) {
          console.warn(
            "No valid reels found after fetching and filtering. API might be empty or data incorrect."
          );
        }
        setReels(fetchedReels);
      } catch (err: any) {
        console.error("Error fetching reels:", err);
        setError(
          err.message || "Failed to load reels. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReelsData();
  }, []); 

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-black bg-neutral-50">
        Loading reels...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-500 bg-neutral-50 p-4 text-center">
        <p>Error loading reels:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-neutral-50 pb-8 overflow-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div
        className="max-w-sm mx-auto pt-20 px-2 flex flex-col gap-4"
        style={{ width: "350px" }}
      >
        {reels.length > 0
          ? reels.map((reel, idx) => (
              <div
                key={reel.id}
                style={{ marginBottom: (idx + 1) % 3 === 0 ? "2rem" : "1rem" }}
              >
                <ReelItem reel={reel} />
              </div>
            ))
          : !loading && (
              <div className="text-center text-gray-500 mt-10">
                No reels to display.
              </div>
            )}
      </div>
    </div>
  );
};

export default Reels;