/*global SimpleMDE*/
// ^^ show SimpleMDE is a global function to not aggravate linter
import { getStatusMDE } from "../backend-storage/mde-mode-api.js";

function initMDE(textarea) {
    const statusMDE = getStatusMDE();
    if (statusMDE) {
        const content = new SimpleMDE({
            element: textarea,
            forceSync: true,
            parsingConfig: {
                allowAtxHeaderWithoutSpace: true,
            },
            promptURLs: true,
            tabSize: 4,
            toolbar: [
                "bold",
                "heading",
                "unordered-list",
                "ordered-list",
                "link",
                "preview",
                "side-by-side",
                "fullscreen",
                "guide",
            ],
        });
        return content;
    }
}

export { initMDE };
