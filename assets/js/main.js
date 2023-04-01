//navbar
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        let links = document.querySelectorAll(".navbar a");
        links.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add("active");
            }
        })
    })

//footer
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
});

//Bouton Aide
function afficher() {
    let x = document.getElementById("aide");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

//Bouton outils surprise
function outilsSurprise(){
    window.open("https://www.youtube.com/embed/OeS_f7a-D-E?autoplay=1");
}

//Bouton choisir le fichier
window.onload = function() {
    if (window.location.href.indexOf("outils.html") > -1) { //évite erreur console "Uncaught TypeError: Cannot read properties of null (reading 'addEventListener') at window.onload (main.js:40:15)" sur la page index.html
        let fileInput = document.getElementById('fileInput');
        var fileDisplayArea = document.getElementById('fileDisplayArea');
        fileInput.addEventListener
        ('change', function(e) {
            let file = fileInput.files[0];
            let textType = /text.*/;
            if (file.type.match(textType)) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    fileDisplayArea.innerText = reader.result;
                    if (confirm("Désirez-vous segmenter le texte maintenant ? \n(cette opération peut prendre quelques temps)")) {//demande de confirmation
                        segmentation()
                    }
                }
                reader.readAsText(file);    
                document.getElementById("textlogger").innerHTML = '<span class="textlogger infolog">Fichier chargé avec succès</span>';
            } 
            else {
                (alert("Type de fichier non supporté. Merci de sélectionner un fichier au format .txt"))
                document.getElementById("textlogger").innerHTML = '<span class="textlogger errolog">Type de fichier non supporté</span>';
            }
        }
       );
    }
}

//Global variables
var dico = {};
var totalMots = 0;
var motsUniques = 0;
let segmenterPreums = false; //pour vérifier que le texte a bien été segmenté d'abord

//Bouton segmentation
function segmentation() {
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (fileDisplayArea.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
        // Obtenir la valeur de l'élément avec l'ID "delimID" et l'assigner à une variable nommée "delim"
        let delim = document.getElementById('delimID').value;
        // Vérifier si la variable "delim" est vide
        if (delim === '') {
            alert("Ajoutez des délimiteurs.");
            return;
        }
        else {
            totalMots = 0; //sinon, totalMots augmente à chaque fois qu'on clique sur le bouton Segmentation
            // Créer expression regex
            let regex_delim = new RegExp(
                "["
                + delim
                    .replace("-", "\\-") //le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
                    .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
                    .replace(/<\/?[^>]+>/gi, "") //enlever balises HTML
                    .replaceAll("<"," ")
                    .replaceAll(">"," ")
                + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
                + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
           );

            // Séparer le texte en lignes
            var lignes = document.getElementById('fileDisplayArea'); 
            lignes = lignes.innerText.split("\n");

            // Pour chaque ligne
            lignes.forEach((ligne) => {
                mots = ligne.split(regex_delim); // Séparer chaques lignes en mots
                mots.forEach((mot) => {
                    if (mot !== '' && mot !== ' ') { // Si le mot n'est ni vide ni un espace
                        totalMots++; // Compte de mot +1
                        if (dico[mot] === undefined) { //Si le mot n'est pas dans le dico
                            dico[mot] = {count: 1};
                            motsUniques++; //+1 mot unique
                        }
                        else {
                            dico[mot].count++; //incrémente le compteur de mot
                        }
                    }
                });
            });

            let fileDisplayArea = document.getElementById("fileDisplayArea").innerText;
            let display = document.getElementById("page-analysis");
            let tokens = fileDisplayArea.split(regex_delim);
            tokens = tokens.filter(x => x.trim() != '');
            display.innerHTML = tokens.join(" ");

            // Afficher résultat
            placeholder.innerHTML = `<small>Segmentation terminée. <br /> Nombre total de mots: ${totalMots} <br /> Nombre de mots uniques: ${motsUniques} </small>`; //ne pas modifier les guillemets bizarres (backticks)
            segmenterPreums = true;  //le texte a bien été segmenté
        }
    }
}

//Bouton Dictionnaire
function dictionnaire() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
        if (segmenterPreums) { //si le texte a bien été segmenté
            //création du tableau pour afficher le dictionnaire
            var tableau='';
            tableau +='<table align="center" class="myTable">';
            tableau +='<tr><th colspan="5"><b>Dictionnaire</b></th></tr>';
            tableau +='<th width="25%">Mot</th>';
            tableau +='<th width="25%">Nombre d\'occurences</th>';
            tableau +='<th width="25%">Nombre de lettres</th>';
            tableau +='<th width="25%">Première lettre</th>';
            tableau +='</tr>';
            var motsRanges = Object.keys(dico); //extrait les mots du dico
            motsRanges.sort(function(a,b) { //ordonne les mots
                let x = dico[a].count;
                let y = dico[b].count;
                return x < y ? 1 : x > y ? -1 : 0;
            })
            for (var i=0; i<motsRanges.length;i++) { //Valeurs qui seront dans le tableau
                tableau +="<tr><td>"+motsRanges[i]+"</td><td>"+dico[motsRanges[i]].count+"</td><td>"+motsRanges[i].length+"</td><td>"+motsRanges[i].substring(0,1).toLowerCase()+"</td></tr>";//ajout du contenu dans les colonnes
            }
            tableau +='</table>';
            document.getElementById('page-analysis').innerHTML = tableau;
        }
        else { //si le texte pas segmenté
            alert("Vous devez segmentez le texte avant de pouvoir utiliser cette fonctionnalité !");
        }
    }
}

//action2
function action2() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
    }
}

//action3
function action3() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
    }
}

//action4
function action4() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
    }
}

//action5
function action5() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
    }
}

//action6
function action6() {
    // Variable pour fileDisplayArea
    let texte = document.getElementById("fileDisplayArea");
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte.innerText == "") {
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
    }
}