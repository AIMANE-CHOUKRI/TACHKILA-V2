import { lireJoueurs, enregistrerJoueurs } from "./stockage.js";
import { ajouterJoueur, modifierJoueur, supprimerJoueur, designerCapitaine, filtrerJoueurs, trouverJoueur } from "./joueurs.js";
import { validerJoueur, formulaireValide } from "./validation.js";
import { paginer } from "./pagination.js";
import {
    $,
    couleursPoste,
    creerElement,
    afficherMessage,
    afficherErreur,
    afficherErreurs,
    lireFormulaireJoueur,
    remplirFormulaireJoueur,
    reinitialiserFormulaireJoueur,
    initialiserModale
} from "./interface.js";

const dialog = $('dialogAjout');
const form = $('formJoueur');
const listeJoueurs = $('listeJoueurs');
const champRecherche = $('recherche');
const boutonsFiltre = document.querySelectorAll('#filtresPoste button');
const joueursParPage = 8;

let joueurs = lireJoueurs();
let idEnModification = null;
let recherche = '';
let filtrePoste = 'tous';
let pageCourante = 1;

function creerBouton(action, symbole, libelle) {
    const bouton = creerElement('button', 'flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 text-xs hover:bg-slate-700', symbole);
    bouton.type = 'button';
    bouton.dataset.action = action;
    bouton.setAttribute('aria-label', libelle);
    bouton.title = libelle;
    return bouton;
}

function creerCarteJoueur(j) {
    const couleur = couleursPoste[j.poste];
    const couleurBordure = j.capitaine ? 'border-purple-500' : 'border-slate-700';
    const carte = creerElement('li', `flex flex-col gap-3 rounded-xl border border-l-4 ${couleurBordure} bg-[#0e1b4d] p-4 ${couleur.bordure}`);
    carte.dataset.id = j.id;

    const haut = creerElement('div', 'flex items-center gap-3');
    const numero = creerElement('span', `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold ${couleur.cercle}`, j.numero);
    const infos = creerElement('div', 'min-w-0');
    const nom = creerElement('h3', 'truncate font-bold text-white', j.nom);

    const badges = creerElement('div', 'mt-1 flex items-center gap-1.5');
    const poste = creerElement('span', `rounded px-2 text-xs font-bold ${couleur.badge}`, couleur.abrev);
    badges.appendChild(poste);

    if (j.capitaine) {
        const badgeCapitaine = creerElement('span', 'rounded bg-purple-600 px-2 text-xs font-bold text-white', 'Capitaine');
        badges.appendChild(badgeCapitaine);
    }

    infos.appendChild(nom);
    infos.appendChild(badges);
    haut.appendChild(numero);
    haut.appendChild(infos);

    const age = creerElement('p', 'text-sm text-slate-300', `Âge : ${j.age} ans`);

    const bas = creerElement('div', 'flex items-center justify-between gap-2');
    const estBlesse = j.statut === 'Blessé';
    const statut = creerElement('span', `rounded px-2 py-1 text-xs font-bold ${estBlesse ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`, j.statut);
    const boutons = creerElement('div', 'flex gap-1');
    const boutonCapitaine = creerBouton('capitaine', 'C', j.capitaine ? `Retirer le titre de capitaine à ${j.nom}` : `Désigner ${j.nom} capitaine`);
    boutonCapitaine.classList.add('font-bold');
    boutonCapitaine.setAttribute('aria-pressed', j.capitaine);
    if (j.capitaine) {
        boutonCapitaine.classList.add('border-purple-500', 'bg-purple-600', 'text-white');
    }
    boutons.appendChild(boutonCapitaine);
    boutons.appendChild(creerBouton('modifier', '✏️', `Modifier ${j.nom}`));
    boutons.appendChild(creerBouton('supprimer', '🗑️', `Supprimer ${j.nom}`));
    bas.appendChild(statut);
    bas.appendChild(boutons);

    carte.appendChild(haut);
    carte.appendChild(age);
    carte.appendChild(bas);

    return carte;
}

function mettreAJourStats() {
    const total = joueurs.length;
    const blesses = joueurs.filter(j => j.statut === 'Blessé').length;
    const enForme = total - blesses;
    const ageMoyen = total > 0 ? Math.round(joueurs.reduce((acc, j) => acc + j.age, 0) / total) : 0;

    $('spanTotal').textContent = total;
    $('spanEnForme').textContent = enForme;
    $('spanBlesses').textContent = blesses;
    $('spanAgeMoyen').textContent = `${ageMoyen} ans`;
}

