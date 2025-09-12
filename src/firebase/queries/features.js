// src/services/features.js
import {
    doc,
    onSnapshot,
    query,
    where,
    limit,
    collection,
    updateDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    ref as fbRef,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../../firebaseConfig";

/** Lytt på ett feature-dokument med docId ELLER slug. returnerer unsubscribe() */
export function listenFeature({ docId, slug }, onData, onError) {
    if (!docId && !slug) {
        // ingen kilde å lytte på – rapporter tomt
        queueMicrotask(() => onData(null, null));
        return () => {};
    }

    if (docId) {
        const ref = doc(db, "features", docId);
        return onSnapshot(
            ref,
            (snap) =>
                onData(
                    snap.exists() ? { id: snap.id, ...snap.data() } : null,
                    snap.id
                ),
            onError
        );
    }

    const qy = query(
        collection(db, "features"),
        where("slug", "==", slug),
        limit(1)
    );
    return onSnapshot(
        qy,
        (qs) => {
            if (!qs.empty) {
                const d = qs.docs[0];
                onData({ id: d.id, ...d.data() }, d.id);
            } else {
                onData(null, null); // ikke funnet (tillat opprettelse)
            }
        },
        onError
    );
}

/** Opprett dokument hvis det mangler. Returnerer id. */
export async function ensureFeatureDoc({ slug, initial }) {
    if (!slug) throw new Error("Mangler slug for å opprette dokument.");
    const created = await addDoc(collection(db, "features"), {
        slug,
        titleTwo: initial?.titleTwo ?? "",
        description: initial?.description ?? "",
        longDescription: initial?.longDescription ?? "",
        images: initial?.images ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return created.id;
}

/** Oppdater felt i feature-dokumentet */
export async function updateFeatureDoc(id, data) {
    if (!id) throw new Error("Mangler dokument-ID ved oppdatering.");
    await updateDoc(doc(db, "features", id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

/** Slugify som i komponenten */
export function slugify(t) {
    return (
        t
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || ""
    );
}

/**
 * Last opp en liste med File-objekter parallelt til Storage.
 * setProgress er valgfri callback: (key, percent) => void
 * Returnerer en array av downloadURL'er i samme rekkefølge som files.
 */
export async function uploadFilesToFeatureBottom({
    featureId,
    files,
    folderSlug, // typisk effektive slug
    setProgress, // optional
}) {
    if (!featureId) throw new Error("Mangler featureId for opplasting.");
    if (!files?.length) return [];

    const uploads = files.map((file) => {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const key = `${file.name}-${file.size}`;
        const path = `features/${folderSlug}/bottom/${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;
        const fileRef = fbRef(storage, path);
        const task = uploadBytesResumable(fileRef, file, {
            contentType: file.type || "image/jpeg",
        });

        return new Promise((resolve, reject) => {
            task.on(
                "state_changed",
                (snap) => {
                    if (setProgress) {
                        const pct = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        setProgress(key, pct);
                    }
                },
                (err) => reject(err),
                async () => {
                    const url = await getDownloadURL(task.snapshot.ref);
                    resolve(url);
                }
            );
        });
    });

    return Promise.all(uploads);
}

/** Append bilder til images[] i dokumentet */
export async function appendImages(featureId, urls) {
    if (!featureId) throw new Error("Mangler featureId for appendImages.");
    const ref = doc(db, "features", featureId);
    // Les-modifiser-skriv unngås her siden du allerede har local state;
    // du kan også velge arrayUnion hvis du vil (men krever unike objekter)
    // Her skriver vi bare hele images fra kallstedet vanligvis.
    // Denne brukes kun hvis du vil legge til basert på eksisterende i DB:
    // For enkelhet forventer vi at kallstedet sender "next" i updateFeatureDoc.
    await updateDoc(ref, { updatedAt: serverTimestamp() });
}
