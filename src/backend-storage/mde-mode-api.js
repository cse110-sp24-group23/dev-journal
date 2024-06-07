/**
 * Sets the status of whether to enable markdown editing
 * @param {Boolean} statusMDE
 */
function setStatusMDE(statusMDE) {
    localStorage.setItem("StatusMDE", statusMDE);
}

/**
 * Gets the status of whether markdown editing is enabled
 * @returns {Boolean} Whether or not markdown editing is enabled
 */
function getStatusMDE() {
    return localStorage.getItem("StatusMDE");
}
