import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the User interface (adding userType)
interface User {
  _id: string;
  name: string;
  email: string;
  userType: string; // Add the userType field
  companyName?: string;
  isVerified: boolean;
  location?: string;
  specialization?: string;
}

const BASE_URL = "https://propb1.onrender.com";

const AdminBrokersPage = () => {
  const [brokers, setBrokers] = useState<User[]>([]); // Use User interface
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allUsers = response.data.users || [];
        const brokerUsers = allUsers.filter(
          (user: User) => user.userType === "broker"
        );

        setBrokers(brokerUsers);
      } catch (error) {
        console.error("Failed to fetch brokers", error);
      }
    };

    fetchBrokers();
  }, []);

  const filteredBrokers = brokers.filter(
    (broker) =>
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (broker.location || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (broker.specialization || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 pt-2">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-primary p-6 text-white">
            <h1 className="text-2xl font-bold">Manage Brokers</h1>
            <p className="text-primary-50">
              View and manage all registered broker accounts
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search brokers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  Add New Broker
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      Broker Name
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      Company
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBrokers.map((broker) => (
                    <tr key={broker._id}>
                      <td className="px-4 py-4">{broker.name}</td>
                      <td className="px-4 py-4">{broker.email}</td>
                      <td className="px-4 py-4">{broker.companyName || "-"}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            broker.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {broker.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/admin/brokers/${broker._id}/view`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-primary border-primary"
                            onClick={() =>
                              navigate(`/admin/brokers/${broker._id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBrokers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No brokers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBrokersPage;
