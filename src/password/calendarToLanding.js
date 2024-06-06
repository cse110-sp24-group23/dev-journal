if(localStorage.getItem('storedHashedPassword')){
document.addEventListener('DOMContentLoaded', async function (event){
    const authenticateValue = await hashPassword(localStorage.getItem('authenticateKey'))
    if (localStorage.getItem('authenticateValue') !== authenticateValue) {
        window.location.href = '/src/password/landing.html'; // Redirect to password page
    }
})
}
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}
