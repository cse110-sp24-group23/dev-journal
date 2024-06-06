document.addEventListener('DOMContentLoaded', () => {
if(localStorage.getItem('storedHashedPassword')){
    document.getElementById('welcome-button').style.display = 'none'
//Wait for input password to be submitted
document.getElementById('input-password-form').addEventListener('submit', async function(event){
    console.log("here")
    event.preventDefault();
    const inputPassword = document.getElementById('password').value;
    const hashedInputPassword = await hashPassword(inputPassword);
    const storedHashedPassword = localStorage.getItem('storedHashedPassword');
    localStorage.setItem('authenticateKey', hashedInputPassword)
    //check if input password is the same as the stored password
    if(hashedInputPassword === storedHashedPassword){
        window.location.href = '/src/calendar/calendar.html';
    }
    //console log incorrect password if they do not match

    else{
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
})
}
//go directly to the calendar page if there is no password set
else{
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display='none';
    const welcomeButton = document.getElementById('welcome-button');
    welcomeButton.addEventListener('click',function(){
        window.location.href = "/src/calendar/calendar.html"
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
