import { lireMatches, enregistrerMatches } from "./stockage.js";
import { ajouterMatch, modifierMatch, supprimerMatch, trouverMatch, trierMatches, filtrerMatches, compterParOnglet, titreMatch, matchEstJoue, scoreEstSaisi, resultatMatch, saisirScore } from "./matches.js";
import { validerMatch, validerScores, formulaireValide } from "./validation.js";
import {
    $,
    creerElement,
    afficherMessage,
    afficherErreur,
    afficherErreurs,
    lireFormulaireMatch,
    remplirFormulaireMatch,
    reinitialiserFormulaireMatch,
    lireFormulaireScore,
    remplirFormulaireScore,
    reinitialiserFormulaireScore,
    initialiserModale
} from "./interface.js";

const dialogMatch = $('dialogMatch');
const formMatch = $('formMatch');
const dialogScore = $('dialogScore');
const formScore = $('formScore');
const listeMatches = $('listeMatches');
const champRecherche = $('rechercheMatch');
const boutonsOnglets = document.querySelectorAll('#ongletsMatches button');

let matches = lireMatches();
let idEnModification = null;
let idScore = null;
let onglet = 'tous';
let recherche = '';

function creerBouton(action, texte) {
    const bouton = creerElement('button', 'rounded bg-slate-700 px-3 py-1.5 text-xs font-bold hover:bg-slate-600', texte);
    bouton.type = 'button';
    bouton.dataset.action = action;
    return bouton;
}

const resultats = {
    victoire: { texte: 'Victoire', couleur: 'text-emerald-400' },
    defaite: { texte: 'Défaite', couleur: 'text-red-400' },
    nul: { texte: 'Nul', couleur: 'text-slate-300' }
};

function creerCarteMatch(match) {
    const carte = creerElement('li', 'flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#0e1b4d] p-4');
    carte.dataset.id = match.id;

    const infos = creerElement('div', 'min-w-0 flex-1');
    const typeTexte = match.type === 'domicile' ? 'Domicile' : 'Extérieur';
    infos.appendChild(creerElement('p', 'text-xs font-bold uppercase text-slate-400', `${match.date} • ${match.heure} • ${typeTexte}`));
    infos.appendChild(creerElement('h2', 'mt-1 text-lg font-bold text-white', titreMatch(match)));
    infos.appendChild(creerElement('p', 'text-sm text-slate-300', match.lieu));

    const actions = creerElement('div', 'flex flex-wrap items-center gap-2');

    if (matchEstJoue(match)) {
        if (scoreEstSaisi(match)) {
            const res = resultats[resultatMatch(match)];
            actions.appendChild(creerElement('span', `mr-2 text-lg font-bold ${res.couleur}`, `${match.scoreAtlas} - ${match.scoreAdverse} (${res.texte})`));
            actions.appendChild(creerBouton('score', 'Score'));
        } else {
            const btnScore = creerElement('button', 'rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500', 'Saisir score');
            btnScore.type = 'button';
            btnScore.dataset.action = 'score';
            actions.appendChild(btnScore);
        }
    }

    actions.appendChild(creerBouton('modifier', 'Modifier'));
    actions.appendChild(creerBouton('supprimer', 'Supprimer'));

    carte.appendChild(infos);
    carte.appendChild(actions);
    return carte;
}

function afficherOnglets() {
    const nombres = compterParOnglet(matches);
    $('nbTous').textContent = nombres.tous;
    $('nbAvenir').textContent = nombres.avenir;
    $('nbJoues').textContent = nombres.joues;

    for (const bouton of boutonsOnglets) {
        const actif = bouton.dataset.onglet === onglet;
        bouton.setAttribute('aria-pressed', actif);
        bouton.classList.toggle('bg-emerald-500', actif);
        bouton.classList.toggle('text-white', actif);
        bouton.classList.toggle('bg-[#0e1b4d]', !actif);
        bouton.classList.toggle('text-slate-200', !actif);
    }
}

