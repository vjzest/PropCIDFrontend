import React, { useEffect, useState } from 'react';
import Header from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reels from '@/components/home/reel-section';
import Stories from '@/components/home/stories-section';
import PropertyFeed from '@/components/home/property-section';
import BuildersSection from '@/components/home/builder-section';
import PromotionalBanner from '@/components/PromotionalBanner';
import ProfileSection from '@/components/home/profile-section';
import NetworkSection from '@/components/home/network-section';
import axios from 'axios';
import { getAuth, User as FirebaseUser } from 'firebase/auth';

const BASE_URL = "https://propb1.onrender.com";

const Index = () => {
  const [hasBrokerProfile, setHasBrokerProfile] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const auth = getAuth();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType) {
      setIsAuthenticated(true);
      const fetchBrokerProfile = async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const { data } = await axios.get(`${BASE_URL}/builder/${user.uid}`);
            if (data && data.name && data.email) {
              setHasBrokerProfile(true);
              setProfile({
                uid: user.uid,
                name: data.name,
                email: data.email,
                profileImage: data.profileImage,
                companyName: data.companyName,
              });
            } else {
              setHasBrokerProfile(false);
              setProfile(null);
            }
          } else {
            setHasBrokerProfile(false);
            setProfile(null);
          }
        } catch (error) {
          setHasBrokerProfile(false);
          setProfile(null);
        }
      };
      fetchBrokerProfile();
    } else {
      setIsAuthenticated(false);
      setHasBrokerProfile(false);
      setProfile(null);
    }
  }, [auth]);

  return (
    <div>
      <Header />
      <div className="mx-auto px-4 mt-6">
        <div className="flex gap-8">
          {/* Left Sidebar (only if logged in AND broker profile exists) */}
          {isAuthenticated && hasBrokerProfile ? (
            <div className="hidden lg:flex flex-col gap-4 w-[22%] min-w-[250px] max-w-xs sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar z-30">
              <ProfileSection profile={profile} />
              <NetworkSection />
            </div>
          ) : null}
          {/* Center Content */}
          <div className={`flex-1 min-w-0 py-12 ${!isAuthenticated || !hasBrokerProfile ? 'max-w-4xl mx-auto' : ''}`}>
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