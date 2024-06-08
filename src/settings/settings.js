import { setStatusMDE, getStatusMDE } from "../backend-storage/mde-mode-api.js";
/**
 * Wait for the password to be submitted.
 * @param {Event} event - The submit event.
 */
function setPassword() {
    document
        .getElementById("password-form")
        .addEventListener("submit", async function (event) {
            event.preventDefault();
            const newPassword = document.getElementById("new-password").value;
            const confirmPassword =
                document.getElementById("confirm-password").value;

            // Check if passwords match
            // If they are, hash the password and store it in local storage.
            if (newPassword === confirmPassword) {
                const hashedPassword = await hashPassword(confirmPassword);
                localStorage.setItem("storedHashedPassword", hashedPassword);
                window.location.href = "../calendar/calendar.html";
            } else {
                const errorMessage = document.getElementById("error-message");
                errorMessage.style.display = "block";
            }
        });
}
/**
 * Toggles visibility of the try again button when an error message is shown.
 */
const tryAgainBtn = document.getElementById("try-again-button");
tryAgainBtn.addEventListener("click", function () {
    const errorMessage = document.querySelector(".error");
    errorMessage.style.display = "none";
});
/**
 * Changes the visibility of the password settings form.
 * If the password protection option is checked, then the form is visible.
 */
function toggleErrorDisplay() {
    document
        .getElementById("toggle-password-form")
        .addEventListener("change", function () {
            const form = document.getElementById("password-form");
            if (this.checked) {
                form.classList.remove("hidden");
            } else {
                form.classList.add("hidden");
            }
        });
}
/**
 * Redirects to landing page after clicking logout
 */
document.getElementById("logout-button").addEventListener("click", function () {
    window.location.href = "../password/landing.html";
});

/**
 * Hashes the input password using SHA-256 algorithm.
 * @param {string} password - The input password from the user.
 * @returns {Promise<string>} The hashed input password.
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
/**
 * This function checks whether the user wants MD editing enabled or not
 * @function
 * @name updateStatusMDE
 */
function updateStatusMDE() {
    //select the checkbox input from the HTML
    const mdeCheckbox = document.querySelector(".js-mde-checkbox");
    mdeCheckbox.addEventListener("click", () => {
        let statusMDE;
        //check its status
        if (mdeCheckbox.checked == true) {
            statusMDE = true;
        } else {
            statusMDE = false;
        }
        //update the status
        setStatusMDE(statusMDE);
    });
}
/**
 * This function is called when the window is loaded.
 * @function
 * @name window.onload
 */
window.onload = function () {
    const mdeCheckbox = document.querySelector(".js-mde-checkbox");
    if (!getStatusMDE()) {
        mdeCheckbox.checked = false;
    }
    setPassword();
    toggleErrorDisplay();
    displayPasswordForm();
    updateStatusMDE();
};
