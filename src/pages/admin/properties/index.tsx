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
import { Search, Filter, Home, Plus, Eye, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const BASE_URL='https://propb1.onrender.com'

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

  const handleView = (property: any) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(property)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                  </div>
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

      {/* Property Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Property Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={selectedProperty.image || '/placeholder-property.jpg'}
                  alt={selectedProperty.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  {selectedProperty.images?.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedProperty.title} - ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                  <p className="text-gray-500">{selectedProperty.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">{selectedProperty.rate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{selectedProperty.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-semibold">{selectedProperty.size}</p>
                  </div>
                  {selectedProperty.type?.toLowerCase() !== "commercial" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-semibold">{selectedProperty.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-semibold">{selectedProperty.bathrooms}</p>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="mt-1">{selectedProperty.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amenities</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Array.isArray(selectedProperty.amenities) ? (
                      selectedProperty.amenities.map((amenity: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No amenities listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="mt-1">Broker: {selectedProperty.owner}</p>
                  <p>Phone: {selectedProperty.phone}</p>
                  <p>Email: {selectedProperty.email}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPropertiesPage;
