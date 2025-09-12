// src/hooks/useFeatureImages.js
import { useEffect, useState } from "react";
import {
    doc,
    onSnapshot,
    query,
    where,
    limit as qlimit,
    collection,
    updateDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";

function extractStoragePath(url) {
    try {
        const m = url.match(/\/o\/([^?]+)/);
        if (!m) return null;
        return decodeURIComponent(m[1]);
    } catch {
        return null;
    }
}

export function useFeatureImages({ docId, slug, field = "images" }) {
    const [state, setState] = useState({
        resolvedDocId: docId || null,
        images: [],
        loading: !!(!docId && !slug ? false : true),
        error: "",
    });

    // Realtime fetch
    useEffect(() => {
        if (!docId && !slug) {
            setState((s) => ({ ...s, loading: false }));
            return;
        }

        setState((s) => ({ ...s, loading: true, error: "" }));
        let unsub;

        const apply = (data, id) => {
            const arr = data && Array.isArray(data[field]) ? data[field] : [];
            setState({
                resolvedDocId: id || docId || null,
                images: arr,
                loading: false,
                error: "",
            });
        };

        const onErr = (err) =>
            setState((s) => ({
                ...s,
                loading: false,
                error: err.message || "Kunne ikke hente bilder.",
            }));

        if (docId) {
            const ref = doc(db, "features", docId);
            unsub = onSnapshot(
                ref,
                (snap) => {
                    if (snap.exists()) apply(snap.data() || {}, snap.id);
                    else setState((s) => ({ ...s, loading: false }));
                },
                onErr
            );
        } else {
            const qy = query(
                collection(db, "features"),
                where("slug", "==", slug),
                qlimit(1)
            );
            unsub = onSnapshot(
                qy,
                (qs) => {
                    if (!qs.empty) {
                        const d = qs.docs[0];
                        apply(d.data() || {}, d.id);
                    } else {
                        setState({
                            resolvedDocId: null,
                            images: [],
                            loading: false,
                            error: "",
                        });
                    }
                },
                onErr
            );
        }

        return () => unsub && unsub();
    }, [docId, slug, field]);

    // Delete one image by absolute index
    const removeAt = async (
        absoluteIndex,
        { deleteFromStorage = true } = {}
    ) => {
        if (absoluteIndex == null) return;

        const { images, resolvedDocId } = state;
        if (!resolvedDocId) return;

        const urlToDelete = images[absoluteIndex];
        const next = images.slice();
        next.splice(absoluteIndex, 1);

        try {
            await updateDoc(doc(db, "features", resolvedDocId), {
                [field]: next,
            });
            setState((s) => ({ ...s, images: next }));

            if (deleteFromStorage && urlToDelete) {
                const path = extractStoragePath(urlToDelete);
                if (path) {
                    try {
                        await deleteObject(storageRef(storage, path));
                    } catch {
                        // Storage-sletting er “best effort”
                        setState((s) => ({
                            ...s,
                            error: "Bildet ble fjernet fra listen, men kunne ikke slettes fra Storage.",
                        }));
                    }
                }
            }
        } catch (e) {
            setState((s) => ({
                ...s,
                error: e.message || "Kunne ikke fjerne bilde.",
            }));
        }
    };

    return { ...state, removeAt };
}
