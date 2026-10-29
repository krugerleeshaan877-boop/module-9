import { signIn } from "./auth.js";
document.getElementById("signIn").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(email === ""){
        alert("Please enter your email");
        return;
    };
    if(password === ""){
        alert("Please enter your password");
        return;
    }
  try {
    await signIn(email, password);
    window.location.href = "menu.html";
    console.log("Sign-In successful!");
  } catch (error) {
    console.error("Sign-In failed:", error.message);
  }
});
