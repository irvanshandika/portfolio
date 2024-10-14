import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginModal from "./LoginModal";
import Turnstile from "react-turnstile";
import "react-quill/dist/quill.snow.css";

const ReactQuill = React.lazy(() => import("react-quill"));

export default function CommentForm() {
  const [commentMessage, setCommentMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    if (!turnstileToken) {
      toast.error("Silakan selesaikan verifikasi Turnstile.");
      return;
    }

    try {
      await addDoc(collection(db, "comments_db"), {
        photoProfile: user.photoURL,
        name: user.displayName,
        message: commentMessage,
        userId: user.uid,
        date: serverTimestamp(),
      });
      toast.success("Komentar telah dikirim!");
      setCommentMessage("");
      setTurnstileToken(null); // Reset token setelah submit
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Gagal mengirim komentar. Silakan coba lagi.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div>
            <Label htmlFor="comment-name">Nama</Label>
            {user ? (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                  <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span>{user.displayName}</span>
              </div>
            ) : (
              <Input id="comment-name" name="name" placeholder="Masukkan nama Anda" required disabled />
            )}
          </div>
          <div>
            <Label htmlFor="comment-message">Comment</Label>
            {isClient && (
              <React.Suspense fallback={<div>Loading editor...</div>}>
                <ReactQuill theme="snow" value={commentMessage} onChange={setCommentMessage} className="h-36 lg:mb-12 mb-20" placeholder="Tulis komentar Anda di sini" />
              </React.Suspense>
            )}
          </div>
          {user ? (
            <>
              <div className="pt-4">
                <Turnstile sitekey={`${import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}`} onVerify={handleTurnstileVerify} />
                <Button type="submit" disabled={!turnstileToken}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Submit
                </Button>
              </div>
            </>
          ) : (
            <LoginModal />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
