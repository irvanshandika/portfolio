import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

const contacts: Contact[] = [
  { id: 1, name: "John Doe", email: "john@example.com", message: "Hello, I'd like to discuss a project.", date: "2023-06-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Interested in your services.", date: "2023-06-14" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", message: "Can we schedule a call?", date: "2023-06-13" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", message: "Looking for a web developer.", date: "2023-06-12" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", message: "Need help with my website.", date: "2023-06-11" },
];

const ContactDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedContacts = useMemo(() => {
    return contacts
      .filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.email.toLowerCase().includes(searchTerm.toLowerCase()) || contact.message.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === "asc" ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Dashboard</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: "name" | "date") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={toggleSortOrder}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.message}</TableCell>
                <TableCell>{contact.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredAndSortedContacts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No contacts found.</p>}
    </div>
  );
};

export default ContactDashboard;
