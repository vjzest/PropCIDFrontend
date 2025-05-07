import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Search, Filter } from "lucide-react";

// Mock broker data
const MOCK_BROKERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    location: "Malibu, CA",
    properties: 12,
    activeListings: 8,
    totalSales: "$45M",
    rating: 4.8,
    status: "Active"
  },
  {
    id: 2,
    name: "Michael Zhang",
    email: "michael.z@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    properties: 18,
    activeListings: 12,
    totalSales: "$62M",
    rating: 4.9,
    status: "Active"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena.r@example.com",
    phone: "+1 (555) 345-6789",
    location: "Miami Beach, FL",
    properties: 15,
    activeListings: 10,
    totalSales: "$38M",
    rating: 4.7,
    status: "Active"
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.w@example.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    properties: 8,
    activeListings: 5,
    totalSales: "$22M",
    rating: 4.5,
    status: "Inactive"
  },
  {
    id: 5,
    name: "Aisha Patel",
    email: "aisha.p@example.com",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    properties: 20,
    activeListings: 15,
    totalSales: "$75M",
    rating: 4.9,
    status: "Active"
  }
];

const AllBrokersPage = () => {
  const [brokers, setBrokers] = useState(MOCK_BROKERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = 
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || broker.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Brokers</h1>
        <Button asChild>
          <Link to="/admin/brokers/new">
            Add New Broker
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brokers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Broker</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrokers.map((broker) => (
              <TableRow key={broker.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{broker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rating: {broker.rating}/5.0
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{broker.email}</p>
                    <p className="text-xs text-muted-foreground">{broker.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{broker.location}</TableCell>
                <TableCell>
                  <div>
                    <p>Total: {broker.properties}</p>
                    <p className="text-xs text-muted-foreground">
                      Active: {broker.activeListings}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Total Sales: {broker.totalSales}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg. Sale: ${(parseInt(broker.totalSales.replace(/[^0-9]/g, '')) / broker.properties).toLocaleString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    broker.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {broker.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/brokers/${broker.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/brokers/${broker.id}/properties`}>
                          View Properties
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredBrokers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No brokers found</p>
        </div>
      )}
    </div>
  );
};

export default AllBrokersPage; 