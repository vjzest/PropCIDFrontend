import { Outlet } from 'react-router-dom';
import AdminUserNavbar from '@/components/AdminUserNavbar';

// Reusing the brokers data from BrokersSection
const BROKERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    sales: '$48M',
    rating: 4.9,
    category: 'Luxury',
    specialization: 'High-end residential properties',
    experience: '12 years'
  },
  {
    id: 2,
    name: 'Michael Zhang',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    sales: '$36M',
    rating: 4.7,
    category: 'Residential',
    specialization: 'Family homes',
    experience: '8 years'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    image: 'https://randomuser.me/api/portraits/women/58.jpg',
    sales: '$52M',
    rating: 4.8,
    category: 'International',
    specialization: 'Luxury condos',
    experience: '15 years'
  }
];

const BrokersPage = () => {
  return (
    <AdminUserNavbar userType="broker">
      <Outlet />
    </AdminUserNavbar>
  );
};

export default BrokersPage;
