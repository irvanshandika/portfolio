import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GoogleIcon from "./icons/GoogleIcon";
import { useAuth } from "@/lib/useAuth";
import { Toaster, toast } from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

export default function LoginModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Welcome back");
      setIsOpen(false);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("See you soon, " + user?.displayName);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to exit. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Toaster position="top-right" />
      <DialogTrigger asChild>
        {user ? (
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} onError={() => console.log("Error loading image")} />
            <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="outline">Sign In</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Profile" : "Sign In"}</DialogTitle>
          <DialogDescription>{user ? `Logged in as ${user.email}` : "Please signin using your Google account."}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          {user ? (
            <>
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} onError={() => console.log("Error loading image in modal")} />
                <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <p className="mb-4">{user.displayName}</p>
              {userRole === "admin" && (
                <Button variant="outline" className="mb-4" onClick={() => (window.location.href = "/dashboard")}>
                  Go to Dashboard
                </Button>
              )}
              <Button variant="default" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
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
