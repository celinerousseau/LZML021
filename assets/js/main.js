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

//devoirs array
function exercice1() {
  const arr = [1, 2, 3, 4, 5];
  const last = arr.pop();
  arr.unshift(last);
  document.getElementById("exercice1Resultat").innerHTML = arr.toString();
}

function exercice2() {
  const text = document.getElementById("texteExercice2").value;
  const words = text.split(" ");
  const uppercased = words.map((word) => word.toUpperCase());
  document.getElementById("exercice2Resultat").innerHTML = uppercased.join(" ");
}

function exercice3() {
  const text = document.getElementById("texteExercice3").value;
  const words = text.split(" ");
  const filtered = words.filter((word) => word.length > 3);
  document.getElementById("exercice3Resultat").innerHTML = filtered.join(" ");
}

function exercice4() {
  const text = document.getElementById("texteExercice4").value;
  const words = text.split(" ");
  const arr = [];
  words.forEach((word) => {
    const element = document.createElement("p");
    const textNode = document.createTextNode(word);
    element.appendChild(textNode);
    arr.push(element);
  });
  document.getElementById("exercice4Resultat").append(...arr);
}