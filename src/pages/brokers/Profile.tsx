import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Save, X, Trash2 } from "lucide-react";

const BASE_URL = "https://propb1.onrender.com";

interface ProfileData {
  name: string;
  companyName: string;
  experience: number;
  licenseNumber: string;
  sales: number;
  profileImage?: string;
  email: string;
  phoneNumber?: string;
}

const BuilderProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      try {
        const { data } = await axios.get(`${BASE_URL}/builder/${user.uid}`);
        setProfile(data);
        setForm(data);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      }
    };
    fetchProfile();
  }, [auth.currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files && files[0]) {
      setImageFile(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const formData = new FormData();
    for (const [key, val] of Object.entries(form)) {
      if (val !== undefined && val !== null) {
        formData.append(key, val.toString());
      }
    }
    if (imageFile) formData.append("profileImage", imageFile);

    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/builder/${user.uid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated!");
      setIsEditing(false);
      const { data } = await axios.get(`${BASE_URL}/builder/${user.uid}`);
      setProfile(data);
      setForm(data);
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) setForm(profile);
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (
      !window.confirm(
        "Are you sure you want to delete your profile? This action is irreversible."
      )
    )
      return;

    try {
      const idToken = await user.getIdToken(); // Get Firebase ID token

      await axios.delete(`${BASE_URL}/builder/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send ID token in the header
        },
      });

      toast.success("Profile deleted successfully");
      auth.signOut(); // optional: sign out after deletion
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete profile");
      console.error(error);
    }
  };

  const displayInitial = profile?.name?.[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Profile
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Manage your profile information
              </p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-sm text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {imagePreview || profile?.profileImage ? (
                <img
                  src={imagePreview || profile?.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md">
                  {displayInitial}
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="text-white text-sm cursor-pointer">
                    Change
                    <input
                      type="file"
                      name="profileImage"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form or View */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "email",
                  "name",
                  "companyName",
                  "phoneNumber",
                  "experience",
                  "licenseNumber",
                  "sales",
                ].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      {field === "name"
                        ? "Full Name"
                        : field === "companyName"
                          ? "Company Name"
                          : field === "experience"
                            ? "Experience (years)"
                            : field === "licenseNumber"
                              ? "License Number"
                              : field === "sales"
                                ? "Total Sales"
                                : field === "phoneNumber"
                                  ? "Phone Number"
                                  : "Email"}
                    </label>
                    <input
                      type={
                        field === "experience" || field === "sales"
                          ? "number"
                          : field === "email"
                            ? "email"
                            : field === "phoneNumber"
                              ? "tel"
                              : "text"
                      }
                      name={field}
                      value={form[field as keyof ProfileData] ?? ""}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile && (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Company Name
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.companyName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Phone Number
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Experience
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.experience} years
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        License Number
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.licenseNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Total Sales
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {profile.sales}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderProfile;
