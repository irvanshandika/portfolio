import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileSearch, ServerCrash } from "lucide-react";

interface ErrorPageProps {
  status: number;
  title: string;
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ status, title, message }) => {
  const getIcon = () => {
    switch (status) {
      case 403:
        return <AlertTriangle className="w-24 h-24 text-yellow-500 dark:text-yellow-400 mb-6" />;
      case 404:
        return <FileSearch className="w-24 h-24 text-blue-500 dark:text-blue-400 mb-6" />;
      case 500:
        return <ServerCrash className="w-24 h-24 text-red-500 dark:text-red-400 mb-6" />;
      default:
        return <AlertTriangle className="w-24 h-24 text-gray-500 dark:text-gray-400 mb-6" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 403:
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case 404:
        return "bg-blue-50 dark:bg-blue-900/20";
      case 500:
        return "bg-red-50 dark:bg-red-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getBackgroundColor()}`}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center">{getIcon()}</div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">{status}</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{message}</p>
        <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
          Go back home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
