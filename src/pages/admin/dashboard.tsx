import { useState } from 'react';
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
  TrendingUp,
  DollarSign,
  ShoppingCart,
  List
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for demonstration
const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', propertiesBought: 3, totalSpent: '₹2.5 Cr', lastPurchase: '2024-02-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', propertiesBought: 2, totalSpent: '₹1.8 Cr', lastPurchase: '2024-01-20', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', propertiesBought: 1, totalSpent: '₹1.2 Cr', lastPurchase: '2023-12-10', status: 'Inactive' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', propertiesBought: 4, totalSpent: '₹3.5 Cr', lastPurchase: '2024-02-01', status: 'Active' },
  ],
  builders: [
    { 
      id: 1,
      name: 'ABC Construction', 
      propertiesListed: 25, 
      underConstruction: 8,
      completed: 12,
      upcoming: 5,
      totalArea: '2.5M sq.ft',
      locations: ['Mumbai', 'Delhi', 'Bangalore'],
      rating: 4.8,
      revenue: '₹45 Cr'
    },
    { 
      id: 2,
      name: 'XYZ Builders', 
      propertiesListed: 18, 
      underConstruction: 5,
      completed: 8,
      upcoming: 5,
      totalArea: '1.8M sq.ft',
      locations: ['Hyderabad', 'Chennai'],
      rating: 4.5,
      revenue: '₹32 Cr'
    },
    { 
      id: 3,
      name: 'Modern Homes', 
      propertiesListed: 30, 
      underConstruction: 12,
      completed: 15,
      upcoming: 3,
      totalArea: '3.2M sq.ft',
      locations: ['Pune', 'Ahmedabad', 'Kolkata'],
      rating: 4.9,
      revenue: '₹58 Cr'
    },
  ],
  brokers: [
    { 
      id: 1,
      name: 'John Doe', 
      propertiesSold: 12, 
      revenue: '₹4.5 Cr', 
      commission: '₹45 L', 
      rating: 4.8,
      activeListings: 8,
      successRate: '85%',
      experience: '5 years'
    },
    { 
      id: 2,
      name: 'Jane Smith', 
      propertiesSold: 8, 
      revenue: '₹3.2 Cr', 
      commission: '₹32 L', 
      rating: 4.5,
      activeListings: 5,
      successRate: '78%',
      experience: '3 years'
    },
    { 
      id: 3,
      name: 'Mike Johnson', 
      propertiesSold: 15, 
      revenue: '₹5.8 Cr', 
      commission: '₹58 L', 
      rating: 4.9,
      activeListings: 10,
      successRate: '92%',
      experience: '7 years'
    },
  ],
  userStats: {
    totalUsers: 1560,
    activeUsers: 1200,
    newUsers: 45,
    avgPropertiesPerUser: 2.5,
    totalRevenue: '₹125 Cr'
  },
  builderStats: {
    totalBuilders: 45,
    activeProjects: 120,
    completedProjects: 85,
    totalArea: '15.2M sq.ft',
    totalRevenue: '₹450 Cr'
  },
  brokerStats: {
    totalBrokers: 75,
    activeBrokers: 65,
    totalSales: 250,
    totalRevenue: '₹85 Cr',
    avgCommission: '₹34 L'
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: "Total Properties",
      value: "1,234",
      icon: <Home className="w-6 h-6 text-primary" />,
      link: "/admin/properties",
      description: "Active property listings"
    },
    {
      title: "Total Brokers",
      value: "156",
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      link: "/admin/brokers",
      description: "Registered brokers"
    },
    {
      title: "Total Builders",
      value: "89",
      icon: <Building className="w-6 h-6 text-primary" />,
      link: "/admin/builders",
      description: "Registered builders"
    },
    {
      title: "Total Users",
      value: "2,567",
      icon: <Users className="w-6 h-6 text-primary" />,
      link: "/admin/users",
      description: "Active users"
    },
    {
      title: "Total Enquiries",
      value: "432",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" asChild>
            <Link to="/admin/properties/new">Add Property</Link>
          </Button>
         
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link to={stat.link}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Sales Trend */}
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
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  name="Properties Sold"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="newProperties"
                  stroke="#FFBB28"
                  name="New Properties"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Revenue (₹)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="enquiries"
                  stroke="#FF8042"
                  name="Enquiries"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brokers Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Brokers Performance</CardTitle>
          </CardHeader>
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
                  <Bar yAxisId="left" dataKey="propertiesSold" name="Properties Sold" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="commission" name="Commission (₹)" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Builders Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Builders Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.builders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="propertiesListed" name="Total Listed" fill="#8884d8" />
                  <Bar dataKey="underConstruction" name="Under Construction" fill="#FFBB28" />
                  <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
                  <Bar dataKey="upcoming" name="Upcoming" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Property Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>User Property Purchases</CardTitle>
          </CardHeader>
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
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} properties (Avg: ${props.payload.averagePrice})`,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users Overview</CardTitle>
            <CardDescription>Total Users: {mockData.userStats.totalUsers}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Active Users: {mockData.userStats.activeUsers}</p>
              <p>New Users (30 days): {mockData.userStats.newUsers}</p>
              <p>Avg Properties/User: {mockData.userStats.avgPropertiesPerUser}</p>
              <p>Total Revenue: {mockData.userStats.totalRevenue}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Builders Overview</CardTitle>
            <CardDescription>Total Builders: {mockData.builderStats.totalBuilders}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Active Projects: {mockData.builderStats.activeProjects}</p>
              <p>Completed Projects: {mockData.builderStats.completedProjects}</p>
              <p>Total Area: {mockData.builderStats.totalArea}</p>
              <p>Total Revenue: {mockData.builderStats.totalRevenue}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brokers Overview</CardTitle>
            <CardDescription>Total Brokers: {mockData.brokerStats.totalBrokers}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Active Brokers: {mockData.brokerStats.activeBrokers}</p>
              <p>Total Sales: {mockData.brokerStats.totalSales}</p>
              <p>Total Revenue: {mockData.brokerStats.totalRevenue}</p>
              <p>Avg Commission: {mockData.brokerStats.avgCommission}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Properties Bought</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.propertiesBought}</TableCell>
                  <TableCell>{user.totalSpent}</TableCell>
                  <TableCell>{user.lastPurchase}</TableCell>
                  <TableCell>{user.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Builders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Builders Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Builder Name</TableHead>
                <TableHead>Properties Listed</TableHead>
                <TableHead>Under Construction</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Upcoming</TableHead>
                <TableHead>Total Area</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.builders.map((builder) => (
                <TableRow key={builder.id}>
                  <TableCell>{builder.name}</TableCell>
                  <TableCell>{builder.propertiesListed}</TableCell>
                  <TableCell>{builder.underConstruction}</TableCell>
                  <TableCell>{builder.completed}</TableCell>
                  <TableCell>{builder.upcoming}</TableCell>
                  <TableCell>{builder.totalArea}</TableCell>
                  <TableCell>{builder.rating}</TableCell>
                  <TableCell>{builder.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Brokers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Brokers Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker Name</TableHead>
                <TableHead>Properties Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Active Listings</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Experience</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.brokers.map((broker) => (
                <TableRow key={broker.id}>
                  <TableCell>{broker.name}</TableCell>
                  <TableCell>{broker.propertiesSold}</TableCell>
                  <TableCell>{broker.revenue}</TableCell>
                  <TableCell>{broker.commission}</TableCell>
                  <TableCell>{broker.rating}</TableCell>
                  <TableCell>{broker.activeListings}</TableCell>
                  <TableCell>{broker.successRate}</TableCell>
                  <TableCell>{broker.experience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 