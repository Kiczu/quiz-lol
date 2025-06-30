import { authService } from "../../../services/authService";

import AddPasswordForm from "./AddPasswordForm/AddPasswordForm";
import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm";

const PasswordSection = () => {
  const user = authService.getCurrentUser();

  if (!user) return null;

  const hasPassword = user.providerData.some(
    (p) => p.providerId === "password"
  );

  return hasPassword ? (
    <ChangePasswordForm />
  ) : (
    <AddPasswordForm email={user.email || ""} />
  );
};

export default PasswordSection;
