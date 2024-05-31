//Wait for the password to be submitted 
document.getElementById('password-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    //Check if new password and confirmed password are the same. If they are, hash the password and store it in
    //local storage.
    if (newPassword === confirmPassword){
        const hashedPassword = await hashPassword(confirmPassword);
        localStorage.setItem('storedHashedPassword', hashedPassword);
        window.location.href = '/src/calendar/calendar.html';
    }
     //console log incorrect password if the passwords do not match
     //TODO: show incorrect password error on the page
    else{
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
})
document.getElementById('try-again-button').addEventListener('click', function(){
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display='none';
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
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}