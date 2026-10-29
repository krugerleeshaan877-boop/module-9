
// Import the forgotPassword function from the authentication module
import {forgotPassword} from "./auth.js";

// Find the forgot-password button and run this function when it is clicked
document.getElementById("forgotbutton").addEventListener("click", async function () {
try {
    // Call the forgotPassword function with the provided email and password
await forgotPassword("youbetterwork@gmail.com", "zandie");

    // Display a success message if the function completes successfully
console.log("Sign-In successful!");
} catch (error) {
    // Display an error message if the function fails
console.error("Sign-In failed:", error.message);
}
});
