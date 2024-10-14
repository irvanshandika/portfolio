import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GoogleIcon from "./icons/GoogleIcon";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

export default function LoginModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      console.log("Photo URL:", user.photoURL);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setIsOpen(false);
      toast.success("Berhasil masuk!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Gagal masuk. Silakan coba lagi.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Berhasil keluar!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal keluar. Silakan coba lagi.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} onError={() => console.log("Error loading image")} />
            <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="outline">Login</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Profile" : "Login"}</DialogTitle>
          <DialogDescription>{user ? `Logged in as ${user.displayName}` : "Silakan login menggunakan akun Google Anda."}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          {user ? (
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} onError={() => console.log("Error loading image in modal")} />
                <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <p className="mb-4">{user.email}</p>
              <Button variant="default" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="default" onClick={handleLogin}>
              Sign in With Google
              <GoogleIcon style={{ marginLeft: "8px" }} />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
