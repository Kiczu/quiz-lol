import { EditableUserFields, RawUserData } from "../api/types";
import { splitUserUpdates } from "../utils/splitUserUpdates";

import { scoreService } from "./scoreService";
import { userService } from "./userService";

const createUser = async ({
    uid,
    email,
    firstName,
    lastName,
    username,
    avatar = null,
}: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string | null;
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
    const { privateData, publicData } = splitUserUpdates(updates);

    await Promise.all([
        userService.updateUserPrivate(uid, privateData),
        scoreService.updateUserPublic(uid, publicData),
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
