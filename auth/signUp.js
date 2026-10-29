import { signUp } from "./auth.js";

document.getElementById("signUp").addEventListener("click", async function () {
 
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
    await signUp(email, password);
    console.log("Sign-up successful!");
    window.location.href = "menu.html";
  } catch (error) {
    console.error("Sign-up failed:", error.message);
  }
});
