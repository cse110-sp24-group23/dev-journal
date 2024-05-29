document.getElementById('password-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const inputPassword = document.getElementById('password').value;
    const storedHashedPassword = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    const hashedInputPassword = await hashPassword(inputPassword);
    if(hashedInputPassword === storedHashedPassword){
        window.location.href = '/src/calendar/calendar.html';
    }
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