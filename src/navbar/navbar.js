/*
This function loads the navbar component so it can be easily reused on multiple pages
To use it add the following code to head (assuming the html file is in a child folder of source):
<script src="../navbar/navbar.js"></script>
and following code to body:
<div id="navbar"></div>
Parameters: 
- NONE
Returns:
- navbar
*/
function loadNavbar() {
    fetch("../navbar/navbar.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("navbar").innerHTML = data;
            document.head.insertAdjacentHTML(
                "beforeend",
                '<link rel="stylesheet" href="../navbar/navbar.css">'
            );
            // clears session storage, when nav bar is clicked
            clearSessionStorage();
            // add class to determine active link
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach((link) => {
                // Split the href of the link and the current path by "/"
                // and compare the last segments of both match
                if (
                    link.getAttribute("href").split("/").pop() ===
                    currentPath.split("/").pop()
                ) {
                    // get the record from session storage
                    const recordString =
                        sessionStorage.getItem("current record");
                    // parse the record from string to object using JSON
                    const record = JSON.parse(recordString);
                    // if the record is null, add active to classname
                    if (!record) {
                        link.classList.add("active");
                    } else {
                        const date = new Date(record.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        // if date of record is equal today's date, add active to addname
                        if (date.getTime() === today.getTime()) {
                            link.classList.add("active");
                        }
                    }
                }
            });
        })
        .catch((error) => console.error("Error loading navbar", error));
}

/*
Clears the session storage when a tab on the nav bar is clicked.
Parameters:
    - NONE
Returns:
    - NONE
*/
function clearSessionStorage() {
    const links = document.getElementsByClassName("js-nav-link");
    for (const link of links) {
        link.addEventListener("click", () => {
            sessionStorage.removeItem("current record");
        });
    }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
