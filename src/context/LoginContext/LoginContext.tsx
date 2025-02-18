import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../../api/firebase/firebse";
import { userService } from "../../services/userService";
import { UserDataResponseRegister } from "../../api/types";

interface Props {
  children: React.ReactNode;
}

interface LoginContextType {
  userData: UserDataResponseRegister | null;
  handleCreateUser: (values: UserDataResponseRegister) => Promise<void>;
  handleSendResetPasswordEmail: (email: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
}

export const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: Props) => {
  const [userData, setUserData] = useState<UserDataResponseRegister | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user.uid);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserData = async (id: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", id));
      if (!userDoc.exists()) return console.log("User data not found");

      const userDataFromFirestore = userDoc.data() as UserDataResponseRegister;
      const scoresDoc = await getDoc(doc(db, "scores", id));
      const username = scoresDoc.exists() ? scoresDoc.data()?.username : null;

      setUserData({
        uid: id,
        username,
        avatar: userDataFromFirestore.avatar || "/default-avatar.png",
        email: userDataFromFirestore.email,
        firstName: userDataFromFirestore.firstName,
        lastName: userDataFromFirestore.lastName,
      } as UserDataResponseRegister);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCreateUser = async (values: UserDataResponseRegister) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      if (!user) return;

      const newUserData = {
        id: user.uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: user.email,
        avatar: values.avatar || "/default-avatar.png",
      };

      await userService.createUser(newUserData);

      if (values.username) {
        await setDoc(doc(db, "scores", user.uid), {
          username: values.username,
        });
      }
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleSendResetPasswordEmail = async (email: string) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };
  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        console.log("wylogowano");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignInWithGoogle = async () => {
    try {
      const authResult = await signInWithPopup(auth, provider);
      const user = authResult.user;
      if (!user) return;

      await getUserData(user.uid);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user) return;

      await getUserData(user.uid);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const refreshUserData = async () => {
    if (userData?.uid) {
      await getUserData(userData.uid);
    }
  };

  const updateUsername = async (newUsername: string) => {
    if (!userData?.uid) return;

    try {
      await setDoc(
        doc(db, "scores", userData.uid),
        { username: newUsername },
        { merge: true }
      );

      setUserData((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          username: newUsername,
          uid: prev.uid || "",
        } as UserDataResponseRegister;
      });
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        userData,
        handleSignOut,
        handleSignInWithGoogle,
        handleSignIn,
        handleCreateUser,
        handleSendResetPasswordEmail,
        refreshUserData,
        updateUsername,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(LoginContext);

  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }

  return context;
};
