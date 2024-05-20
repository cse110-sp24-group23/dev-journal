const SimpleMDE = require("simplemde");

//var simplemde_done_today = new SimpleMDE({ element: document.getElementById("done-today") });
//simplemde_done_today.element = document.getElementById("done-today");

var simplemde_done_today = new SimpleMDE({
    element: document.getElementById("done-today"),
    autosave: {
        enabled: true,
        uniqueId: "Done_Today",
    },
    forceSync: true,
    parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
    },
    promptURLs: true,
    tabSize: 4,
});


var simplemde_reflection = new SimpleMDE({
    element: document.getElementById("reflection"),
    autosave: {
        enabled: true,
        uniqueId: "Reflection",
    },
    forceSync: true,
    parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
    },
    promptURLs: true,
    tabSize: 4,
});

module.exports = {simplemde_done_today,simplemde_reflection};