import React, { useState, useEffect } from "react";
import { db, auth } from "@/config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "react-hot-toast";
import { Search, UserCog, X } from "lucide-react";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading };
};

export default function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as User
      );
      setUsers(userList);
      setFilteredUsers(userList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      toast.success("User role updated successfully!");
    } catch (error) {
      console.error("Error updating user role: ", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Management Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={handleSearchChange} className="pl-10 pr-10" />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <Table>
            <TableCaption>A list of all users in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => handleRoleChange(user.id, value)} defaultValue={user.role}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {filteredUsers.length === 0 && !loading && <div className="text-center mt-4 text-gray-500">No users found matching your search.</div>}
      </CardContent>
    </Card>
  );
}
