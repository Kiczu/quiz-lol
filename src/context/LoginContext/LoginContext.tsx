import React, { createContext, useEffect, useState, useContext } from "react";
import { sendEmailVerification, updateEmail } from "firebase/auth";
import { authService } from "../../services/authService";
import { EditableUserFields, RawUserData } from "../../api/types";
import { userAggregateService } from "../../services/userAggregateService";

interface Props {
  children: React.ReactNode;
}

interface LoginContextType {
  userData: RawUserData | null;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserData: (updates: EditableUserFields) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: Props) => {
  const [userData, setUserData] = useState<RawUserData | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        await refreshUserData();
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setUserData(null);
      return;
    }
    await user.reload();
    const fetchedData = await userAggregateService.getUserData(user.uid);
    setUserData(fetchedData ?? null);
  };

  const handleSignIn = async (email: string, password: string) => {
    await authService.loginUser(email, password);
    await refreshUserData();
  };

  const handleSignInWithGoogle = async () => {
    const user = await authService.signInWithGoogle();
    if (!user) throw new Error("Google sign-in failed.");

    const userDoc = await userAggregateService.getUserData(user.uid);
    if (!userDoc) {
      await userAggregateService.createUser({
        uid: user.uid,
        firstName: "",
        lastName: "",
        email: user.email || "",
        username: "",
      });
    }
    await refreshUserData();
  };

  const handleSignOut = async () => {
    await authService.logoutUser();
    setUserData(null);
    await refreshUserData();
  };

  const updateUserData = async (updates: EditableUserFields) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not logged in.");

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      await authService.logoutUser();
      throw new Error(
        "Your current email address must be verified before you can change it. Please check your inbox and log in again."
      );
    }

    if (updates.email && updates.email !== user.email) {
      try {
        await updateEmail(user, updates.email);
        await userAggregateService.updateUserData(user.uid, {
          email: updates.email,
        });
        await sendEmailVerification(user);
        await authService.logoutUser();
        throw new Error(
          "Your email address has been changed. Please check your new email inbox for a verification link, verify your new email and log in again. You have been signed out for security reasons."
        );
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          throw new Error("Please sign in again to change your email address.");
        }
        if (error.code === "auth/email-already-in-use") {
          throw new Error("The provided email is already in use.");
        }
        throw error;
      }
    }

    const { email, ...rest } = updates;
    if (Object.keys(rest).length > 0) {
      await userAggregateService.updateUserData(user.uid, rest);
    }
    await refreshUserData();
  };

  return (
    <LoginContext.Provider
      value={{
        userData,
        handleSignIn,
        handleSignInWithGoogle,
        handleSignOut,
        refreshUserData,
        updateUserData,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useAuth must be used within a LoginProvider");
  }
  return context;
};
