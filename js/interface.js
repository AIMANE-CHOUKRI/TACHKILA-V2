export const $ = (id) => document.getElementById(id);

export const couleursPoste = {
    gardien: { abrev: 'GB', bordure: 'border-l-yellow-500', cercle: 'border-yellow-500 text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
    defenseur: { abrev: 'DEF', bordure: 'border-l-blue-500', cercle: 'border-blue-500 text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
    milieu: { abrev: 'MIL', bordure: 'border-l-emerald-500', cercle: 'border-emerald-500 text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
    attaquant: { abrev: 'ATT', bordure: 'border-l-red-500', cercle: 'border-red-500 text-red-400', badge: 'bg-red-500/20 text-red-300' }
};

export function creerElement(balise, classes = '', texte = '') {
    const element = document.createElement(balise);
    element.className = classes;
    element.textContent = texte;
    return element;
}

let timerMessage;

export function afficherMessage(txt, erreur = false) {
    const message = $('message');
    if (!message) return;
    clearTimeout(timerMessage);
    message.textContent = txt;
    message.classList.remove('hidden', 'bg-emerald-600', 'bg-red-600');
    message.classList.add(erreur ? 'bg-red-600' : 'bg-emerald-600');
    timerMessage = setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}

export function afficherErreur(nomChamp, texte) {
    const span = $('erreur-' + nomChamp);
    if (span) span.textContent = texte;
    const champ = $(nomChamp);
    if (champ) champ.setAttribute('aria-invalid', texte !== '');
}

export function afficherErreurs(erreurs) {
    for (const nomChamp in erreurs) {
        afficherErreur(nomChamp, erreurs[nomChamp]);
    }
}

export function effacerErreurs(form) {
    for (const span of form.querySelectorAll('.erreur')) {
        span.textContent = '';
    }
    for (const champ of form.querySelectorAll('[aria-invalid]')) {
        champ.removeAttribute('aria-invalid');
    }
}

export function lireRadio(nom) {
    const radio = document.querySelector(`input[name='${nom}']:checked`);
    return radio ? radio.value : '';
}

export function choisirRadio(nom, valeur) {
    for (const radio of document.querySelectorAll(`input[name='${nom}']`)) {
        radio.checked = (radio.value === valeur);
    }
}

export function lireFormulaireJoueur() {
    return {
        nom: $('nom').value.trim(),
        age: $('age').value.trim(),
        poste: lireRadio('poste'),
        numero: $('numero').value.trim(),
        statut: lireRadio('statut')
    };
}

export function reinitialiserFormulaireJoueur() {
    $('formJoueur').reset();
    effacerErreurs($('formJoueur'));
    $('titreModale').textContent = "Ajouter un joueur";
    $('btnValider').textContent = "Ajouter";
}

export function remplirFormulaireJoueur(joueur) {
    $('nom').value = joueur.nom;
    $('age').value = joueur.age;
    $('numero').value = joueur.numero;
    choisirRadio('poste', joueur.poste);
    choisirRadio('statut', joueur.statut);
    effacerErreurs($('formJoueur'));
    $('titreModale').textContent = "Modifier le joueur";
    $('btnValider').textContent = "Modifier";
}

export function initialiserModale(dialog, surFermeture = () => {}) {
    for (const bouton of dialog.querySelectorAll('[data-fermer]')) {
        bouton.addEventListener('click', () => dialog.hidePopover());
    }
    dialog.addEventListener('toggle', (e) => {
        if (e.newState === 'closed') surFermeture();
    });
    dialog.querySelector('form').addEventListener('click', (e) => e.stopPropagation());
}

export function lireFormulaireMatch() {
    return {
        adversaire: $('adversaire').value.trim(),
        date: $('date').value,
        heure: $('heure').value,
        lieu: $('lieu').value.trim(),
        type: lireRadio('type')
    };
}

export function reinitialiserFormulaireMatch() {
    $('formMatch').reset();
    effacerErreurs($('formMatch'));
    $('titreModaleMatch').textContent = "Ajouter un match";
    $('btnValiderMatch').textContent = "Enregistrer";
}

export function remplirFormulaireMatch(match) {
    $('adversaire').value = match.adversaire;
    $('date').value = match.date;
    $('heure').value = match.heure;
    $('lieu').value = match.lieu;
    choisirRadio('type', match.type);
    effacerErreurs($('formMatch'));
    $('titreModaleMatch').textContent = "Modifier le match";
}

export function lireFormulaireScore() {
    return {
        scoreAtlas: $('scoreAtlas').value.trim(),
        scoreAdverse: $('scoreAdverse').value.trim()
    };
}

export function remplirFormulaireScore(match, titre) {
    $('scoreAtlas').value = match.scoreAtlas ?? '';
    $('scoreAdverse').value = match.scoreAdverse ?? '';
    $('texteScoreMatch').textContent = titre;
    effacerErreurs($('formScore'));
}

export function reinitialiserFormulaireScore() {
    $('formScore').reset();
    effacerErreurs($('formScore'));
}