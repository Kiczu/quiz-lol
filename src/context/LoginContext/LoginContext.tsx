import React, { createContext, useEffect, useState, useContext } from "react";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import {
  EditableUserFields,
  UserPrivateData,
  UserPublicData,
} from "../../api/types";

interface Props {
  children: React.ReactNode;
}

interface LoginContextType {
  userData: (UserPrivateData & UserPublicData) | null;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserProfile: (updates: EditableUserFields) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: Props) => {
  const [userData, setUserData] = useState<
    (UserPrivateData & UserPublicData) | null
  >(null);

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

    const userData = await userService.getUserData(user.uid);
    setUserData(userData);
  };

  const handleSignIn = async (email: string, password: string) => {
    await authService.loginUser(email, password);
    await refreshUserData();
  };

  const handleSignInWithGoogle = async () => {
    const user = await authService.signInWithGoogle();
    if (!user) throw new Error("Google sign-in failed.");

    const userDoc = await userService.getUserData(user.uid);
    if (!userDoc) {
      await userService.createUser({
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
  };

  const updateUserProfile = async (updates: EditableUserFields) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not logged in.");

    await userService.updateUserData(user.uid, updates);
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
        updateUserProfile,
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
