/**
 * Sets the status of whether to enable password feature
 * @param {Boolean} statusPassword
 */
export function setStatusPassword(statusPassword) {
    if (statusPassword !== true && statusPassword !== false) {
        throw Error("statusPassword must be a boolean value - true or false");
    }
    localStorage.setItem("StatusPassword", statusPassword);
   
}

/**
 * Gets the status of whether password is enabled
 * @returns {Boolean} Whether or not password is enabled
 */
export function getStatusPassword() {
    // get the status from local storage - stored as a string
    const statusPasswordString = localStorage.getItem("StatusPassword");
    // get the actual status as a bool by comparing the string to "true"
    const statusPassword = statusPasswordString === "true";
    // return a boolean of the status of password feature
    return statusPassword;
}

