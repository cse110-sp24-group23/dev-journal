// Wait until page loads
window.addEventListener('DOMContentLoaded', init);

/* 
Create two SimpleMDE objects to apply to text areas
Parameters: N/A
Returns: N/A
 */
function init() {

    const simplemde_done_today = new SimpleMDE({
        element: document.getElementById("done-today"),
        autosave: {
            enabled: true,
            uniqueId: "Done_Today",
            delay: 1000,
        },
        forceSync: true,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true,
        },
        promptURLs: true,
        tabSize: 4,
    });

    const simplemde_reflection = new SimpleMDE({
        element: document.getElementById("reflection"),
        autosave: {
            enabled: true,
            uniqueId: "Reflection",
            delay: 1000,
        },
        forceSync: true,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true,
        },
        promptURLs: true,
        tabSize: 4,
    });
}
