import { userService } from "./userService";
import { scoreService } from "./scoreService";
import { EditableUserFields, RawUserData } from "../api/types";

const createUser = async ({
    uid,
    email,
    firstName,
    lastName,
    username,
    avatar = "/default-avatar.png",
}: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
}) => {
    await userService.createUserPrivate({ uid, email, firstName, lastName });
    await scoreService.createUserPublic({ uid, username, avatar });
};

const getUserData = async (uid: string): Promise<RawUserData | null> => {
    const privateData = await userService.getUserPrivate(uid);
    const publicData = await scoreService.getUserPublic(uid);

    if (!privateData || !publicData) return null;

    return {
        uid,
        ...privateData,
        ...publicData,
    };
};

const updateUserData = async (uid: string, updates: EditableUserFields) => {
    await Promise.all([
        userService.updateUserPrivate(uid, updates),
        scoreService.updateUserPublic(uid, updates),
    ]);
};

const deleteUserData = async (uid: string) => {
    await userService.deleteUserPrivate(uid);
    await scoreService.deleteUserPublic(uid);
};

export const userAggregateService = {
    createUser,
    getUserData,
    updateUserData,
    deleteUserData,
};
