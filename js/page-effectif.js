import { lireJoueurs, enregistrerJoueurs } from "./stockage.js";
import { ajouterJoueur, modifierJoueur, supprimerJoueur } from "./joueurs.js";
import { validerJoueur } from "./validation.js";
import {afficherMessage, echapper, lireFormulaireJoueur, remplirFormulaireJoueur,fermerModale, initialiserModaleJoueur} from "./interface.js";

const form = document.querySelector('.formAjout');
const listeJoueurs = document.getElementById('listeJoueurs');
const nbJoueurs = document.getElementById('nbJoueurs');

let joueurs = lireJoueurs();
let idEnModification = null; 

function creerCarteJoueur(j) {
    const li = document.createElement('li');
    li.className = 'bg-blue-950 p-4 rounded-lg text-white';
    li.innerHTML = `
        <div class="flex justify-between items-center">
            <h2 class="bg-cyan-500 p-2 rounded-full font-bold align-center">${j.numero}</h2>
            <span>
                <h3>${echapper(j.nom)}</h3>
                <h4>${echapper(j.poste)}${j.age ? ' · ' + j.age + ' ans' : ''}</h4>
                <h4>${echapper(j.statut)}</h4>
            </span>
            <span>
                <button class="btnEdit">&#9999;</button>
                <button class="btnDelete">&#128465;</button>
            </span>
        </div>
    `;

    li.querySelector('.btnEdit').addEventListener('click', () => {
        idEnModification = j.id;
        remplirFormulaireJoueur(j);
    });

    li.querySelector('.btnDelete').addEventListener('click', () => {
        if (!confirm("Supprimer ce joueur ?")) return;
        joueurs = supprimerJoueur(joueurs, j.id);
        enregistrerJoueurs(joueurs);
        afficherJoueurs();
        afficherMessage("Joueur supprimé");
        calculTotal();
    });

    return li;
}

function afficherJoueurs() {
    listeJoueurs.innerHTML = '';
    joueurs.forEach((j) => listeJoueurs.appendChild(creerCarteJoueur(j)));
}

initialiserModaleJoueur(() => { idEnModification = null; });

const spanTotal = document.querySelector("#spanTotal");
const spanEnforme = document.querySelector("#spanEnforme");
const spanBlesses = document.querySelector("#spanTotal");
const spanMoyen = document.querySelector("#spanTotal");

function calculTotal(){
    let compteur = 0;
    for (let i=0;i<joueurs.length;i++){
        compteur++;
    }
    spanTotal.textContent = compteur;
}
calculTotal();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const donnees = lireFormulaireJoueur();
    const erreur = validerJoueur(donnees, joueurs, idEnModification);
    if (erreur) return afficherMessage(erreur, true);

    const modification = idEnModification !== null;
    joueurs = modification
        ? modifierJoueur(joueurs, idEnModification, donnees)
        : ajouterJoueur(joueurs, donnees);

    enregistrerJoueurs(joueurs);
    fermerModale();
    afficherJoueurs();
    afficherMessage(modification ? "Joueur modifié avec succès" : "Joueur ajouté avec succès");
    calculTotal();
});

afficherJoueurs();
