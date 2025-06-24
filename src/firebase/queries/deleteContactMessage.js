// src/firebase/queries/deleteContactMessage.js
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * DELETE: Sletter en kontaktmelding etter ID.
 */
export const deleteContactMessage = async (messageId) => {
    const messageRef = doc(db, "contactMessages", messageId);
    await deleteDoc(messageRef);
};
