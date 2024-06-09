import { getStatusMDE } from "../backend-storage/mde-mode-api.js";

function initMDE(textarea) {
    const statusMDE = getStatusMDE();
    if (statusMDE) {
        const simplemde_done_today = new SimpleMDE({
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
    }
}

export { initMDE };
