import { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Stories from '@/components/Stories';
import Reels from '@/components/Reels';
import PropertyFeed from '@/components/PropertyFeed';
import BuildersSection from '@/components/BuildersSection';
import BrokersSection from '@/components/BrokersSection';
import PromotionalBanner from '@/components/PromotionalBanner';
import DocumentUpload from '@/components/DocumentUpload';
import Footer from '@/components/Footer';

const Index = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Adjust padding for fixed navbar
    const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
    if (mainContentRef.current) {
      mainContentRef.current.style.paddingTop = `${navbarHeight}px`;
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Left Column: Navigation, scrollable content, and footer */}
      <div className="w-full lg:w-[70%] flex flex-col relative z-10">
        <div className="w-[70%] mx-auto">
          <Navbar />
        </div>
        
        <div className="pt-14 flex-1">
          {/* Stories section - only on the left side */}
          <div className="container mx-auto px-4">
            <Stories />
          </div>
          
          {/* Main scrollable content */}
          <div 
            ref={mainContentRef}
            className="container mx-auto px-4 py-8"
          >
            <PropertyFeed />
            <BuildersSection />
            <BrokersSection />
            <PromotionalBanner />
            <DocumentUpload />
          </div>
        </div>
        
        {/* Footer - only on the left side */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
      
      {/* Right Column: Fixed reels panel (covers entire right side) - Only visible on desktop */}
      <div className="hidden lg:block lg:w-[30%] h-screen fixed right-0 top-0 z-0">
        <Reels />
      </div>
    </div>
  );
};

export default Index;
