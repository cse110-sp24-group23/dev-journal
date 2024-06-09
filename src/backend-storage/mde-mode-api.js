/**
 * Sets the status of whether to enable markdown editing
 * @param {Boolean} statusMDE
 */
export function setStatusMDE(statusMDE) {
    if (statusMDE !== true && statusMDE !== false) {
        throw Error("statusMDE must be a boolean value - true or false");
    }
    localStorage.setItem("StatusMDE", statusMDE);
}

/**
 * Gets the status of whether markdown editing is enabled
 * @returns {Boolean} Whether or not markdown editing is enabled
 */
export function getStatusMDE() {
    // get the status from local storage - stored as a string
    const statusMDEString = localStorage.getItem("StatusMDE");
    // get the actual status as a bool by comparing the string to "true"
    const statusMDE = statusMDEString === "true";
    // return a boolean of the status of markdown editing
    return statusMDE;
}
