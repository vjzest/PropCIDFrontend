
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Mock data for enquiries
const MOCK_ENQUIRIES = [
  {
    id: 1,
    clientName: "Robert Chen",
    email: "robert.chen@example.com",
    phone: "+1 (555) 123-7890",
    projectId: "PRJ-001",
    projectTitle: "Green Valley Heights",
    message: "I'm interested in the 3BHK floor plan. Can you share more details about the payment plan and possession date?",
    date: "2025-04-25",
    status: "new",
    unitType: "3BHK"
  },
  {
    id: 2,
    clientName: "Lisa Thompson",
    email: "lisa.t@example.com",
    phone: "+1 (555) 234-5678",
    projectId: "PRJ-001",
    projectTitle: "Green Valley Heights",
    message: "Looking for a site visit this weekend. Is it possible to schedule one?",
    date: "2025-04-24",
    status: "replied",
    unitType: "2BHK"
  },
  {
    id: 3,
    clientName: "Ahmed Hassan",
    email: "ahmed.h@example.com",
    phone: "+1 (555) 345-6789",
    projectId: "PRJ-002",
    projectTitle: "Sunrise Towers",
    message: "I need details about loan facilities and bank tie-ups for this project.",
    date: "2025-04-23",
    status: "new",
    unitType: "4BHK Premium"
  },
  {
    id: 4,
    clientName: "Maria Rodriguez",
    email: "maria.r@example.com",
    phone: "+1 (555) 456-7890",
    projectId: "PRJ-003",
    projectTitle: "Elite Business Park",
    message: "What are the lease options for office spaces? Our company is looking to relocate.",
    date: "2025-04-22",
    status: "closed",
    unitType: "Commercial Office"
  },
  {
    id: 5,
    clientName: "James Wilson",
    email: "james.w@example.com",
    phone: "+1 (555) 567-8901",
    projectId: "PRJ-002",
    projectTitle: "Sunrise Towers",
    message: "Is there any special discount for early bookings?",
    date: "2025-04-21",
    status: "replied",
    unitType: "3BHK Premium"
  }
];

const BuilderViewEnquiryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  
  const filteredEnquiries = activeTab === "all" 
    ? enquiries 
    : enquiries.filter(e => e.status === activeTab);
  
  const markAsReplied = (id: number) => {
    setEnquiries(prevEnquiries => 
      prevEnquiries.map(e => 
        e.id === id ? {...e, status: "replied"} : e
      )
    );
  };
  
  const closeEnquiry = (id: number) => {
    setEnquiries(prevEnquiries => 
      prevEnquiries.map(e => 
        e.id === id ? {...e, status: "closed"} : e
      )
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
            <h1 className="text-2xl font-bold">Project Enquiries</h1>
            <p className="text-primary-50">Track and respond to potential buyers interested in your projects</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
                <TabsList className="bg-primary/10">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    New
                  </TabsTrigger>
                  <TabsTrigger value="replied" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    Replied
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    Closed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="hidden md:block">
                <Button className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                  Export as CSV
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredEnquiries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No enquiries found</p>
                </div>
              ) : (
                filteredEnquiries.map(enquiry => (
                  <EnquiryCard 
                    key={enquiry.id} 
                    enquiry={enquiry} 
                    onMarkReplied={() => markAsReplied(enquiry.id)} 
                    onClose={() => closeEnquiry(enquiry.id)} 
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const EnquiryCard = ({ 
  enquiry, 
  onMarkReplied, 
  onClose 
}: { 
  enquiry: typeof MOCK_ENQUIRIES[0], 
  onMarkReplied: () => void, 
  onClose: () => void 
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-lg">{enquiry.clientName}</h3>
            <span 
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium
              ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                enquiry.status === 'replied' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}`}
            >
              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{enquiry.email} • {enquiry.phone}</p>
        </div>
        <div className="mt-2 md:mt-0 md:text-right">
          <p className="text-sm font-medium">Project: <span className="text-primary">{enquiry.projectTitle}</span></p>
          <p className="text-xs text-gray-500">Unit Type: {enquiry.unitType}</p>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-700">{enquiry.message}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">Received on: {enquiry.date}</p>
        <div className="space-x-2">
          {enquiry.status !== 'closed' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => onMarkReplied()}
              >
                {enquiry.status === 'new' ? 'Reply' : 'Send Follow-up'}
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => onClose()}
              >
                Close Enquiry
              </Button>
            </>
          )}
          {enquiry.status === 'closed' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              View History
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderViewEnquiryPage;
