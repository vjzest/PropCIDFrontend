import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuildersPage from "./pages/builders/index";
import BuilderListPropertyPage from "./pages/builders/list-property";
import BuilderViewEnquiryPage from "./pages/builders/view-enquiry";
import BrokersPage from "./pages/brokers/index";
import BrokerListPropertyPage from "./pages/brokers/list-property";
import BrokerViewEnquiryPage from "./pages/brokers/view-enquiry";
import PropertiesPage from "./pages/properties/index";
import ServicesPage from "./pages/services/index";
import ContactPage from "./pages/contact/index";
import AllBrokers from "./pages/AllBrokers";
import AllBuilders from "./pages/AllBuilders";
import ViewBuilder from "./pages/builders/ViewBuilder";
import ViewBroker from "./pages/brokers/ViewBroker";
import Reels from "./components/Reels";

// Admin pages
import AdminPanel from "./pages/admin/index";
import AdminBuildersPage from "./pages/admin/builders/index";
import AdminBuilderPropertiesPage from "./pages/admin/builders/properties";
import AdminBrokersPage from "./pages/admin/brokers/index";
import AdminBrokerPropertiesPage from "./pages/admin/brokers/properties";
import AdminUsersPage from "./pages/admin/users/index";
import AdminUserEnquiriesPage from "./pages/admin/users/enquiries";
import AdminPropertiesPage from "./pages/admin/properties/index";
import AdminEnquiriesPage from "./pages/admin/enquiries/index";
import AdminSettingsPage from "./pages/admin/settings/index";
import BrokerBuilderNavbar from './components/BrokerBuilderNavbar';
import BrokerDashboard from './pages/brokers/BrokerDashboard';
import BrokerListProperty from './pages/brokers/ListProperty';
import BrokerMyProperties from './pages/brokers/MyProperties';
import BrokerEnquiries from './pages/brokers/Enquiries';
import BrokerProfile from './pages/brokers/Profile';
import BuilderDashboard from './pages/builders/BuilderDashboard';
import BuilderListProperty from './pages/builders/ListProperty';
import BuilderMyProperties from './pages/builders/MyProperties';
import BuilderEnquiries from './pages/builders/Enquiries';
import BuilderProfile from './pages/builders/Profile';
import BrokerDetailsPage from './pages/admin/brokers/[id]';
import BuilderDetailsPage from './pages/admin/builders/[id]';
import UserDetailsPage from './pages/admin/users/[id]';
import AdminNavbar from './components/AdminNavbar';
import AdminDashboard from './pages/admin/dashboard';
import AddPropertyPage from './pages/admin/properties/new';
import AddBuilderPage from './pages/admin/builders/new';
import AddBrokerPage from './pages/admin/brokers/new';
import EditBrokerPage from './pages/admin/brokers/edit';
import ViewBrokerPage from './pages/admin/brokers/view';
import ViewBuilderPage from '@/pages/admin/builders/view';
import EditBuilderPage from '@/pages/admin/builders/edit';
import ViewUserPage from '@/pages/admin/users/view';
import EditUserPage from '@/pages/admin/users/edit';
import ViewEnquiryPage from '@/pages/admin/enquiries/view';
import EditPropertyPage from '@/pages/admin/properties/edit';
import BrokerPropertiesPage from '@/pages/admin/brokers/properties';
import { AuthProvider } from './context/AuthContext';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/builders" element={<BuildersPage />} />
            <Route path="/all-builders" element={<AllBuilders />} />
            <Route path="/builders/:id" element={<ViewBuilder />} />
            <Route path="/builders/list-property" element={<BuilderListPropertyPage />} />
            <Route path="/builders/view-enquiry" element={<BuilderViewEnquiryPage />} />
            <Route path="/brokers" element={<BrokersPage />} />
            <Route path="/all-brokers" element={<AllBrokers />} />
            <Route path="/brokers/:id" element={<ViewBroker />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Broker Routes */}
            <Route path="/broker" element={
              <BrokerBuilderNavbar userType="broker">
                <BrokerDashboard />
              </BrokerBuilderNavbar>
            } />
            <Route path="/broker/list-property" element={
              <BrokerBuilderNavbar userType="broker">
                <BrokerListProperty />
              </BrokerBuilderNavbar>
            } />
            <Route path="/broker/properties" element={
              <BrokerBuilderNavbar userType="broker">
                <BrokerMyProperties />
              </BrokerBuilderNavbar>
            } />
            <Route path="/broker/enquiries" element={
              <BrokerBuilderNavbar userType="broker">
                <BrokerEnquiries />
              </BrokerBuilderNavbar>
            } />
            <Route path="/broker/profile" element={
              <BrokerBuilderNavbar userType="broker">
                <BrokerProfile />
              </BrokerBuilderNavbar>
            } />
            
            {/* Builder Routes */}
            <Route path="/builder" element={
              <BrokerBuilderNavbar userType="builder">
                <BuilderDashboard />
              </BrokerBuilderNavbar>
            } />
            <Route path="/builder/list-property" element={
              <BrokerBuilderNavbar userType="builder">
                <BuilderListProperty />
              </BrokerBuilderNavbar>
            } />
            <Route path="/builder/properties" element={
              <BrokerBuilderNavbar userType="builder">
                <BuilderMyProperties />
              </BrokerBuilderNavbar>
            } />
            <Route path="/builder/enquiries" element={
              <BrokerBuilderNavbar userType="builder">
                <BuilderEnquiries />
              </BrokerBuilderNavbar>
            } />
            <Route path="/builder/profile" element={
              <BrokerBuilderNavbar userType="builder">
                <BuilderProfile />
              </BrokerBuilderNavbar>
            } />
            
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminNavbar />}>
              <Route index element={<AdminDashboard />} />
              <Route path="brokers">
                <Route index element={<AdminBrokersPage />} />
                <Route path="new" element={<AddBrokerPage />} />
                <Route path=":id/edit" element={<EditBrokerPage />} />
                <Route path=":id/view" element={<ViewBrokerPage />} />
                <Route path=":id/properties" element={<BrokerPropertiesPage />} />
              </Route>
              <Route path="builders">
                <Route index element={<AdminBuildersPage />} />
                <Route path="new" element={<AddBuilderPage />} />
                <Route path=":id/view" element={<ViewBuilderPage />} />
                <Route path=":id/edit" element={<EditBuilderPage />} />
              </Route>
              <Route path="users">
                <Route index element={<AdminUsersPage />} />
                <Route path=":id/view" element={<ViewUserPage />} />
                <Route path=":id/edit" element={<EditUserPage />} />
              </Route>
              <Route path="properties">
                <Route index element={<AdminPropertiesPage />} />
                <Route path="new" element={<AddPropertyPage />} />
                <Route path=":id/edit" element={<EditPropertyPage />} />
              </Route>
              <Route path="enquiries">
                <Route index element={<AdminEnquiriesPage />} />
                <Route path=":id/view" element={<ViewEnquiryPage />} />
              </Route>
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
