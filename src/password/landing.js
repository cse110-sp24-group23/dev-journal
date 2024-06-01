//Wait for input password to be submitted
document.getElementById('input-password-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const inputPassword = document.getElementById('password').value;
    const storedHashedPassword = localStorage.getItem('storedHashedPassword')
    const hashedInputPassword = await hashPassword(inputPassword);
    //check if input password is the same as the stored password
    if(hashedInputPassword === storedHashedPassword){
        window.location.href = '/src/calendar/calendar.html';
    }
    //console log incorrect password if they do not match

    //TODO: show incorrect password error on the page
    else{
        console.log("incorrect password")
    }
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