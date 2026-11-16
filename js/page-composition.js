import { lireJoueurs, enregistrerJoueurs } from "./stockage.js";
import { positionsPourPoste, joueurALaPosition, compterPlaces, peutPlacer, placerJoueur, trouverJoueur } from "./joueurs.js";
import { $, couleursPoste, creerElement, afficherMessage } from "./interface.js";

const listeJoueurs = $('listeJoueurs');

let joueurs = lireJoueurs();

function creerOption(valeur, texte, desactivee = false) {
    const option = document.createElement('option');
    option.value = valeur;
    option.textContent = texte;
    option.disabled = desactivee;
    return option;
}

function creerSelect(j) {
    const select = creerElement('select', 'mt-2 w-full rounded-md border border-slate-600 bg-[#0e1b4d] p-2 text-sm text-white disabled:text-slate-400');
    select.setAttribute('aria-label', `Position de ${j.nom}`);

    if (j.statut === 'Blessé') {
        select.appendChild(creerOption('banc', 'Indisponible'));
        select.disabled = true;
        return select;
    }

    select.appendChild(creerOption('banc', 'Sur le banc'));
    for (const [code, libelle] of positionsPourPoste(j.poste)) {
        const occupant = joueurALaPosition(joueurs, code);
        const prisParUnAutre = occupant !== null && occupant.id !== j.id;
        select.appendChild(creerOption(code, prisParUnAutre ? `${libelle} (occupée)` : libelle, prisParUnAutre));
    }
    select.value = j.position;
    return select;
}

function creerCarteJoueur(j) {
    const couleur = couleursPoste[j.poste];
    const estBlesse = j.statut === 'Blessé';
    const estPlace = j.position !== 'banc';

    const pale = estPlace ? 'opacity-70' : (estBlesse ? 'opacity-60' : '');
    const carte = creerElement('li', `rounded-xl border-l-4 bg-[#0e1b4d] p-3 text-white ${couleur.bordure} ${pale}`);
    carte.dataset.id = j.id;

    const haut = creerElement('div', 'flex items-center gap-2');
    const numero = creerElement('span', `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${couleur.cercle}`, j.numero);
    const nom = creerElement('span', 'min-w-0 flex-1 truncate text-sm font-bold', j.nom);
    const poste = creerElement('span', `rounded px-2 py-0.5 text-xs font-bold ${couleur.badge}`, couleur.abrev);
    haut.appendChild(numero);
    haut.appendChild(nom);
    haut.appendChild(poste);
    if (estBlesse) {
        haut.appendChild(creerElement('span', 'rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-300', 'Blessé'));
    }

    carte.appendChild(haut);
    carte.appendChild(creerSelect(j));
    return carte;
}

function afficherListe() {
    listeJoueurs.textContent = '';

    if (joueurs.length === 0) {
        listeJoueurs.appendChild(creerElement('li', 'p-3 text-center text-sm text-white', "Aucun joueur. Ajoutez-en depuis la page Effectif."));
    }
    const joueursTries = [...joueurs].sort((a, b) => a.numero - b.numero);
    for (const j of joueursTries) {
        listeJoueurs.appendChild(creerCarteJoueur(j));
    }
}

function afficherTerrain() {
    for (const caseTerrain of document.querySelectorAll('[data-position]')) {
        const joueur = joueurALaPosition(joueurs, caseTerrain.dataset.position);
        caseTerrain.textContent = '';
        caseTerrain.classList.toggle('libre', joueur === null);
        caseTerrain.classList.toggle('occupee', joueur !== null);

        const contenu = creerElement('div', 'flex min-w-0 items-center gap-1 px-1');
        if (joueur === null) {
            contenu.className = 'flex flex-col items-center leading-tight';
            contenu.appendChild(creerElement('span', 'text-sm font-bold', caseTerrain.dataset.label));
            contenu.appendChild(creerElement('span', 'text-xs', 'Libre'));
        } else {
            contenu.appendChild(creerElement('span', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/50 text-xs font-bold', joueur.numero));
            contenu.appendChild(creerElement('span', 'hidden truncate text-xs font-bold sm:inline', joueur.nom));
        }
        caseTerrain.appendChild(contenu);
    }
}

function afficherCompteurs() {
    $('nbJoueurs').textContent = joueurs.length;
    $('nbPlaces').textContent = compterPlaces(joueurs);
}

function afficherTout() {
    afficherListe();
    afficherTerrain();
    afficherCompteurs();
}

listeJoueurs.addEventListener('change', (e) => {
    const select = e.target.closest('select');
    if (!select) return;

    const joueur = trouverJoueur(joueurs, Number(select.closest('li').dataset.id));
    const position = select.value;

    const erreur = peutPlacer(joueurs, joueur.id, position);
    if (erreur !== '') {
        afficherMessage(erreur, true);
        afficherTout();
        return;
    }

    joueurs = placerJoueur(joueurs, joueur.id, position);
    enregistrerJoueurs(joueurs);
    afficherTout();
    afficherMessage(position === 'banc' ? `${joueur.nom} retourne sur le banc.` : `${joueur.nom} est placé sur le terrain.`);
});

afficherTout();