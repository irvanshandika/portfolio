import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Archive, Clock, Trash2, Mail, CornerUpRight, MoreVertical } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

const MessageView: React.FC = () => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      const id = window.location.pathname.split("/").pop();
      if (!id) return;
      const docRef = doc(db, "messages_db", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessage({
          id: docSnap.id,
          name: docSnap.data().name,
          email: docSnap.data().email,
          message: docSnap.data().message,
          date: docSnap.data().date.toDate().toLocaleString(),
        });
      }
      setLoading(false);
    };

    fetchMessage();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Top action bar */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Button variant="ghost" onClick={() => window.history.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message content */}
        <div className="p-6">
          {loading ? (
            <>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : message ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Message from {message.name}</h1>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="mr-4">{message.email}</span>
                <span>{message.date}</span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.message }} />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">Message not found</p>
          )}
        </div>

        {/* Reply button */}
        {!loading && message && (
          <div className="p-4 border-t dark:border-gray-700">
            <Button className="w-full">
              <CornerUpRight className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageView;
