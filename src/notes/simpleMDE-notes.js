function init() {
    const simplemde_done_today = new SimpleMDE({
        element: document.getElementById("note-editor-content"),
        forceSync: true,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true,
        },
        promptURLs: true,
        tabSize: 4,
        toolbar: ["bold", "heading", "unordered-list", "ordered-list", "link", "preview", "side-by-side", "fullscreen", "guide"],
    });
}

export {init};