/**
 * Sets the status of whether to enable markdown editing
 * @param {Boolean} statusMDE
 */
export default function setStatusMDE(statusMDE) {
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
    return localStorage.getItem("StatusMDE");
}
