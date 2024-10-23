import React, { useState, useEffect } from "react";
import { db } from "@/config/FirebaseConfig";
import { collection, getDocs, orderBy, query, limit, startAfter, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: any;
  authorName: string;
  photoURL?: string;
  tags: string[];
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const blogsPerPage = 3;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      let blogQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(blogsPerPage));

      if (search) {
        blogQuery = query(
          collection(db, "blogs"),
          where("title", ">=", search),
          where("title", "<=", search + "\uf8ff"),
          where("tags", "<=", search),
          where("tags", "<=", search + "\uf8ff"),
          orderBy("title"),
          orderBy("tags"),
          limit(blogsPerPage)
        );
      }

      const querySnapshot = await getDocs(blogQuery);
      const fetchedBlogs: Blog[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBlogs.push({ id: doc.id, ...doc.data() } as Blog);
      });

      setBlogs(fetchedBlogs);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("An error occurred while fetching blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBlogs = async () => {
    if (!lastVisible) return;

    setLoading(true);
    try {
      let blogQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(blogsPerPage));

      if (searchTerm) {
        blogQuery = query(collection(db, "blogs"), where("title", ">=", searchTerm), where("title", "<=", searchTerm + "\uf8ff"), orderBy("title"), startAfter(lastVisible), limit(blogsPerPage));
      }

      const querySnapshot = await getDocs(blogQuery);
      const fetchedBlogs: Blog[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBlogs.push({ id: doc.id, ...doc.data() } as Blog);
      });

      setBlogs((prevBlogs) => [...prevBlogs, ...fetchedBlogs]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error loading more blogs:", err);
      setError("An error occurred while loading more blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchBlogs(searchTerm);
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

  const BlogSkeleton = () => (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 px-px rounded-xl">
      <div className="rounded-[11px] bg-gray-200 dark:bg-gray-800 relative">
        <Skeleton className="rounded-[7px] w-full aspect-video" />
        <div className="absolute -bottom-8 z-10 flex inset-x-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2">
          <div className="flex items-center gap-x-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 px-5 pb-5 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <span className="pl-5 relative before:absolute before:w-4 before:h-0.5 before:rounded-md before:left-0 before:top-1/2 before:bg-sky-700 dark:before:bg-sky-600 text-sky-700 dark:text-sky-500">News</span>
          <h2 className="text-3xl font-semibold text-blue-950 dark:text-gray-200 md:text-4xl xl:text-5xl leading-tight">From our latest Blog Post</h2>
          <div className="flex justify-center mt-2">
            {!loading && lastVisible && blogs.length > 0 && (
              <button onClick={loadMoreBlogs} className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-blue-600 dark:text-gray-300 flex items-center gap-x-3">
                See More
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input type="text" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array(blogsPerPage)
                .fill(0)
                .map((_, index) => <BlogSkeleton key={index} />)
            : blogs.map((blog) => (
                <div key={blog.id} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 px-px rounded-xl">
                  <div className="rounded-[11px] bg-gray-200 dark:bg-gray-800 relative">
                    <img src={blog.thumbnail} alt="article cover" width="1400" className="rounded-[7px] w-full aspect-video object-cover" />
                    <div className="absolute -bottom-8 z-10 flex inset-x-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2">
                      <div className="flex items-center gap-x-4">
                        <img src={blog.photoURL} alt="" width="800" className="w-10 h-10 object-cover rounded-full" />
                        <div>
                          <p className="text-gray-800 dark:text-gray-50 font-semibold">By {blog.authorName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Author</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-14 px-5 pb-5 space-y-4">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">{formatTimestamp(blog.createdAt)}</span>
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold">{blog.title}</h1>
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-2" dangerouslySetInnerHTML={{ __html: truncateContent(blog.content, 150) }} />
                    <div className="flex items-center gap-x-2">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-white text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={`/blogs/${blog.id}`} className="flex items-center gap-x-2 text-blue-600 dark:text-blue-400">
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
        </div>

        {!loading && blogs.length === 0 && <div className="text-center mt-8 text-gray-500 dark:text-gray-400">No blogs found. Try a different search term.</div>}
      </div>
    </section>
  );
};

export default BlogPage;
