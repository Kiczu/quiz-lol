import { EditableUserFields, EditableUserFieldsPrivate, EditableUserFieldsPublic } from "../api/types";

export const PRIVATE_FIELDS = ["email", "firstName", "lastName"];
export const PUBLIC_FIELDS = ["avatar", "scores", "totalScore", "username"];

export const splitUserUpdates = (updates: EditableUserFields) => {
    const privateData: EditableUserFieldsPrivate = {};
    const publicData: EditableUserFieldsPublic = {};

    Object.entries(updates).forEach(([key, value]) => {
        if (PRIVATE_FIELDS.includes(key as keyof EditableUserFieldsPrivate)) {
            (privateData as any)[key] = value;
        }
        if (PUBLIC_FIELDS.includes(key as keyof EditableUserFieldsPublic)) {
            (publicData as any)[key] = value;
        }
    });
    return { privateData, publicData };
};