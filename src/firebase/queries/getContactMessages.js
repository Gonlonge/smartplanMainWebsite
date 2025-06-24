// src/firebase/queries/messagesQueries.js
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * GET: Henter alle kontaktmeldinger fra Firestore.
 * @returns {Promise<Array<{
 *   id: string,
 *   firstName: string,
 *   lastName: string,
 *   company: string,
 *   email: string,
 *   phone?: string,
 *   inquiryType: string,
 *   message: string,
 *   createdAt: any
 * }>>}
 */
export const getContactMessages = async () => {
    const q = query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};