function afficherMatches() {
    const matchesFiltres = trierMatches(filtrerMatches(matches, onglet, recherche));

    listeMatches.textContent = '';
    if (matchesFiltres.length === 0) {
        const message = matches.length === 0 ? "Aucun match enregistré." : "Aucun match trouvé.";
        listeMatches.appendChild(creerElement('li', 'py-8 text-center text-slate-300', message));
    }
    for (const m of matchesFiltres) {
        listeMatches.appendChild(creerCarteMatch(m));
    }
    afficherOnglets();
}

function sauvegarderEtAfficher() {
    enregistrerMatches(matches);
    afficherMatches();
}

for (const bouton of boutonsOnglets) {
    bouton.addEventListener('click', () => {
        onglet = bouton.dataset.onglet;
        afficherMatches();
    });
}

champRecherche.addEventListener('input', () => {
    recherche = champRecherche.value;
    afficherMatches();
});

initialiserModale(dialogMatch, () => {
    idEnModification = null;
    reinitialiserFormulaireMatch();
});

formMatch.addEventListener('input', (e) => {
    const erreurs = validerMatch(lireFormulaireMatch());
    afficherErreur(e.target.name, erreurs[e.target.name]);
});

formMatch.addEventListener('submit', (e) => {
    e.preventDefault();

    const donnees = lireFormulaireMatch();
    const erreurs = validerMatch(donnees);
    afficherErreurs(erreurs);
    if (!formulaireValide(erreurs)) {
        afficherMessage("Corrigez les erreurs du formulaire.", true);
        return;
    }

    const modification = idEnModification !== null;
    if (modification) {
        matches = modifierMatch(matches, idEnModification, donnees);
    } else {
        matches = ajouterMatch(matches, donnees);
    }

    sauvegarderEtAfficher();
    dialogMatch.hidePopover();
    afficherMessage(modification ? "Match modifié." : "Match ajouté.");
});

initialiserModale(dialogScore, () => {
    idScore = null;
    reinitialiserFormulaireScore();
});

formScore.addEventListener('input', (e) => {
    const erreurs = validerScores(lireFormulaireScore());
    afficherErreur(e.target.name, erreurs[e.target.name]);
});

formScore.addEventListener('submit', (e) => {
    e.preventDefault();

    const donnees = lireFormulaireScore();
    const erreurs = validerScores(donnees);
    afficherErreurs(erreurs);
    if (!formulaireValide(erreurs)) {
        afficherMessage("Corrigez les erreurs du formulaire.", true);
        return;
    }

    const nouveauxMatches = saisirScore(matches, idScore, donnees.scoreAtlas, donnees.scoreAdverse);
    if (nouveauxMatches === null) {
        afficherMessage("Le score ne peut être saisi que pour un match joué.", true);
        return;
    }

    matches = nouveauxMatches;
    sauvegarderEtAfficher();
    dialogScore.hidePopover();
    afficherMessage("Score enregistré.");
});

listeMatches.addEventListener('click', (e) => {
    const bouton = e.target.closest('button');
    if (!bouton) return;

    const carte = bouton.closest('li');
    const match = trouverMatch(matches, Number(carte.dataset.id));
    if (!match) return;

    if (bouton.dataset.action === 'modifier') {
        idEnModification = match.id;
        remplirFormulaireMatch(match);
        dialogMatch.showPopover();
    }

    if (bouton.dataset.action === 'score') {
        idScore = match.id;
        remplirFormulaireScore(match, titreMatch(match));
        dialogScore.showPopover();
    }

    if (bouton.dataset.action === 'supprimer') {
        if (!confirm(`Supprimer le match contre ${match.adversaire} ?`)) return;
        matches = supprimerMatch(matches, match.id);
        sauvegarderEtAfficher();
        afficherMessage("Match supprimé.");
    }
});

afficherMatches();

setInterval(afficherMatches, 30000);