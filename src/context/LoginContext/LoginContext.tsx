import React, { createContext, useEffect, useState, useContext } from "react";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import { UserPrivateData, UserPublicData } from "../../api/types";

interface Props {
  children: React.ReactNode;
}

interface LoginContextType {
  userData: (UserPrivateData & UserPublicData) | null;
  handleCreateUser: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
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

  const handleCreateUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const user = await authService.registerUser(email, password, {
      firstName,
      lastName,
    });
    if (!user) throw new Error("User creation failed.");

    await userService.createUser({
      id: user.uid,
      firstName,
      lastName,
      email: user.email || "",
      avatar: "/default-avatar.png",
      username: "",
    });

    await refreshUserData();
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
        id: user.uid,
        firstName: "",
        lastName: "",
        email: user.email || "",
        avatar: "/default-avatar.png",
        username: "",
      });
    }

    await refreshUserData();
  };

  const handleSignOut = async () => {
    await authService.logoutUser();
    setUserData(null);
  };

  const updateUsername = async (newUsername: string) => {
    if (!userData) throw new Error("No user data available.");

    await userService.updateUsername(userData.uid, newUsername);
    await refreshUserData();
  };

  return (
    <LoginContext.Provider
      value={{
        userData,
        handleCreateUser,
        handleSignIn,
        handleSignInWithGoogle,
        handleSignOut,
        refreshUserData,
        updateUsername,
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