function afficherFiltreActif() {
    for (const bouton of boutonsFiltre) {
        const actif = bouton.dataset.poste === filtrePoste;
        bouton.setAttribute('aria-pressed', actif);
        bouton.classList.toggle('bg-emerald-500', actif);
        bouton.classList.toggle('text-white', actif);
        bouton.classList.toggle('bg-[#0e1b4d]', !actif);
        bouton.classList.toggle('text-slate-200', !actif);
    }
}

function afficherJoueurs() {
    const joueursFiltres = filtrerJoueurs(joueurs, recherche, filtrePoste);
    const page = paginer(joueursFiltres, pageCourante, joueursParPage);
    pageCourante = page.pageCourante;
    listeJoueurs.textContent = '';

    if (joueursFiltres.length === 0) {
        const message = joueurs.length === 0 ? "Aucun joueur dans l'effectif." : "Aucun joueur ne correspond à votre recherche.";
        listeJoueurs.appendChild(creerElement('li', 'col-span-full py-8 text-center text-slate-300', message));
    }
    for (const j of page.elements) {
        listeJoueurs.appendChild(creerCarteJoueur(j));
    }

    $('infoPagination').textContent = `Affichage de ${page.elements.length} sur ${joueursFiltres.length} joueurs`;
    $('infoPage').textContent = `Page ${page.pageCourante} / ${page.totalPages}`;
    $('btnPrecedent').disabled = page.pageCourante === 1;
    $('btnSuivant').disabled = page.pageCourante === page.totalPages;

    afficherFiltreActif();
    mettreAJourStats();
}

function sauvegarderEtAfficher() {
    enregistrerJoueurs(joueurs);
    afficherJoueurs();
}

champRecherche.addEventListener('input', () => {
    recherche = champRecherche.value;
    pageCourante = 1;
    afficherJoueurs();
});

for (const bouton of boutonsFiltre) {
    bouton.addEventListener('click', () => {
        filtrePoste = bouton.dataset.poste;
        pageCourante = 1;
        afficherJoueurs();
    });
}

$('btnPrecedent').addEventListener('click', () => {
    pageCourante--;
    afficherJoueurs();
});

$('btnSuivant').addEventListener('click', () => {
    pageCourante++;
    afficherJoueurs();
});

initialiserModale(dialog, () => {
    idEnModification = null;
    reinitialiserFormulaireJoueur();
});

form.addEventListener('input', (e) => {
    const erreurs = validerJoueur(lireFormulaireJoueur(), joueurs, idEnModification);
    afficherErreur(e.target.name, erreurs[e.target.name]);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const donnees = lireFormulaireJoueur();
    const erreurs = validerJoueur(donnees, joueurs, idEnModification);
    afficherErreurs(erreurs);
    if (!formulaireValide(erreurs)) {
        afficherMessage("Corrigez les erreurs du formulaire.", true);
        return;
    }

    const modification = idEnModification !== null;
    if (modification) {
        joueurs = modifierJoueur(joueurs, idEnModification, donnees);
    } else {
        joueurs = ajouterJoueur(joueurs, donnees);
        recherche = '';
        champRecherche.value = '';
        filtrePoste = 'tous';
        pageCourante = Math.ceil(joueurs.length / joueursParPage);
    }

    sauvegarderEtAfficher();
    dialog.hidePopover();
    afficherMessage(modification ? "Joueur modifié avec succès." : "Joueur ajouté avec succès.");
});

listeJoueurs.addEventListener('click', (e) => {
    const bouton = e.target.closest('button');
    if (!bouton) return;

    const carte = bouton.closest('li');
    const joueur = trouverJoueur(joueurs, Number(carte.dataset.id));
    if (!joueur) return;

    if (bouton.dataset.action === 'capitaine') {
        joueurs = designerCapitaine(joueurs, joueur.id);
        sauvegarderEtAfficher();
        afficherMessage(joueur.capitaine ? `${joueur.nom} n'est plus capitaine.` : `${joueur.nom} est le nouveau capitaine.`);
    }

    if (bouton.dataset.action === 'modifier') {
        idEnModification = joueur.id;
        remplirFormulaireJoueur(joueur);
        dialog.showPopover();
    }

    if (bouton.dataset.action === 'supprimer') {
        if (!confirm(`Supprimer ${joueur.nom} de l'effectif ?`)) return;
        joueurs = supprimerJoueur(joueurs, joueur.id);
        sauvegarderEtAfficher();
        afficherMessage("Joueur supprimé.");
    }
});

afficherJoueurs();