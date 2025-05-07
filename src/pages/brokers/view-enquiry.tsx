
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Mock data for enquiries
const MOCK_ENQUIRIES = [
  {
    id: 1,
    clientName: "John Smith",
    email: "johnsmith@example.com",
    phone: "+1 (555) 123-4567",
    propertyId: "PROP-001",
    propertyTitle: "Luxury Villa with Sea View",
    message: "I'm interested in scheduling a viewing this weekend. Is the property still available?",
    date: "2025-04-25",
    status: "new"
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    propertyId: "PROP-008",
    propertyTitle: "Modern Downtown Apartment",
    message: "What are the terms for a 12-month lease? And is parking included?",
    date: "2025-04-24",
    status: "replied"
  },
  {
    id: 3,
    clientName: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 456-7890",
    propertyId: "PROP-015",
    propertyTitle: "Suburban Family Home",
    message: "Is the property available for immediate move-in? Also, are pets allowed?",
    date: "2025-04-23",
    status: "new"
  },
  {
    id: 4,
    clientName: "Emily Wilson",
    email: "emilyw@example.com",
    phone: "+1 (555) 234-5678",
    propertyId: "PROP-023",
    propertyTitle: "Beach Cottage",
    message: "I'd like to know more about the surrounding area and amenities.",
    date: "2025-04-22",
    status: "closed"
  },
  {
    id: 5,
    clientName: "David Martinez",
    email: "davidm@example.com",
    phone: "+1 (555) 345-6789",
    propertyId: "PROP-001",
    propertyTitle: "Luxury Villa with Sea View",
    message: "Can you provide more details about the property taxes and HOA fees?",
    date: "2025-04-21",
    status: "replied"
  }
];

const BrokerViewEnquiryPage = () => {
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
          <div className="bg-primary p-6 text-white">
            <h1 className="text-2xl font-bold">Manage Your Enquiries</h1>
            <p className="text-primary-50">Track and respond to potential clients interested in your properties</p>
          </div>
          
          <div className="p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-primary/10 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  All Enquiries
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
              
              <TabsContent value="all" className="space-y-4">
                {filteredEnquiries.map(enquiry => (
                  <EnquiryCard 
                    key={enquiry.id} 
                    enquiry={enquiry} 
                    onMarkReplied={() => markAsReplied(enquiry.id)} 
                    onClose={() => closeEnquiry(enquiry.id)} 
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="new" className="space-y-4">
                {filteredEnquiries.map(enquiry => (
                  <EnquiryCard 
                    key={enquiry.id} 
                    enquiry={enquiry} 
                    onMarkReplied={() => markAsReplied(enquiry.id)} 
                    onClose={() => closeEnquiry(enquiry.id)} 
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="replied" className="space-y-4">
                {filteredEnquiries.map(enquiry => (
                  <EnquiryCard 
                    key={enquiry.id} 
                    enquiry={enquiry} 
                    onMarkReplied={() => markAsReplied(enquiry.id)} 
                    onClose={() => closeEnquiry(enquiry.id)} 
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="closed" className="space-y-4">
                {filteredEnquiries.map(enquiry => (
                  <EnquiryCard 
                    key={enquiry.id} 
                    enquiry={enquiry} 
                    onMarkReplied={() => markAsReplied(enquiry.id)} 
                    onClose={() => closeEnquiry(enquiry.id)} 
                  />
                ))}
              </TabsContent>
            </Tabs>
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
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{enquiry.clientName}</h3>
          <p className="text-sm text-gray-600">{enquiry.email} • {enquiry.phone}</p>
        </div>
        <div>
          <span 
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium
            ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : 
              enquiry.status === 'replied' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}`}
          >
            {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-sm font-medium">Property: <span className="text-primary">{enquiry.propertyTitle}</span></p>
        <p className="text-sm text-gray-700 mt-1">{enquiry.message}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">Enquiry received: {enquiry.date}</p>
        <div className="space-x-2">
          {enquiry.status !== 'closed' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => onMarkReplied()}
              >
                {enquiry.status === 'new' ? 'Mark as Replied' : 'Update'}
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => onClose()}
              >
                Close
              </Button>
            </>
          )}
          {enquiry.status === 'closed' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerViewEnquiryPage;
