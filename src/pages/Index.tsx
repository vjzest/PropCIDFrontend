import Header from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reels from '@/components/home/reel-section';
import Stories from '@/components/home/stories-section';
import PropertyFeed from '@/components/home/property-section';
import BuildersSection from '@/components/home/builder-section';
import PromotionalBanner from '@/components/PromotionalBanner';
import ProfileSection from '@/components/home/profile-section';
import NetworkSection from '@/components/home/network-section';

const Index = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto px-4 mt-6">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 w-[22%] min-w-[250px] max-w-xs sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar z-30">
            <ProfileSection />
            <NetworkSection />
          </div>
          {/* Center Content */}
          <div className="flex-1 min-w-0 py-12">
            <Stories />
            <PropertyFeed />
            <BuildersSection />
            <PromotionalBanner />
          </div>
          {/* Right Sidebar */}
          <div className="hidden lg:block w-[25%] max-w-sm sticky top-0 h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar z-30">
            <Reels />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;