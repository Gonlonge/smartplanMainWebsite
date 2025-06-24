import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

/**
 * Attempts to sign in a user using email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};
