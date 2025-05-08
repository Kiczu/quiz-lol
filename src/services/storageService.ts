import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${userId}_${file.name}`);
    await uploadBytes(avatarRef, file);
    return await getDownloadURL(avatarRef);
}

export const storageService = {
    uploadUserAvatar,
};
