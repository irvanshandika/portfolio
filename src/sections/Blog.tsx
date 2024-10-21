import React, { useState, useEffect } from "react";
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: any;
  authorName: string;
}

interface ArchiveItem {
  id: string;
  title: string;
  createdAt: any;
}

interface BlogProps {
  blogId: string;
  blogTitle: string;
}

const BlogDetailPage: React.FC<BlogProps> = ({ blogId }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [archive, setArchive] = useState<Record<string, ArchiveItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogDetails();
    fetchArchive();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const blogDoc = doc(db, "blogs", blogId);
      const blogSnapshot = await getDoc(blogDoc);

      if (blogSnapshot.exists()) {
        setBlog({ id: blogSnapshot.id, ...blogSnapshot.data() } as Blog);
      } else {
        setError("Blog not found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog details: ", err);
      setError("An error occurred while fetching the blog. Please try again later.");
      setLoading(false);
    }
  };

  const fetchArchive = async () => {
    try {
      const archiveQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const archiveSnapshot = await getDocs(archiveQuery);
      const archiveData: Record<string, ArchiveItem[]> = {};

      archiveSnapshot.forEach((doc) => {
        const data = doc.data() as ArchiveItem;
        const year = new Date(data.createdAt.toDate()).getFullYear().toString();
        if (!archiveData[year]) {
          archiveData[year] = [];
        }
        archiveData[year].push({ id: doc.id, title: data.title, createdAt: data.createdAt });
      });

      setArchive(archiveData);
    } catch (err) {
      console.error("Error fetching archive: ", err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-20 h-10 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="w-3/4 h-8 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-64 mb-6" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="w-1/2 h-6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center">Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" size="sm" onClick={() => window.history.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold mb-2">{blog.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{blog.authorName}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatTimestamp(blog.createdAt)} ago</span>
              </div>
            </CardHeader>
            <CardContent>
              {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-full max-h-96 object-cover mb-6 rounded-md" fetchPriority="high" />}
              <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: blog.content }} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Archive</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(archive).map(([year, posts]) => (
                <div key={year} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{year}</h3>
                  <ul className="space-y-2">
                    {posts.map((post) => (
                      <li key={post.id}>
                        <a href={`/blogs/${post.id}`} className="text-sm hover:underline text-muted-foreground">
                          {post.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
