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
    <div className="reel-item relative bg-black rounded-xl overflow-hidden shadow-lg h-80 flex flex-col">
      <div className="relative h-2/3 w-full cursor-pointer" onClick={() => {
        if (videoRef.current) {
          isPlaying ? videoRef.current.pause() : videoRef.current.play();
          setIsPlaying(!isPlaying);
        }
      }}>
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
        {/* Mute/Unmute on double click */}
        <button
          className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white text-xs"
          onClick={e => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      {/* Info and Controls */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={reel.profileImage}
            alt="owner"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div className="flex-1">
            <p className="font-bold text-white text-sm truncate">{reel.owner}</p>
            <p className="text-xs text-white/80 truncate">{reel.location}</p>
          </div>
          <span className="text-yellow-400 font-semibold text-sm">₹ {reel.price}</span>
        </div>
        <p className="text-xs text-white/90 mt-1 line-clamp-2">{reel.description}</p>
        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 text-white text-xs">
            <span className={`text-lg ${liked ? 'text-green-400' : ''}`}>❤️</span> {liked ? reel.likes + 1 : reel.likes}
          </button>
          <button onClick={() => alert('Comment feature coming soon.')} className="flex items-center gap-1 text-white text-xs">
            💬 {reel.comments}
          </button>
          <button onClick={() => alert('Share feature coming soon.')} className="flex items-center gap-1 text-white text-xs">
            📤 Share
          </button>
          <button onClick={() => setSubscribed(!subscribed)} className="flex items-center gap-1 text-white text-xs">
            <span className={subscribed ? 'text-green-400' : ''}>🛎️</span> {subscribed ? 'Subscribed' : 'Subscribe'}
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
    const fetchReels = async () => {
      try {
        const res = await fetch(`${BASE_URL}/v1/property/getProperties`);
        const json = await res.json();

        if (json.status !== "success" || !json.data)
          throw new Error("Invalid response");

        const fetched = json.data
          .map((item: any) => ({
            id: item.id,
            videoUrl: item.videos?.[0] || "",
            profileImage: item.images?.[0] || "/images/default.png",
            owner: item.owner || "Unknown",
            location: item.location || "Unknown",
            price: item.rate || "N/A",
            description: item.title || "",
            likes: item.likes || 0,
            comments: item.comments || 0,
          }))
          .filter((r: Reel) => r.videoUrl);

        setReels(fetched);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load reels");
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading reels...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 bg-black">
        {error}
      </div>
    );

  return (
    <div className="relative min-h-screen bg-black pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="max-w-5xl mx-auto pt-20 px-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <ReelItem key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};

export default Reels;
