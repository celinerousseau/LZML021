//nav bar
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        // Get the current page URL
        let url = window.location.pathname;
        // Loop through the navigation links and add the "active" class to the link that matches the current page URL
        let links = document.querySelectorAll(".menu a");
        links.forEach(link => {
            if (link.dataset.page && url.endsWith(link.getAttribute("href"))) {
                link.classList.add("active");
            }
        });
    });


//footer
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
});

//devoirs
function showDiv() {
    var div = document.getElementById("devoirs-string");
    div.style.display = "block";
}

//devoirs string
    // exercice 1
    function prenom() {
        var prenom = document.getElementById("prenom").value;
        document.getElementById("holder1").innerHTML = prenom;
    }

    function nomdefamille() {
        var nom = document.getElementById("nomdefamille").value;
        document.getElementById("holder1").innerHTML = nom;
    }

    function nomcomplet() {
        var prenom = document.getElementById("prenom").value;
        var nom = document.getElementById("nomdefamille").value;
        var nomComplet = prenom + " " + nom;
        document.getElementById("holder1").innerHTML = nomComplet;
    }

    // exercice 2
    function segmentText() {
        var texte = document.getElementById("texte").value;
        var mots = texte.split(" ");
        var motsString = mots.join(", ");
        document.getElementById("holder2").innerHTML = motsString;
    }
