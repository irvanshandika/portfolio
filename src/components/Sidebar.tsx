import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Home, User, Briefcase, Mail, Rss } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
        `}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <a href="/">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
          </a>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden" aria-label="Close sidebar">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-2 px-4">
            <NavItem href="/dashboard" icon={<Home className="mr-2 h-4 w-4" />}>
              Dashboard
            </NavItem>
            <NavItem href="/dashboard/projects" icon={<Briefcase className="mr-2 h-4 w-4" />}>
              Projects
            </NavItem>
            <NavItem href="/dashboard/contacts" icon={<Mail className="mr-2 h-4 w-4" />}>
              Contact
            </NavItem>
            <NavItem href="/dashboard/blogs" icon={<Rss className="mr-2 h-4 w-4" />}>
              Blog
            </NavItem>
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <div className="md:hidden bg-white dark:bg-gray-800 p-4 shadow-md">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open sidebar">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, children }) => {
  return (
    <a href={href} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 ease-in-out">
      {icon}
      <span>{children}</span>
    </a>
  );
};

export default SidebarLayout;
