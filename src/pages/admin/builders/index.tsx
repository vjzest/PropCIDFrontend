import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, X, Home, Search } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
  companyName?: string;
  isVerified: boolean;
  location?: string;
  specialization?: string;
  experience?: number;
  sales?: number;
  phone?: string;
  profileImage?: string;
}

const BASE_URL = "https://propb1.onrender.com";

const AdminbuildersPage = () => {
  const [builders, setbuilders] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedbuilder, setSelectedbuilder] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchbuilders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allUsers = response.data.users || [];
        const builderUsers = allUsers.filter(
          (user: User) => user.userType === "builder"
        );

        setbuilders(builderUsers);
      } catch (error) {
        console.error("Failed to fetch builders", error);
      }
    };

    fetchbuilders();
  }, []);

  const filteredbuilders = builders.filter(
    (builder) =>
      builder.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (builder: User) => {
    setSelectedbuilder(builder);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="w-6 h-6" />
          builders
        </h1>
      </div>

      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search builders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredbuilders.map((builder) => (
              <TableRow key={builder._id}>
                <TableCell>{builder.name}</TableCell>
                <TableCell>{builder.email}</TableCell>
                <TableCell>{builder.companyName || "N/A"}</TableCell>
                <TableCell>
                  {builder.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Unverified</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(builder)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredbuilders.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No builders found
        </div>
      )}

      {/* builder Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>builder Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedbuilder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
              {selectedbuilder.profileImage ? (
  <img
    src={selectedbuilder.profileImage}
    alt={selectedbuilder.name}
    className="w-full h-48 object-cover rounded-md"
  />
) : (
  <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md text-4xl font-bold text-gray-600">
    {selectedbuilder.name?.charAt(0).toUpperCase() || "B"}
  </div>
)}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedbuilder.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedbuilder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedbuilder.companyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedbuilder.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedbuilder.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium">{selectedbuilder.specialization || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{selectedbuilder.experience || 0} yrs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sales</p>
                  <p className="font-medium">{selectedbuilder.sales || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedbuilder.isVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminbuildersPage;
