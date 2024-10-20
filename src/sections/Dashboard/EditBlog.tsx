import React, { useState, useEffect, Suspense } from "react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { Image } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const blogDoc = doc(db, "blogs", blogId);
      const blogSnapshot = await getDoc(blogDoc);

      if (blogSnapshot.exists()) {
        setBlog({ id: blogSnapshot.id, ...blogSnapshot.data() } as Blog);
      } else {
        setError("Blog not found");
        toast.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog: ", error);
      setError("An error occurred while fetching the blog. Please try again later.");
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

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image"];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" name="title" placeholder="Blog Title" value={blog.title} onChange={handleInputChange} required />
            <div className="flex items-center space-x-2">
              <Input type="file" id="thumbnail" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
              <Button type="button" variant="outline" onClick={() => document.getElementById("thumbnail")?.click()}>
                <Image className="w-4 h-4 mr-2" /> Change Thumbnail
              </Button>
              {thumbnailFile && <span className="text-sm text-muted-foreground">{thumbnailFile.name}</span>}
            </div>
            {blog.thumbnail && <img src={blog.thumbnail} alt="Current thumbnail" className="w-full h-48 object-cover" />}
            <Suspense fallback={<div>Loading editor...</div>}>
              <ReactQuill theme="snow" value={blog.content} modules={modules} formats={formats} onChange={handleContentChange} />
            </Suspense>
            <Button type="submit">Update Blog</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;
