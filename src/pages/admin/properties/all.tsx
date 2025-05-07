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

// Mock property data
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Luxury Villa with Ocean View",
    type: "Villa",
    price: "$4,500,000",
    location: "Malibu, CA",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 6,
    size: "4,200 sq ft",
    listedDate: "2024-03-05",
    broker: "Sarah Johnson",
    views: 1250,
    enquiries: 45
  },
  {
    id: 2,
    title: "Modern Downtown Apartment",
    type: "Apartment",
    price: "$1,850,000",
    location: "San Francisco, CA",
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2,
    size: "1,800 sq ft",
    listedDate: "2024-02-18",
    broker: "Michael Zhang",
    views: 980,
    enquiries: 32
  },
  {
    id: 3,
    title: "Beachfront Cottage",
    type: "Cottage",
    price: "$2,750,000",
    location: "Miami Beach, FL",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    size: "2,100 sq ft",
    listedDate: "2024-01-10",
    broker: "Elena Rodriguez",
    views: 2100,
    enquiries: 78
  },
  {
    id: 4,
    title: "Downtown Office Space",
    type: "Commercial",
    price: "$8,500/month",
    location: "Chicago, IL",
    status: "For Rent",
    bedrooms: 0,
    bathrooms: 2,
    size: "3,000 sq ft",
    listedDate: "2024-03-15",
    broker: "James Wilson",
    views: 750,
    enquiries: 15
  },
  {
    id: 5,
    title: "Urban Loft Apartment",
    type: "Loft",
    price: "$3,200/month",
    location: "Boston, MA",
    status: "For Rent",
    bedrooms: 2,
    bathrooms: 2,
    size: "1,600 sq ft",
    listedDate: "2024-02-28",
    broker: "Aisha Patel",
    views: 1500,
    enquiries: 42
  }
];

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.broker.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Properties</h1>
        <Button asChild>
          <Link to="/admin/properties/new">
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
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
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="For Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Cottage">Cottage</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Broker</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Listed on {new Date(property.listedDate).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>
                  {property.type !== "Commercial" ? (
                    <>
                      {property.bedrooms} bed • {property.bathrooms} bath
                      <br />
                      <span className="text-xs text-muted-foreground">{property.size}</span>
                    </>
                  ) : (
                    <>{property.size}</>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === "For Sale" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {property.status}
                  </span>
                </TableCell>
                <TableCell>{property.broker}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>Views: {property.views.toLocaleString()}</p>
                    <p>Enquiries: {property.enquiries}</p>
                  </div>
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
                        <Link to={`/admin/properties/${property.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/properties/${property.id}/view`}>
                          View Details
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

      {filteredProperties.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No properties found</p>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesPage; 