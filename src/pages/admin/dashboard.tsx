import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Briefcase, 
  Home, 
  Users, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const BASE_URL = 'https://propb1.onrender.com';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyCount, setPropertyCount] = useState(0);
  const [userCounts, setUserCounts] = useState({
    totalUsers: 0,
    builders: 0,
    brokers: 0,
    enquiries: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property count
        const propertyResponse = await axios.get(`${BASE_URL}/v1/property/getProperties`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Property Response:', propertyResponse.data);
        const properties = propertyResponse.data.data || [];
        setPropertyCount(properties.length);

        // Fetch user data
        const userResponse = await axios.get(`${BASE_URL}/api/auth/user`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('User Response:', userResponse.data);
        const users = userResponse.data.users || [];
        console.log('Users Array:', users);

        // Fetch contact data
        const contactResponse = await axios.get(`${BASE_URL}/contact/data`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Full Contact Response:', contactResponse);
        console.log('Contact Response Data:', contactResponse.data);
        console.log('Contact Response Data Type:', typeof contactResponse.data);
        console.log('Contact Response Keys:', Object.keys(contactResponse.data));
        
        // Try different possible data structures
        const contacts = contactResponse.data.data || contactResponse.data.contacts || contactResponse.data || [];
        console.log('Processed Contacts:', contacts);
        console.log('Contacts Length:', contacts.length);

        // Count users by type
        const counts = {
          totalUsers: users.filter(user => user.userType === 'user').length,
          builders: users.filter(user => user.userType === 'builder').length,
          brokers: users.filter(user => user.userType === 'broker').length,
          enquiries: contacts.length
        };

        console.log('User Type Counts:', {
          builders: users.filter(user => user.userType === 'builder').length,
          brokers: users.filter(user => user.userType === 'broker').length,
          total: users.length
        });
        console.log('Final Calculated Counts:', counts);
        setUserCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const stats = [
    { 
      title: "Total Properties", 
      value: propertyCount?.toString() || "0", 
      icon: <Home className="w-6 h-6 text-primary" />, 
      link: "/admin/properties", 
      description: "Active property listings" 
    },
    { 
      title: "Total Brokers", 
      value: userCounts.brokers.toString(), 
      icon: <Briefcase className="w-6 h-6 text-primary" />, 
      link: "/admin/brokers", 
      description: "Registered brokers" 
    },
    { 
      title: "Total Builders", 
      value: userCounts.builders.toString(), 
      icon: <Building className="w-6 h-6 text-primary" />, 
      link: "/admin/builders", 
      description: "Registered builders" 
    },
    { 
      title: "Total Users", 
      value: userCounts.totalUsers.toString(), 
      icon: <Users className="w-6 h-6 text-primary" />, 
      link: "/admin/users", 
      description: "Active users" 
    },
    { 
      title: "Total Enquiries", 
      value: userCounts.enquiries.toString(), 
      icon: <MessageSquare className="w-6 h-6 text-primary" />, 
      link: "/admin/enquiries", 
      description: "Property enquiries" 
    },
    { 
      title: "Growth Rate", 
      value: "12.5%", 
      icon: <TrendingUp className="w-6 h-6 text-primary" />, 
      link: "/admin/analytics", 
      description: "Monthly growth" 
    }
  ];

  const mockData = {
    monthlySales: [
      { month: 'Jan', sales: 12, newProperties: 8, revenue: 1200000, enquiries: 45 },
      { month: 'Feb', sales: 15, newProperties: 10, revenue: 1500000, enquiries: 52 },
      { month: 'Mar', sales: 18, newProperties: 12, revenue: 1800000, enquiries: 60 },
      { month: 'Apr', sales: 20, newProperties: 15, revenue: 2000000, enquiries: 65 },
      { month: 'May', sales: 22, newProperties: 18, revenue: 2200000, enquiries: 70 },
      { month: 'Jun', sales: 25, newProperties: 20, revenue: 2500000, enquiries: 75 }
    ],
    brokers: [
      { name: 'John Doe', propertiesSold: 15, revenue: 1500000, commission: 75000 },
      { name: 'Jane Smith', propertiesSold: 12, revenue: 1200000, commission: 60000 },
      { name: 'Mike Johnson', propertiesSold: 18, revenue: 1800000, commission: 90000 }
    ],
    builders: [
      { name: 'ABC Builders', propertiesListed: 25, underConstruction: 8, completed: 12, upcoming: 5 },
      { name: 'XYZ Developers', propertiesListed: 30, underConstruction: 10, completed: 15, upcoming: 5 },
      { name: 'PQR Constructions', propertiesListed: 20, underConstruction: 6, completed: 10, upcoming: 4 }
    ],
    users: [
      { name: 'User A', propertiesBought: 2, averagePrice: '₹25L' },
      { name: 'User B', propertiesBought: 1, averagePrice: '₹35L' },
      { name: 'User C', propertiesBought: 3, averagePrice: '₹40L' }
    ],
    userStats: { totalUsers: 2567, activeUsers: 2100 },
    builderStats: { totalBuilders: 89 },
    brokerStats: { totalBrokers: 156 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64" />
          <Button variant="outline" asChild>
            <Link to="/admin/properties/new">Add Property</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link to={stat.link}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Properties Sold" />
                <Line yAxisId="left" type="monotone" dataKey="newProperties" stroke="#FFBB28" name="New Properties" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (₹)" />
                <Line yAxisId="left" type="monotone" dataKey="enquiries" stroke="#FF8042" name="Enquiries" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Brokers Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.brokers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="propertiesSold" fill="#8884d8" name="Properties Sold" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
                  <Bar yAxisId="right" dataKey="commission" fill="#FFBB28" name="Commission (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Builders Statistics</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.builders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="propertiesListed" fill="#8884d8" name="Total Listed" />
                  <Bar dataKey="underConstruction" fill="#FFBB28" name="Under Construction" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  <Bar dataKey="upcoming" fill="#FF8042" name="Upcoming" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Property Purchases</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.users}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="propertiesBought"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockData.users.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} properties (Avg: ${props.payload.averagePrice})`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
