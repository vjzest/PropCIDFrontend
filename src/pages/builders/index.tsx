import { Outlet } from 'react-router-dom';
import AdminUserNavbar from '@/components/AdminUserNavbar';

const BUILDERS = [
  {
    id: 1,
    name: 'Elite Construction',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    projects: 48,
    rating: 4.8,
    category: 'Luxury',
    completedValue: '$250M',
    ongoingProjects: 5
  },
  {
    id: 2,
    name: 'Green Homes',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    projects: 36,
    rating: 4.7,
    category: 'Eco-Friendly',
    completedValue: '$180M',
    ongoingProjects: 3
  },
  {
    id: 3,
    name: 'Modern Designs',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
    projects: 52,
    rating: 4.9,
    category: 'Modern',
    completedValue: '$320M',
    ongoingProjects: 7
  }
];

const BuildersPage = () => {
  return (
    <AdminUserNavbar userType="builder">
      <Outlet />
    </AdminUserNavbar>
  );
};

export default BuildersPage;
