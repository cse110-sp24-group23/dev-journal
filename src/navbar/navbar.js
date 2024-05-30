/*
This function loads the navbar component so it can be easily reused on multiple pages
To use it add the following code to head:
<script src="/src/navbar/navbar.js"></script>
and following code to body:
<div id="navbar"></div>
Parameters:
NONE
Returns:
- navbar
*/
function loadNavbar() {
    fetch("/src/navbar/navbar.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("navbar").innerHTML = data;
            document.head.insertAdjacentHTML(
                "beforeend",
                '<link rel="stylesheet" href="/src/navbar/navbar.css">'
            );

            //Add class to determine active link
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        })
        .catch((error) => console.error("Error loading navbar", error));
}

document.addEventListener("DOMContentLoaded", loadNavbar);
