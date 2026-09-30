import { region } from "firebase-functions/v1";

import { db } from "./shared";

export const deleteUserProfile = region("europe-west1")
  .runWith({ failurePolicy: true })
  .auth.user().onDelete(async (user) => {
    const batch = db.batch();
    for (const collection of ["users", "scores", "pvpQueue"]) {
      batch.delete(db.collection(collection).doc(user.uid));
    }
    const pairs = await db.collection("pvpPairs").where("playerIds", "array-contains", user.uid).get();
    pairs.docs.forEach((pair) => batch.delete(pair.ref));
    await batch.commit();
  });
