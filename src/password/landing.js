import {getStatusPassword } from "../backend-storage/password-mode-api.js";
document.addEventListener('DOMContentLoaded', () => {
if(getStatusPassword()){
//Wait for input password to be submitted
document.getElementById('input-password-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const inputPassword = document.getElementById('password').value;
    //hashed version of the input
    const hashedInputPassword = await hashPassword(inputPassword);
    //retrive the stored hashed password
    const storedHashedPassword = localStorage.getItem('storedHashedPassword');
    //set the authentication key to the hashed input password. this will be hashed again to verify the user has logged in
    sessionStorage.setItem('authenticateKey', hashedInputPassword)
    //check if input password is the same as the stored password, and redirect to the calendar if they are
    const welcomeBtn = document.getElementById('welcome-button');
    welcomeBtn.style.display = 'none'
    if(hashedInputPassword === storedHashedPassword){
        window.location.href = '../calendar/calendar.html';
    }
    //display incorrect password error if they do not match
    else{
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
})
}
//go directly to the calendar page if there is no password set
else{
    const passwordForm = document.getElementById("input-password-form");
    passwordForm.style.display = 'none'
    const welcomeBtn = document.getElementById('welcome-button');
    welcomeBtn.style.display = 'block';
    welcomeBtn.addEventListener('click', function(){
        window.location.href = '../calendar/calendar.html';
    })
}
});

//Toggles visibility of the try again button when an error message is shown.
const tryAgainBtn = document.getElementById('try-again-button')
tryAgainBtn.addEventListener('click', function(){
    const errorMessage = document.querySelector('.error');
    errorMessage.style.display='none';
    document.getElementById('password').value = '';
})

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
