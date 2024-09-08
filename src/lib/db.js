// src/lib/db.js
import { openDB } from "idb";

let dbPromise;

if (typeof window !== "undefined") {
    dbPromise = openDB("TextCondenserDB", 1, {
        upgrade(db) {
            db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
        },
    });
}

export async function getAllEntries() {
    if (!dbPromise) return [];
    const db = await dbPromise;
    let entries = await db.getAll("entries");
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries;
}

export async function addEntry(entry) {
    if (!dbPromise) return null;
    const db = await dbPromise;
    return db.add("entries", { ...entry, date: new Date().toISOString() });
}

export async function getEntry(id) {
    if (!dbPromise) return null;
    const db = await dbPromise;
    return db.get("entries", id);
}

export async function updateEntry(id, entry) {
    if (!dbPromise) return null;
    const db = await dbPromise;
    return db.put("entries", { ...entry, id, date: new Date().toISOString() });
}

export async function deleteEntry(id) {
    if (!dbPromise) return null;
    const db = await dbPromise;
    return db.delete("entries", id);
}
