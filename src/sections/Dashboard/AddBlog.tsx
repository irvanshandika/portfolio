import React, { useState, Suspense, useEffect } from "react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { Image, ArrowLeft, Loader2, X } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = React.lazy(() => import("react-quill"));

interface NewBlog {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

const AddBlogPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [newBlog, setNewBlog] = useState<NewBlog>({
    title: "",
    content: "",
    thumbnail: "",
    tags: [],
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !newBlog.tags.includes(trimmedTag)) {
      setNewBlog((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const storageRef = ref(storage, `blog_thumbnails/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      const blogData = {
        ...newBlog,
        thumbnail: thumbnailUrl,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
      };

      await addDoc(collection(db, "blogs"), blogData);
      toast.success("Blog created successfully!");
      window.location.href = "/dashboard/blogs";
    } catch (error) {
      console.error("Error adding blog: ", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }, { background: [] }],
      ["code", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, {list: "check"}],
      ["link", "image", "video", "formula"],
      [{ align: ["center", "right", "justify"] }],
      [{ script: "sub" }, { script: "super" }],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };

  const formats = [
    "font", 
    "header", 
    "bold", 
    "italic", 
    "underline", 
    "strike", 
    "blockquote", 
    "code-block", 
    "list", 
    "bullet", 
    "link", 
    "image", 
    "video", 
    "code-block", 
    "align", 
    "color", 
    "background", 
    "script", 
    "direction",
    "formula",
    "code"
  ];

  return (
    <div className={`container mx-auto px-4 py-8 max-w-3xl ${darkMode ? "dark" : ""}`}>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => (window.location.href = "/dashboard/blogs")} variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Button>
      </div>
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Add New Blog</CardTitle>
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
                placeholder="Enter blog title"
                value={newBlog.title}
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
                  <Image className="w-4 h-4 mr-2" /> Upload Thumbnail
                </Button>
                {thumbnailFile && <span className="text-sm text-gray-600 dark:text-gray-400">{thumbnailFile.name}</span>}
              </div>
              {thumbnailFile && <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail preview" className="mt-4 max-w-xs rounded-md shadow-md" fetchPriority="high" loading="lazy" />}
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newBlog.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-sm flex items-center">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center">
                <Input
                  type="text"
                  id="tags"
                  placeholder="Add tags (comma-separated)"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  className="w-full border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <Button type="button" onClick={addTag} className="ml-2">
                  Add Tag
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blog Content
              </label>
              <Suspense fallback={<div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">Loading editor...</div>}>
                <ReactQuill theme="snow" value={newBlog.content} modules={modules} formats={formats} onChange={handleContentChange} className="h-64 mb-12 border-gray-300 dark:border-gray-600 rounded-md" />
              </Suspense>
            </div>
            <Button type="submit" className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Blog...
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlogPage;
