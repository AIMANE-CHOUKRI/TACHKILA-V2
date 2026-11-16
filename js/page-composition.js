import { lireJoueurs, enregistrerJoueurs } from "./stockage.js";
import {ajouterJoueur, modifierJoueur, supprimerJoueur, placerJoueur,positionsPourPoste, joueurALaPosition, compterPlaces} from "./joueurs.js";
import { validerJoueur } from "./validation.js";
import {afficherMessage, echapper, lireFormulaireJoueur, remplirFormulaire,fermerModale, initialiserModale} from "./interface.js";

const form = document.querySelector('.formAjout');
const listeJoueurs = document.getElementById('listeJoueurs');
const nbJoueurs = document.getElementById('nbJoueurs');
const nbPlaces = document.getElementById('nbPlaces');

let joueurs = lireJoueurs();
let idEnModification = null;

function mettreAJourTerrain() {
    document.querySelectorAll('.slot, .keeper').forEach((slot) => {
        const code = slot.getAttribute('data-position');
        const joueur = joueurALaPosition(joueurs, code);
        slot.textContent = joueur ? joueur.numero + ' - ' + joueur.nom : code.toUpperCase();
    });
}

function creerCarteJoueur(j) {
    const estPlace = j.position && j.position !== 'banc';
    const li = document.createElement('li');
    li.className = 'bg-blue-950 p-4 rounded-lg text-white';
    if (estPlace) li.style.opacity = '0.5';

    const options = positionsPourPoste(j.poste)
        .map(([code, libelle]) => `<option value="${code}" ${j.position === code ? 'selected' : ''}>${libelle}</option>`)
        .join('');

    li.innerHTML = `
        <div class="flex justify-between items-center text-white">
            <h2 class="bg-cyan-500 p-2 rounded-full font-bold">${j.numero}</h2>
            <span>
                <h3>${echapper(j.nom)}</h3>
                <h4>${echapper(j.poste)}</h4>
            </span>
        </div>
        <select class="selectPoste w-full mt-2 text-black p-1 rounded">
            <option value="banc" ${j.position === 'banc' ? 'selected' : ''}>Sur le banc</option>
            ${options}
        </select>
    `;

    // li.querySelector('.btnEdit').addEventListener('click', () => {
    //     idEnModification = j.id;
    //     remplirFormulaire(j);
    // });

    // li.querySelector('.btnDelete').addEventListener('click', () => {
    //     if (!confirm("Supprimer ce joueur ?")) return;
    //     joueurs = supprimerJoueur(joueurs, j.id);
    //     enregistrerJoueurs(joueurs);
    //     afficherJoueurs();
    //     afficherMessage("Joueur supprimé");
    // });

    const select = li.querySelector('.selectPoste');
    select.addEventListener('change', (e) => {
        const position = e.target.value;
        const resultat = placerJoueur(joueurs, j.id, position);
        if (resultat === null) {
            afficherMessage("Cette position est occupée !", true);
            select.value = j.position || 'banc';
            return;
        }
        joueurs = resultat;
        enregistrerJoueurs(joueurs);
        afficherJoueurs();
        afficherMessage(position === 'banc' ? "Joueur remis sur le banc" : "Joueur placé !");
    });

    return li;
}

function afficherJoueurs() {
    listeJoueurs.innerHTML = '';
    joueurs.forEach((j) => listeJoueurs.appendChild(creerCarteJoueur(j)));
    nbJoueurs.textContent = joueurs.length;
    nbPlaces.textContent = compterPlaces(joueurs);
    mettreAJourTerrain();
}

initialiserModale(() => { idEnModification = null; });

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
});

afficherJoueurs();
