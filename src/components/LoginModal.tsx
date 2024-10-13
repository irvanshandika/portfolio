import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GoogleIcon from "./icons/GoogleIcon";
import { app, auth } from "@/config/FirebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

export default function LoginModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const signInWithGoogle = async () => {
    const authInstance = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(authInstance, provider);
      const user = result.user;
      // Check if the user is in the Firebase auth table
      if (user) {
        window.location.reload();
      } else {
        authInstance.signOut();
      }
    } catch (error) {
      console.log(error);
      alert("Login failed. Please try again.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Silakan login menggunakan akun Google Anda.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Button variant="default" onClick={signInWithGoogle}>
            Sign in With Google
            <GoogleIcon style={{ marginLeft: "8px" }} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
