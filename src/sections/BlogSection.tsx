import React, { useState, useEffect } from "react";
import { db } from "@/config/FirebaseConfig";
import { collection, getDocs, orderBy, query, limit, startAfter, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Search } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: any;
  authorName: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const blogsPerPage = 6;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (search: string = "") => {
    try {
      setLoading(true);
      const blogsCollection = collection(db, "blogs");
      let q = query(blogsCollection, orderBy("createdAt", "desc"), limit(blogsPerPage));

      if (search) {
        q = query(blogsCollection, where("title", ">=", search), where("title", "<=", search + "\uf8ff"), limit(blogsPerPage));
      }

      const querySnapshot = await getDocs(q);

      const blogsList = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Blog
      );

      setBlogs(blogsList);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blogs: ", err);
      setError("An error occurred while fetching blogs. Please try again later.");
      setLoading(false);
    }
  };

  const loadMoreBlogs = async () => {
    if (!lastVisible) return;

    try {
      setLoading(true);
      const blogsCollection = collection(db, "blogs");
      const q = query(blogsCollection, orderBy("createdAt", "desc"), limit(blogsPerPage), startAfter(lastVisible));
      const querySnapshot = await getDocs(q);

      const newBlogs = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Blog
      );

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    } catch (err) {
      console.error("Error loading more blogs: ", err);
      setError("An error occurred while loading more blogs. Please try again.");
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchBlogs(searchTerm);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate();
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  const BlogSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input type="text" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array(blogsPerPage)
              .fill(0)
              .map((_, index) => <BlogSkeleton key={index} />)
          : blogs.map((blog) => (
              <Card key={blog.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <User className="mr-1 h-4 w-4" /> {blog.authorName}
                    <Calendar className="ml-4 mr-1 h-4 w-4" /> {formatDate(blog.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover rounded-md mb-4" fetchPriority="high" loading="lazy" />}
                  <div dangerouslySetInnerHTML={{ __html: truncateContent(blog.content, 150) }} className="mb-4 line-clamp-3" />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={`/blogs/${blog.id}`}>Read More</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>

      {!loading && blogs.length === 0 && <div className="text-center mt-8 text-gray-500 dark:text-gray-400">No blogs found. Try a different search term.</div>}

      {!loading && lastVisible && blogs.length > 0 && (
        <div className="text-center mt-8">
          <Button onClick={loadMoreBlogs}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
