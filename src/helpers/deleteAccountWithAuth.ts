import { deleteUser } from "firebase/auth";
import { authService } from "../services/authService";
import { userAggregateService } from "../services/userAggregateService";

export const deleteAccountWithAuth = async (password?: string) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    if (password) await authService.reauthenticateUser(password);
    await deleteUser(user);
    await userAggregateService.deleteUserData(user.uid);
};
