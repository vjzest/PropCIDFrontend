import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Home, MessageSquare, User, TrendingUp, DollarSign, Building2, Calendar, Star, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const BuilderDashboard = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "45",
      icon: <Home className="h-4 w-4" />,
      description: "Active construction projects"
    },
    {
      title: "Active Enquiries",
      value: "28",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Pending enquiries"
    },
    {
      title: "Profile Views",
      value: "2,845",
      icon: <User className="h-4 w-4" />,
      description: "Total profile views"
    },
    {
      title: "Success Rate",
      value: "98%",
      icon: <BarChart2 className="h-4 w-4" />,
      description: "Project completion rate"
    }
  ];

  // Sample data for charts
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 12500000 },
    { name: 'Feb', revenue: 10800000 },
    { name: 'Mar', revenue: 15200000 },
    { name: 'Apr', revenue: 14780000 },
    { name: 'May', revenue: 13890000 },
    { name: 'Jun', revenue: 16390000 },
  ];

  const projectStatusData = [
    { name: 'Completed', value: 25 },
    { name: 'In Progress', value: 12 },
    { name: 'Planned', value: 8 },
  ];

  const recentActivities = [
    {
      type: "New Project Started",
      title: "Luxury Apartments - Phase 2",
      date: "2 days ago",
      details: "Construction started on 50-unit luxury apartment complex"
    },
    {
      type: "Enquiry Received",
      title: "Commercial Space Inquiry",
      date: "1 day ago",
      details: "New enquiry for 10,000 sq ft commercial space"
    },
    {
      type: "Project Completed",
      title: "Green Valley Residency",
      date: "3 days ago",
      details: "Successfully completed 100-unit residential project"
    },
    {
      type: "New Contract Signed",
      title: "Tech Park Development",
      date: "5 days ago",
      details: "Signed contract for new tech park development"
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderDashboard; 