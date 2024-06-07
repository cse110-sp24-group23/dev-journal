/**
 * Checks the password submitted against the correct stored password
 */
function checkPassword() {
    if (localStorage.getItem("storedHashedPassword")) {
        // Wait for input password to be submitted
        document
            .querySelector(".js-input-password-form")
            .addEventListener("submit", async function (event) {
                event.preventDefault();
                // Get submitted password, and hash it to compare against stored password
                const inputPassword =
                    document.querySelector(".js-password").value;
                const hashedInputPassword = await _hashPassword(inputPassword);
                // Get stored password
                const storedHashedPassword = localStorage.getItem(
                    "storedHashedPassword"
                );
                // Check if input password is the same as the stored password
                if (hashedInputPassword === storedHashedPassword) {
                    window.location.href = "/src/calendar/calendar.html";
                }
                // Display incorrect password message if they do not match
                else {
                    const errorMessage =
                        document.querySelector(".js-error-message");
                    errorMessage.classList.remove("hidden");
                }
            });
    }
    // Go directly to the calendar page if there is no password set
    else {
        window.location.href = "../calendar/calendar.html";
    }
}

/**
 * Hides the error message when the try again button is clicked
 */
function hideErrorMsgOnClick() {
    // Hides the error message when the try again button is clicked.
    const tryAgainBtn = document.querySelector(".js-try-again-button");
    tryAgainBtn.addEventListener("click", function () {
        const errorMessage = document.querySelector(".error");
        errorMessage.classList.add("hidden");
    });
}

/**
 * Hashes the input password using SHA-256 algorithm
 * @param {string} password input password from the user
 * @returns {string} hashed input password
 */
async function _hashPassword(password) {
    // Convert password to a Uint8 array
    const msgUint8 = new TextEncoder().encode(password);
    // Hash the array with a SHA-256 hash as a byte array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert the byte array to a hex string to be stored in localStorage
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

// Main functionality
window.onload = function () {
    checkPassword();
    hideErrorMsgOnClick();
};
