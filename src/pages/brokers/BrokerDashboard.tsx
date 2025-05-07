import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Building,
  ArrowUpRight,
  ArrowDownRight
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for charts
const propertyData = [
  { name: 'Jan', listed: 8, sold: 5, revenue: 2500000 },
  { name: 'Feb', listed: 6, sold: 4, revenue: 1800000 },
  { name: 'Mar', listed: 10, sold: 7, revenue: 3500000 },
  { name: 'Apr', listed: 12, sold: 8, revenue: 4000000 },
  { name: 'May', listed: 9, sold: 6, revenue: 2800000 },
  { name: 'Jun', listed: 15, sold: 10, revenue: 5500000 },
];

const revenueData = [
  { name: 'Jan', revenue: 2500000 },
  { name: 'Feb', revenue: 1800000 },
  { name: 'Mar', revenue: 3500000 },
  { name: 'Apr', revenue: 4000000 },
  { name: 'May', revenue: 2800000 },
  { name: 'Jun', revenue: 5500000 },
];

const propertyTypeData = [
  { name: 'Residential', value: 45 },
  { name: 'Commercial', value: 25 },
  { name: 'Industrial', value: 15 },
  { name: 'Land', value: 15 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BrokerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business performance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Sold</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹85.2M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+20%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="listed" fill="#8884d8" name="Properties Listed" />
                  <Bar dataKey="sold" fill="#82ca9d" name="Properties Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  type: 'enquiry', 
                  message: 'New enquiry for Luxury Villa in Mumbai', 
                  time: '2 hours ago',
                  priority: 'high',
                  user: 'Rahul Sharma'
                },
                { 
                  type: 'sale', 
                  message: 'Property sold: 3BHK Apartment in Bangalore', 
                  time: '1 day ago',
                  amount: '₹1.2 Cr',
                  buyer: 'Priya Patel'
                },
                { 
                  type: 'listing', 
                  message: 'New property listed: Commercial Space in Delhi', 
                  time: '2 days ago',
                  price: '₹3.5 Cr',
                  area: '3500 sq.ft'
                },
                { 
                  type: 'enquiry', 
                  message: 'Enquiry resolved: 2BHK Flat in Pune', 
                  time: '3 days ago',
                  status: 'completed',
                  user: 'Amit Kumar'
                },
                { 
                  type: 'sale', 
                  message: 'Property sold: Plot in Hyderabad', 
                  time: '4 days ago',
                  amount: '₹75 L',
                  buyer: 'Neha Gupta'
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'enquiry' ? 'bg-blue-100' : 
                      activity.type === 'sale' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'enquiry' ? <MessageSquare className="h-4 w-4 text-blue-600" /> :
                       activity.type === 'sale' ? <DollarSign className="h-4 w-4 text-green-600" /> :
                       <Home className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      {activity.type === 'enquiry' && (
                        <p className="text-sm text-muted-foreground">From: {activity.user}</p>
                      )}
                      {activity.type === 'sale' && (
                        <p className="text-sm text-muted-foreground">Buyer: {activity.buyer}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerDashboard; 