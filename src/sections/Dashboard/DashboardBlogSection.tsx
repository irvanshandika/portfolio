import React, { useState, useEffect, Suspense } from "react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, where, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { Edit, Trash, Plus, Image } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = React.lazy(() => import("react-quill"));

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: any;
  authorId: string;
  authorName: string;
  photoURL?: string;
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

const BlogDashboard: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState<Omit<Blog, "id" | "createdAt" | "authorId" | "authorName" | "photoURL">>({
    title: "",
    content: "",
    thumbnail: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    if (!user) return;
    const blogsCollection = collection(db, "blogs");
    const blogsQuery = query(blogsCollection, where("authorId", "==", user.uid));
    const blogsSnapshot = await getDocs(blogsQuery);
    const blogsList = blogsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Blog);
    setBlogs(blogsList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setNewBlog((prev) => ({ ...prev, content }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const storageRef = ref(storage, `blog_thumbnails/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      const blogData = {
        ...newBlog,
        thumbnail: thumbnailUrl || newBlog.thumbnail,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
        toast.success("Blog updated successfully!");
      } else {
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog created successfully!");
      }

      setNewBlog({ title: "", content: "", thumbnail: "" });
      setThumbnailFile(null);
      setIsModalOpen(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error adding/updating blog: ", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      thumbnail: blog.thumbnail,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (blog: Blog) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
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
    }
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

  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image"];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Blog Dashboard</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBlog(null);
                setNewBlog({ title: "", content: "", thumbnail: "" });
              }}>
              <Plus className="w-4 h-4 mr-2" /> New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBlog ? "Edit Blog" : "Add New Blog"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="text" name="title" placeholder="Blog Title" value={newBlog.title} onChange={handleInputChange} required />
              <div className="flex items-center space-x-2">
                <Input type="file" id="thumbnail" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                <Button type="button" variant="outline" onClick={() => document.getElementById("thumbnail")?.click()}>
                  <Image className="w-4 h-4 mr-2" /> Upload Thumbnail
                </Button>
                {thumbnailFile && <span className="text-sm text-muted-foreground">{thumbnailFile.name}</span>}
              </div>
              <Suspense fallback={<div>Loading editor...</div>}>
                <ReactQuill theme="snow" value={newBlog.content} modules={modules} formats={formats} onChange={handleContentChange} />
              </Suspense>
              <Button type="submit">{editingBlog ? "Update" : "Create"} Blog</Button>
            </form>
          </DialogContent>
        </Dialog>
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
              <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content }} />
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(blog)}>
                  <Trash className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogDashboard;
