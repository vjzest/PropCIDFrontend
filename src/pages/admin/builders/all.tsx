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

// Mock builder data
const MOCK_BUILDERS = [
  {
    id: 1,
    name: "Luxury Homes Inc.",
    email: "contact@luxuryhomes.com",
    phone: "+1 (555) 123-4567",
    location: "Malibu, CA",
    projects: 8,
    activeProjects: 3,
    completedProjects: 5,
    totalValue: "$120M",
    rating: 4.9,
    status: "Active"
  },
  {
    id: 2,
    name: "Modern Living Builders",
    email: "info@modernliving.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    projects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalValue: "$95M",
    rating: 4.8,
    status: "Active"
  },
  {
    id: 3,
    name: "Coastal Construction",
    email: "hello@coastalconstruction.com",
    phone: "+1 (555) 345-6789",
    location: "Miami Beach, FL",
    projects: 15,
    activeProjects: 6,
    completedProjects: 9,
    totalValue: "$150M",
    rating: 4.7,
    status: "Active"
  },
  {
    id: 4,
    name: "Urban Development Group",
    email: "contact@urbandev.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    projects: 6,
    activeProjects: 2,
    completedProjects: 4,
    totalValue: "$75M",
    rating: 4.6,
    status: "Inactive"
  },
  {
    id: 5,
    name: "Heritage Builders",
    email: "info@heritagebuilders.com",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    projects: 10,
    activeProjects: 4,
    completedProjects: 6,
    totalValue: "$110M",
    rating: 4.9,
    status: "Active"
  }
];

const AllBuildersPage = () => {
  const [builders, setBuilders] = useState(MOCK_BUILDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = 
      builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || builder.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Builders</h1>
        <Button asChild>
          <Link to="/admin/builders/new">
            Add New Builder
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search builders..."
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
              <TableHead>Builder</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuilders.map((builder) => (
              <TableRow key={builder.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{builder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rating: {builder.rating}/5.0
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{builder.email}</p>
                    <p className="text-xs text-muted-foreground">{builder.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{builder.location}</TableCell>
                <TableCell>
                  <div>
                    <p>Total: {builder.projects}</p>
                    <p className="text-xs text-muted-foreground">
                      Active: {builder.activeProjects} • Completed: {builder.completedProjects}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Total Value: {builder.totalValue}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg. Project: ${(parseInt(builder.totalValue.replace(/[^0-9]/g, '')) / builder.projects).toLocaleString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    builder.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {builder.status}
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
                        <Link to={`/admin/builders/${builder.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/builders/${builder.id}/projects`}>
                          View Projects
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

      {filteredBuilders.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No builders found</p>
        </div>
      )}
    </div>
  );
};

export default AllBuildersPage; 