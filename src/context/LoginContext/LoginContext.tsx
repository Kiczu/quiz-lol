import React, { createContext, useEffect, useState, useContext } from "react";
import { sendEmailVerification, updateEmail } from "firebase/auth";
import { authService } from "../../services/authService";
import { EditableUserFields, RawUserData } from "../../api/types";
import { userAggregateService } from "../../services/userAggregateService";
import { getErrorMessage } from "../../utils/errorUtils";
import { useModal } from "../ModalContext/ModalContext";

interface Props {
  children: React.ReactNode;
}

interface LoginContextType {
  userData: RawUserData | null;
  isLoading: boolean;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserData: (updates: EditableUserFields) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: Props) => {
  const [userData, setUserData] = useState<RawUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showErrorModal, showModal } = useModal();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        await refreshUserData();
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    setIsLoading(true);
    const user = authService.getCurrentUser();
    if (!user) {
      setUserData(null);
      setIsLoading(false);
      return;
    }
    await user.reload();
    const fetchedData = await userAggregateService.getUserData(user.uid);
    setUserData(fetchedData ?? null);
    setIsLoading(false);
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
    showModal({
      variant: "success",
      title: "Logout",
      content: "You have been logged out successfully.",
      actions: undefined,
      disableClose: false,
    });
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
        const error = new Error(
          "You are changing your e-mail address. Please confirm your new e-mail using the link sent to your new address and log in again. Other changes will not be saved for security reasons."
        );
        (error as any).code = "email-change";
        throw error;
      } catch (error: unknown) {
        showErrorModal(getErrorMessage(error));
        throw error;
      }
    }
    if (Object.keys(updates).length > 0) {
      await userAggregateService.updateUserData(user.uid, updates);
    }
    await refreshUserData();
  };
  return (
    <LoginContext.Provider
      value={{
        userData,
        isLoading,
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
