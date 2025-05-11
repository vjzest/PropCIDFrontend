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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(console.log);
          setIsPlaying(true);
        } else if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => videoRef.current && observer.unobserve(videoRef.current);
  }, []);

  return (
    <div className="reel-item relative h-screen w-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={reel.videoUrl}
        loop
        muted={isMuted}
        playsInline
        onClick={() => {
          if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
          }
        }}
        onDoubleClick={() => {
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
          }
        }}
      />

      {/* Play Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
            <svg
              width="32"
              height="32"
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

      {/* Right Controls */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
        <button onClick={() => setLiked(!liked)}>
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border ${liked ? "bg-green-500/20 border-green-500" : "bg-black/20 border-white/30"}`}
          >
            ❤️
          </div>
          <span className="text-white mt-1 text-sm">
            {liked ? reel.likes + 1 : reel.likes}
          </span>
        </button>
        <button onClick={() => alert("Comment feature coming soon.")}>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 border border-white/30">
            💬
          </div>
          <span className="text-white mt-1 text-sm">{reel.comments}</span>
        </button>
        <button onClick={() => alert("Share feature coming soon.")}>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 border border-white/30">
            📤
          </div>
          <span className="text-white mt-1 text-sm">Share</span>
        </button>
        <button onClick={() => setSubscribed(!subscribed)}>
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border ${subscribed ? "bg-green-500/20 border-green-500" : "bg-black/20 border-white/30"}`}
          >
            🛎️
          </div>
          <span className="text-white mt-1 text-sm">
            {subscribed ? "Subscribed" : "Subscribe"}
          </span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 w-full p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-start gap-4">
          <img
            src={reel.profileImage}
            alt="owner"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <p className="font-bold">{reel.owner}</p>
            <p className="text-sm">{reel.description}</p>
            <div className="flex items-center justify-between mt-1 text-sm text-white/80">
              <span>{reel.location}</span>
              <span className="text-yellow-400 font-semibold">
                ₹ {reel.price}
              </span>
            </div>
          </div>
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
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll scrollbar-hide bg-black">
        {reels.map((reel) => (
          <div key={reel.id} className="snap-start">
            <ReelItem reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
