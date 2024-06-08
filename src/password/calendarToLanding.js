//check to see if a password exists. if it does, then make sure the user stays on the password page until they log in.
import {getStatusPassword } from "../backend-storage/password-mode-api.js";
if(getStatusPassword()){
document.addEventListener('DOMContentLoaded', async function (){
    //hash the input again and see if it matches with the double hashed password
    const authenticateValue = await hashPassword(sessionStorage.getItem('authenticateKey'))
    if (localStorage.getItem('authenticateValue') !== authenticateValue) {
        window.location.href = '/src/password/landing.html'; // Redirect to password page
    }

})
}

/*
Hashes the input password using SHA-256 algorithm
Parameters:
    input password from user
Returns:
    hashed input password
*/
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}
