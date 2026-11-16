import { lireMatches, enregistrerMatches} from "./stockage.js";
import { ajouterMatch} from "./matches.js"; // , modifierJoueur, supprimerJoueur 
import { validerMatch } from "./validation.js";
import { afficherMessage, echapper, lireFormulaireMatch, remplirFormulaireMatch,fermerModale, initialiserModaleMatch} from "./interface.js";

const form = document.querySelector('.formAjout');
const listeMatches = document.getElementById('listeMatches');
const nbMatches = document.getElementById('nbMatches');

let matches = lireMatches();
let idEnModification = null; 

function creerCarteMatche(m) {
    const li = document.createElement('li');
    li.className = 'bg-blue-950 p-4 rounded-lg text-white';
    li.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="bg-cyan-500 p-2 rounded-full font-bold align-center">${m.date.getMonth}</h2>
            <h3 class="bg-cyan-500 p-2 rounded-full font-bold align-center">${m.date.getDay}</h2>
            <h3 class="bg-cyan-500 p-2 rounded-full font-bold align-center">${m.date.getYear}</h2>
            <span>
                <h3>${echapper(m.lieu)}</h3>
                <h4>Atlas FC vs ${echapper(m.nomMatch)}</h4>
                <h4>${echapper(m.adresse)}</h4>
            </span>
            <span>
                <button class="btnEdit">&#9999;</button>
                <button class="btnDelete">&#128465;</button>
            </span>
        </div>
    `;

    li.querySelector('.btnEdit').addEventListener('click', () => {
        idEnModification = m.id;
        remplirFormulaireMatch(m);
    });

    li.querySelector('.btnDelete').addEventListener('click', () => {
        if (!confirm("Supprimer ce match ?")) return;
        matches = supprimerMatch(matches, m.id);
        enregistrerMatches(matches);
        afficherMatches();
        afficherMessage("Match supprimé");
    });

    return li;
}

function afficherMatches() {
    listeMatches.innerHTML = '';
    matches.forEach((m) => listeMatches.appendChild(creerCarteMatche(m)));
    nbMatches.textContent = matches.length;
}

initialiserModaleMatch(() => { idEnModification = null; });

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const donnees = lireFormulaireMatch();
    const erreur = validerMatch(donnees, matches, idEnModification);
    if (erreur) return afficherMessage(erreur, true);

    const modification = idEnModification !== null;
    matches = modification
        ? modifierMatch(matches, idEnModification, donnees)
        : ajouterMatch(matches, donnees);

    enregistrerMatches(matches);
    fermerModale();
    afficherMatches();
    afficherMessage(modification ? "Match modifié avec succès" : "Match ajouté avec succès");
});

afficherMatches();
