
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { auth } from "./auth/config.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("UserName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const terms = document.getElementById("terms").checked;
    const message = document.getElementById("registerMessage");

    if (username === "" || email === "" || password === "") {
        message.textContent = "Please fill in all the fields.";
        return;
    }

    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        return;
    }

    if (!terms) {
        message.textContent = "Please accept the Terms and Conditions.";
        return;
    }

    try {
        message.textContent = "Creating your account...";

        await createUserWithEmailAndPassword(auth, email, password);

        message.textContent = "Account created successfully!";

        // Redirect to the FoodDash homepage
        window.location.href = "./index.html";

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "auth/email-already-in-use") {
            message.textContent = "This email address is already registered.";
        } else if (error.code === "auth/weak-password") {
            message.textContent = "Please choose a stronger password.";
        } else {
            message.textContent =
                "Could not create your account. Please try again.";
        }
    }
});
