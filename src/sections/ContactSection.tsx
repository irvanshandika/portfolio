import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Send, MessageSquare } from "lucide-react";
import "react-quill/dist/quill.snow.css";

// Kita akan menggunakan lazy loading untuk React Quill
const ReactQuill = React.lazy(() => import("react-quill"));

interface Comment {
  id: number;
  name: string;
  message: string;
  date: string;
}

export default function ContactPage() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, name: "John Doe", message: "Great portfolio! Love your work.", date: "2023-06-15" },
    { id: 2, name: "Jane Smith", message: "Your projects are inspiring. Keep it up!", date: "2023-06-14" },
    { id: 3, name: "Alice", message: "I love your design style. It's very clean and professional.", date: "2023-06-13" },
    { id: 4, name: "Bob", message: "Your portfolio is amazing. I'm a big fan of your work.", date: "2023-06-12" },
  ]);
  const [contactMessage, setContactMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle contact form submission here
    alert("Pesan telah dikirim!");
    setContactMessage("");
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;

    const newComment: Comment = {
      id: comments.length + 1,
      name: nameInput.value,
      message: commentMessage,
      date: new Date().toISOString().split("T")[0],
    };

    setComments([newComment, ...comments]);
    form.reset();
    setCommentMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Hubungi Saya</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Formulir Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" placeholder="Masukkan nama Anda" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Masukkan email Anda" required />
              </div>
              <div>
                <Label htmlFor="message">Pesan</Label>
                {isClient && (
                  <React.Suspense fallback={<div>Loading editor...</div>}>
                    <ReactQuill theme="snow" value={contactMessage} onChange={setContactMessage} placeholder="Tulis pesan Anda di sini" />
                  </React.Suspense>
                )}
              </div>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Kirim Pesan
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Tinggalkan Komentar</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="comment-name">Nama</Label>
                  <Input id="comment-name" name="name" placeholder="Masukkan nama Anda" required />
                </div>
                <div>
                  <Label htmlFor="comment-message">Komentar</Label>
                  {isClient && (
                    <React.Suspense fallback={<div>Loading editor...</div>}>
                      <ReactQuill theme="snow" value={commentMessage} onChange={setCommentMessage} placeholder="Tulis komentar Anda di sini" />
                    </React.Suspense>
                  )}
                </div>
                <Button type="submit">
                  <MessageSquare className="mr-2 h-4 w-4" /> Kirim Komentar
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Komentar Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 overflow-y-scroll">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-sm text-muted-foreground">{comment.date}</p>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: comment.message }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
