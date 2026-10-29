

 // Import Firebase Authentication and Firestore database from the configuration file
import { auth, db } from "../auth/config.js";

// Import functions used to create a new user account and sign in an existing user
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Import Firestore functions used to save user data and create a timestamp
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Function that registers a new user using their email and password
export async function signUp(email, password) {
  try {
    // Create a new user account in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Get the newly registered user's information
    const user = userCredential.user;

    // Save the user's unique ID and email address in the Firestore users collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email
    });

    // Return the registered user's information
    return user;
  } catch (error) {
    // Display the error message if registration fails
    console.log(error.message);

    // Pass the error back to the code that called this function
    throw error;
  }
}

// Function that signs in an existing user using their email and password
export async function signIn(email, password) {
  try {
    // Check the user's email and password with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Get the signed-in user's information
    const user = userCredential.user;

    // Return the signed-in user's information
    return user;
  } catch (error) {
    // Display the error message if sign-in fails
    console.log(error.message);

    // Pass the error back to the code that called this function
    throw error;
  }
}

// Function intended to handle the forgot-password process
export async function forgotPassword() {
  try {
    // Attempt to sign in using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Get the user's information after signing in
    const user = userCredential.user;

    // Return the user's information
    return user;
  } catch (error) {
    // Display the error message if the operation fails
    console.log(error.message);

    // Pass the error back to the code that called this function
    throw error;
  }
}
