import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/useAuth"; // Pastikan path ini benar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginModal from "./LoginModal";
import Turnstile from "react-turnstile";
import "react-quill/dist/quill.snow.css";

const ReactQuill = React.lazy(() => import("react-quill"));

export default function ContactForm() {
  const [contactMessage, setContactMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    if (!turnstileToken) {
      toast.error("Silakan selesaikan verifikasi Turnstile.");
      return;
    }

    const form = event.target as HTMLFormElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;

    try {
      await addDoc(collection(db, "messages_db"), {
        photoProfile: user.photoURL,
        name: user.displayName,
        email: emailInput.value,
        message: contactMessage,
        userId: user.uid,
        date: new Date(),
      });
      toast.success("Pesan telah dikirim!");
      form.reset();
      setContactMessage("");
      setTurnstileToken(null);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            {user ? (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                  <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span>{user.displayName}</span>
              </div>
            ) : (
              <Input id="name" name="name" placeholder="Masukkan nama Anda" required disabled />
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Masukkan email Anda" required defaultValue={user?.email || ""} disabled={!!user} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            {isClient && (
              <React.Suspense fallback={<div>Loading editor...</div>}>
                <ReactQuill theme="snow" value={contactMessage} onChange={setContactMessage} className="h-36 lg:mb-12 mb-20" placeholder="Tulis pesan Anda di sini" />
              </React.Suspense>
            )}
          </div>
          {user ? (
            <div className="pt-4">
              <Turnstile sitekey={`${import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}`} onVerify={handleTurnstileVerify} />
              <Button type="submit" disabled={!turnstileToken}>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </div>
          ) : (
            <LoginModal />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
