import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/FirebaseConfig";

interface FirestoreUser {
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await saveUserToFirestore(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = () => auth.signOut();

  const saveUserToFirestore = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const userData: FirestoreUser = {
      photoURL: user.photoURL,
      displayName: user.displayName,
      email: user.email,
      role: "user", // default role
    };

    if (!userSnap.exists()) {
      // Jika pengguna baru, simpan semua data
      await setDoc(userRef, userData);
    } else {
      // Jika pengguna sudah ada, hanya update photoURL dan displayName
      await setDoc(
        userRef,
        {
          photoURL: userData.photoURL,
          displayName: userData.displayName,
        },
        { merge: true }
      );
    }
  };

  return { user, signInWithGoogle, signOut };
}
