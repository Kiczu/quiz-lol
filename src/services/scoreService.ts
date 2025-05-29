import { doc, setDoc, collection, query, orderBy, getDocs, getDoc, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebase/db";
import { EditableUserFields, ScoresMap, UserPublicData } from "../api/types";
import { filterEmptyFields } from "../utils/object";

const createUserPublic = async ({
    uid,
    username,
    avatar = "/default-avatar.png",
}: {
    uid: string;
    username: string;
    avatar?: string;
}) => {
    await setDoc(doc(db, "scores", uid), {
        username,
        avatar,
        scores: {},
        totalScore: 0,
    });
};

const getUserPublic = async (uid: string): Promise<UserPublicData | null> => {
    const snap = await getDoc(doc(db, "scores", uid));
    return snap.exists() ? (snap.data() as UserPublicData) : null;
};

const updateUserPublic = async (uid: string, updates: EditableUserFields) => {
    const filtered = filterEmptyFields(updates);
    if (Object.keys(filtered).length > 0) {
        await updateDoc(doc(db, "scores", uid), filtered);
    }
};

const updateUserAvatar = async (uid: string, avatarPath: string) => {
    const userDoc = doc(db, "scores", uid);
    await updateDoc(userDoc, { avatar: avatarPath });
};
const isUsernameTaken = async (username: string): Promise<boolean> => {
    const q = query(collection(db, "scores"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};
const saveGameScore = async (userId: string, gameId: string, score: number) => {
    const scoreRef = doc(db, "scores", userId);
    const scoreSnap = await getDoc(scoreRef);

    const scores: ScoresMap = scoreSnap.exists()
        ? scoreSnap.data().scores || {}
        : {};

    const current = scores[gameId] || 0;
    scores[gameId] = current + score;

    const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

    await setDoc(scoreRef, {
        scores,
        totalScore,
    }, { merge: true });
};

const getUserScores = async (userId: string): Promise<{ scores: ScoresMap; totalScore: number }> => {
    const ref = doc(db, "scores", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return { scores: {}, totalScore: 0 };
    }
    return {
        scores: snap.data().scores || {},
        totalScore: snap.data().totalScore || 0,
    };
};

const getLeaderboard = async () => {
    const userRef = collection(db, "scores");
    const leaderboardQuery = query(userRef, orderBy("totalScore", "desc"));
    const querySnapshot = await getDocs(leaderboardQuery);

    return querySnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
    }));
};

const deleteUserPublic = async (uid: string) => {
    await deleteDoc(doc(db, "scores", uid));
};

export const scoreService = {
    saveGameScore,
    createUserPublic,
    getUserPublic,
    updateUserPublic,
    updateUserAvatar,
    isUsernameTaken,
    getUserScores,
    getLeaderboard,
    deleteUserPublic,
};