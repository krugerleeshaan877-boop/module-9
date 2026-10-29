
 // Import the Firestore database configuration
import { db } from "../auth/config.js";

// Import Firestore functions used to create, retrieve, update, and delete data
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// 1. Get all documents from a collection
// Retrieve all documents stored in the specified Firestore collection
export async function getAllData(collectionName) {
    // Get a snapshot containing the documents in the collection
    const snapshot = await getDocs(
        collection(db, collectionName)
    );

    // Convert the documents into an array containing each document's ID and data
    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
    }));
}

// 2. Save data using an automatically generated ID
// Add a new document to a collection and let Firestore generate its ID
export async function saveData(collectionName, data) {
    // Add the supplied data to the specified collection
    const docRef = await addDoc(
        collection(db, collectionName),
        data
    );

    // Return the ID generated for the new document
    return docRef.id;
}

// 3. Save data using a specific document ID
// Save data under a document ID supplied by the caller
export async function saveDataWithId(collectionName, id, data) {
    // Create or replace the document with the specified ID and data
    await setDoc(
        doc(db, collectionName, id),
        data
    );

    // Return the document ID
    return id;
}

// 4. Retrieve one document by ID
// Find and retrieve a single document from a collection using its ID
export async function getDataById(collectionName, id) {
    // Request the document from Firestore
    const snapshot = await getDoc(
        doc(db, collectionName, id)
    );

    // Return null if the requested document does not exist
    if (!snapshot.exists()) {
        return null;
    }

    // Return the document ID together with its stored data
    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

// 5. Update an existing document
// Change fields in a document that already exists in Firestore
export async function updateData(collectionName, id, data) {
    // Update the specified document with the supplied data
    await updateDoc(
        doc(db, collectionName, id),
        data
    );
}

// 6. Delete a document
// Remove a document from a Firestore collection using its ID
export async function deleteData(collectionName, id) {
    // Delete the specified document from Firestore
    await deleteDoc(
        doc(db, collectionName, id)
    );
}
