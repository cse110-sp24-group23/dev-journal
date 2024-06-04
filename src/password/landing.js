document.addEventListener('DOMContentLoaded', (event) => {
if(localStorage.getItem('storedHashedPassword')){
//Wait for input password to be submitted
document.getElementById('input-password-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const inputPassword = document.getElementById('password').value;
    const hashedInputPassword = await hashPassword(inputPassword);
    const storedHashedPassword = localStorage.getItem('storedHashedPassword');
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
else{
    //go directly to the calendar page if there is no password set
    window.location.href = '/src/calendar/calendar.html';
}
});


//Toggles visibility of the try again button when an error message is shown.
const tryAgainBtn = document.getElementById('try-again-button')
tryAgainBtn.addEventListener('click', function(){
    const errorMessage = document.querySelector('.error');
    errorMessage.style.display='none';
})

/*
    Hashes the input password using SHA-256 algorithm
    Parameters:
        input password from user
    Returns:
        hashed input password
    */
async function hashPassword(password){
    const msgUint8 = new TextEncoder().encode(password); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); 
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); 
    return hashHex;
}

