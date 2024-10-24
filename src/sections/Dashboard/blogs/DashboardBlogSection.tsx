import React, { useState, useEffect } from "react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { Edit, Trash, Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: any;
  authorId: string;
  authorName: string;
  photoURL?: string;
  tags: string[];
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
          toast.error("You are not authorized to view this page. Redirecting to home page...");
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

const BlogDashboard: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    if (!user) return;
    const blogsCollection = collection(db, "blogs");
    const blogsSnapshot = await getDocs(blogsCollection);
    const blogsList = blogsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Blog);
    setBlogs(blogsList);
  };

  const handleDelete = async (blog: Blog) => {
    try {
      await deleteDoc(doc(db, "blogs", blog.id));
      if (blog.thumbnail) {
        const storageRef = ref(storage, blog.thumbnail);
        await deleteObject(storageRef);
      }
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog: ", error);
      toast.error("An error occurred while deleting. Please try again.");
    }
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "0 seconds";
    const now = new Date();
    const blogDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - blogDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
    return `${Math.floor(diffInSeconds / 86400)} days`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold">Unauthorized Access</h1>
          <p className="text-lg mt-4">You are not authorized to view this page.</p>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Blog Dashboard</h1>
        <Button onClick={() => (window.location.href = "/dashboard/blogs/add-blog")}>
          <Plus className="w-4 h-4 mr-2" /> New Blog
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden">
            {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" fetchPriority="high" loading="lazy" />}
            <CardHeader>
              <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
              <CardDescription>
                By {blog.authorName} • {formatTimestamp(blog.createdAt)} ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: truncateContent(blog.content, 150) }} />
              <div className="mt-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full text-sm px-2 py-1 mr-2 dark:bg-gray-900">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => (window.location.href = `/dashboard/blogs/edit/${blog.id}`)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete the blog titled <strong>{blog.title}</strong>.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => handleDelete(blog)}>
                        Yes, delete
                      </Button>
                      <DialogClose asChild>
                        <Button variant="default">No, cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogDashboard;
