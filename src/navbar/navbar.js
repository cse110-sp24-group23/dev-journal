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
                console.log(link);
                if (link.getAttribute("href") === currentPath) {
                    const recordString =
                        sessionStorage.getItem("current record");
                    const record = JSON.parse(recordString);
                    if (!record) {
                        link.classList.add("active");
                    } else {
                        const date = new Date(record.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date.getTime() === today.getTime()) {
                            link.classList.add("active");
                        }
                    }
                }
            });
        })
        .catch((error) => console.error("Error loading navbar", error));
}

function clearSessionStorage() {
    const links = document.getElementsByClassName("js-nav-link");
    for (const link of links) {
        link.addEventListener("click", () => {
            sessionStorage.removeItem("current record");
        });
    }
}
document.addEventListener("DOMContentLoaded", loadNavbar);
