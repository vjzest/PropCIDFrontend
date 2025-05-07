import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Filter, Home, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const BASE_URL='https://propcidback.onrender.com'

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/v1/property/getProperties`);
        const data = await response.json();

        const propsArray =
          Array.isArray(data?.properties) ? data.properties :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data :
          [];

        if (propsArray.length === 0) {
          setError("Failed to load properties, invalid data format");
        } else {
          setProperties(propsArray);
        }
      } catch (err) {
        setError("Error fetching properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.owner?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" || property.type?.toLowerCase() === filterType.toLowerCase();

    const matchesStatus =
      filterStatus === "all" || property.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/properties/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Property deleted",
      description: "The property has been successfully deleted.",
    });
    setProperties(properties.filter((property) => property.id !== id));
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="w-6 h-6" />
          Properties
        </h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate("/admin/properties/new")}
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div>
                    <p>{property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Listed on{" "}
                      {property.createdOn
                        ? new Date(property.createdOn).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.rate}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>
                  {property.type?.toLowerCase() !== "commercial" ? (
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      property.status === "For Sale"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {property.status}
                  </span>
                </TableCell>
                <TableCell>{property.owner}</TableCell>
                <TableCell>
                 
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
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

export default AdminPropertiesPage;
