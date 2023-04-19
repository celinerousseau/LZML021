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
                document.getElementById("textlogger").innerHTML = '<span class="textlogger errolog">Type de fichier non supporté</span>';
                (alert("Type de fichier non supporté. Merci de sélectionner un fichier au format .txt"))
            }
        }
       );
    }
}

//Variables globales
var dico = {};
var totalMots = 0;
var motsUniques = 0;
let segmenterPreums = false; //pour vérifier que le texte a bien été segmenté d'abord
var lignes = [];
let text_tokens = [];

//Bouton segmentation
function segmentation() {
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (document.getElementById("fileDisplayArea").innerText == "") { // alerte + texte pour être sur que l'utilisateur voit l'erreur
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
        // Obtenir la valeur de l'élément avec l'ID "delimID" et l'assigner à une variable nommée "delim"
        let delim = document.getElementById('delimID').value;
        // Vérifier si la variable "delim" est vide
        if (delim === '') {
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun délimiteurs ajoutés.</span>';
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

            //création de text_tokens pour collecter les mots nettoyés
            let tokens_tmp = document.getElementById("fileDisplayArea").innerText.split(regex_delim);
            text_tokens = tokens_tmp.filter(x => x.trim() != ''); // on s'assure de ne garder que des tokens "non vides"

            // Séparer le texte en lignes
            lignes = document.getElementById("fileDisplayArea").innerText.split("\n");

            // Vérifier qu'aucune ligne est vide
            for (let i = lignes.length - 1; i >= 0; i--) { // dans l'ordre inverse parce que sinon vu que l'index change on rate des lignes
                if (!/\S/.test(lignes[i])) { // si y a pas au moins un espace non-vide
                    lignes.splice(i, 1); // on enlève la ligne
                }
            }

            // Pour chaque ligne non-vide
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

            let fileDisplayArea = document.getElementById("fileDisplayArea").innerText; //on utilise pas var texte ici pour pas créer d'interférence
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
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (document.getElementById("fileDisplayArea").innerText == "") {
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
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
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Texte non segmenté.</span>';
            alert("Vous devez segmentez le texte avant de pouvoir utiliser cette fonctionnalité !");
        }
    }
}

//Bouton Grep
function grep() {
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (document.getElementById("fileDisplayArea").innerText == "") {
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else { // Vérifier qu'un pôle a bien été entré
        let pole = document.getElementById("poleID").value; //value pour savoir ce que utilisateur a entré dans input poleID
        let poleRegex = new RegExp(pole, "g");
        if (pole == "") {
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun pôle ajouté.</span>';
            alert("Vous devez ajouter un pôle pour utiliser cette fonctionnalité.");
            return;
        }
        else {
            document.getElementById("textlogger").innerHTML = ''; //vider le error log au cas où
            var resultats = [];
            for (var i = 0; i < lignes.length; i++) { // tant que i est inférieur au nombre de lignes fait ce qui suit et incrémente i de 1
                if (poleRegex.test(lignes[i])) { //si dans la ligne i y a le pole recherché
                    let lePrecieux = lignes[i].replace(poleRegex, '<span style="color:#8fcaca; font-weight:bold">$&</span>');
                    resultats.push(lePrecieux);
                }
            }
            if (resultats.length > 0) { // si + de 0 résultats
                document.getElementById("page-analysis").innerHTML = resultats.join("<br>");
            }
            else {
                document.getElementById("page-analysis").innerHTML = ''; // vider les analyses puisque rien n'a été trouvé
                document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun résultat trouvé.</span>';
            }
        }
    }
}

//Bouton Concordancier
function concordancier() {
    if (document.getElementById("fileDisplayArea").innerText == "") {
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
        let pole = document.getElementById("poleID").value.trim();
        let display = document.getElementById("page-analysis");
        let table = document.createElement("table");

        if (pole == "") {
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun pôle ajouté.</span>';
            alert("Vous devez ajouter un pôle pour utiliser cette fonctionnalité.");
            return;
        } 
        else {
            let pole_regex = new RegExp("^" + pole + "$", "g");
            let tailleContexte = Number(document.getElementById('lgID').value ?? "10");
            table.style.margin = "auto";
            let entete = table.appendChild(document.createElement("tr"));
            entete.innerHTML = "<th>contexte gauche</th><th>pôle</th><th>contexte droit</th>";

            display.innerHTML = "";
            for (let i=0; i < text_tokens.length; i++) {
                if (text_tokens[i].search(pole_regex) != -1) {
                    let start = Math.max(i - tailleContexte, 0);
                    let end = Math.min(i + tailleContexte, text_tokens.length);
                    let lc = text_tokens.slice(start, i);
                    let rc = text_tokens.slice(i+1, end+1);
                    let row = document.createElement("tr");

                    // manière fainéante
                    row.appendChild(document.createElement("td"));
                    row.childNodes[row.childNodes.length - 1].innerHTML = lc.join(' ');
                    row.appendChild(document.createElement("td"));
                    row.childNodes[row.childNodes.length - 1].innerHTML = text_tokens[i];
                    row.appendChild(document.createElement("td"));
                    row.childNodes[row.childNodes.length - 1].innerHTML = rc.join(' ');
                    table.appendChild(row);
                }
            }
        }
        
        display.innerHTML = "";
        display.appendChild(table);

        if (display.innerHTML == "") {
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Pas de résultat.</span>';
            alert("Pas de résultat.");
            return;
        }

    }
}

//Bouton A1Z26
function A1Z26() {
    let texte = document.getElementById("fileDisplayArea").innerText
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (texte == "") {
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
          // On enlève tous les symboles, on remplace les lettres à accents et on mets tout en majuscule
        document.getElementById('page-analysis').innerHTML = "";
        let nettoyer = texte.normalize('NFD').replace(/[^a-zA-Z]/g, '').toUpperCase();
        
        let resultat = '';
        
        // Pour chaque lettre dans nettoyer
        for (let i = 0; i < nettoyer.length; i++) {
            // On convertit en code A1Z26 (A = 1, B = 2, C = 3, etc)
            let code = nettoyer.charCodeAt(i) - 64;
            
            // On ajoute à résultat
            resultat += code.toString() + ' ';
        }

        //On affiche le résultat dans page-analysis
        document.getElementById('page-analysis').innerHTML = resultat;
    }
}

//Bouton Minuscule
function minuscule() {
    document.getElementById("page-analysis").innerText = document.getElementById("page-analysis").innerText.toLowerCase();
}

//Bouton Télécharger
function telecharger() {
    // Vérifier si l'élément "fileDisplayArea" est vide
    if (document.getElementById("fileDisplayArea").innerText == "") {
        document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte sélectionné.</span>';
        alert("Vous devez sélectionner un texte pour utiliser cette fonctionnalité.");
        return;
    }
    else {
        if (document.getElementById("page-analysis").innerText == "") {
            document.getElementById("textlogger").innerHTML = '<span class="textlogger errorlog">Aucun texte analysé.</span>';
            alert("La boîte de droite doit contenir du texte pour utiliser cette fonctionnalité.");
            return;
        }
        else {
            let texte = document.getElementById("page-analysis").innerText;
            let nomDoc = "anlysedetexte.txt";
            let element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(texte));
            element.setAttribute("download", nomDoc);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }
}
