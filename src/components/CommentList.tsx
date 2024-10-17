import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, query, orderBy, onSnapshot, Timestamp, limit } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  photoURL: string;
  name: string;
  message: string;
  date: Timestamp;
}

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "comments_db"), orderBy("date", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString();
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const CommentSkeleton = () => (
    <div className="border-b pb-4 last:border-b-0">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3 w-20 mt-2" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-2/3 mt-1" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => <CommentSkeleton key={index} />)
            : comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={comment.photoURL || undefined} alt={comment.name || "User"} />
                      <AvatarFallback>{comment.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{comment.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(comment.date)}</p>
                  <div className="mt-2" dangerouslySetInnerHTML={{ __html: comment.message }} />
                </div>
              ))}
          <div ref={commentsEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}
