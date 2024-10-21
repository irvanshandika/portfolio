import React, { useState, useEffect, Suspense } from "react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { Image, ArrowLeft, Loader2, Moon, Sun } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = React.lazy(() => import("react-quill"));

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
}

interface EditBlogProps {
  blogId: string;
}

const EditBlog: React.FC<EditBlogProps> = ({ blogId }) => {
  const [user] = useAuthState(auth);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
    } else {
      setLoading(false);
      toast.error("Blog ID is missing");
    }
  }, [blogId]);

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const blogDoc = doc(db, "blogs", id);
      const blogSnapshot = await getDoc(blogDoc);

      if (blogSnapshot.exists()) {
        setBlog({ id: blogSnapshot.id, ...blogSnapshot.data() } as Blog);
      } else {
        toast.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog: ", error);
      toast.error("An error occurred while fetching the blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlog((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleContentChange = (content: string) => {
    setBlog((prev) => (prev ? { ...prev, content } : null));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !blog) return;

    try {
      let thumbnailUrl = blog.thumbnail;
      if (thumbnailFile) {
        const storageRef = ref(storage, `blog_thumbnails/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      const blogData = {
        ...blog,
        thumbnail: thumbnailUrl,
      };

      await updateDoc(doc(db, "blogs", blog.id), blogData);
      toast.success("Blog updated successfully!");
      window.location.href = "/dashboard/blogs";
    } catch (error) {
      console.error("Error updating blog: ", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "code-block", "list", "bullet", "link", "image"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!blog || !blogId) {
    return <div className="text-center text-red-500">Blog not found or ID is missing</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => (window.location.href = "/dashboard/blogs")} variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Button>
      </div>
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Edit Blog</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blog Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="Blog Title"
                value={blog.title}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
              <div className="flex items-center space-x-2">
                <Input type="file" id="thumbnail" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("thumbnail")?.click()}
                  className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Image className="w-4 h-4 mr-2" /> Change Thumbnail
                </Button>
                {thumbnailFile && <span className="text-sm text-gray-600 dark:text-gray-400">{thumbnailFile.name}</span>}
              </div>
              {blog.thumbnail && <img src={blog.thumbnail} alt="Current thumbnail" className="mt-4 w-full h-48 object-cover rounded-md" fetchPriority="high" loading="lazy" />}
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blog Content
              </label>
              <Suspense fallback={<div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">Loading editor...</div>}>
                <ReactQuill theme="snow" value={blog.content} modules={modules} formats={formats} onChange={handleContentChange} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
              </Suspense>
            </div>
            <Button type="submit" className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors">
              Update Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;
