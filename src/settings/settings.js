import { setStatusMDE, getStatusMDE } from "../backend-storage/mde-mode-api.js";

/**
 * Sets the status of markdown editing based on the user's actions
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
    // Make sure the checkbox for markdown editing is checked/unchecked dependign on status
    const mdeCheckbox = document.querySelector(".js-mde-checkbox");
    // It is checked by default, so if the status is false, make it unchecked
    if (!getStatusMDE()) {
        mdeCheckbox.checked = false;
    }
    // Listen for clicks clicks on the checkbox to set the status of markdown editing
    updateStatusMDE();
};
