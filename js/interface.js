const $ = (id) => document.getElementById(id);

let timerMessage;

export function afficherMessage(txt, erreur = false) {
    const message = $('message');
    if (!message) return;
    clearTimeout(timerMessage);
    message.textContent = txt;
    message.style.backgroundColor = erreur ? 'red' : 'green';
    message.classList.remove('hidden');
    timerMessage = setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}

export function echapper(texte) {
    return String(texte).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

export function lireFormulaireJoueur() {
    const poste = document.querySelector("input[name='poste']:checked");
    const statut = document.querySelector("input[name='statut']:checked");
    const age = $('age');
    return {
        nom: $('nom').value.trim(),
        age: age ? age.value.trim() : undefined,
        poste: poste ? poste.value : '',
        statut: statut ? statut.value : '',
        numero: $('numero').value.trim()
    };
}

export function lireFormulaireMatch() {
    const lieu = document.querySelector("input[name='lieu']:checked");
    // const age = $('age');
    const date = $('date');
    const heure = $('heure');
    return {
        nomMatch: $('nomMatch').value.trim(),
        date: date ? date.value.trim() : undefined,
        heure: heure ? heure.value : '',
        adresse: $('adresse').value.trim(),
        lieu: lieu ? lieu.value : '',
    };
}

export function reinitialiserFormulaireJoueur() {
    document.querySelector('.formAjout').reset();
    if ($('h1Ajout')) $('h1Ajout').textContent = "Ajouter un joueur";
    if ($('btnValider')) $('btnValider').textContent = "Ajouter";
}

export function reinitialiserFormulaireMatch() {
    document.querySelector('.formAjout').reset();
    if ($('h1Ajout')) $('h1Ajout').textContent = "Ajouter un Match";
    if ($('btnValider')) $('btnValider').textContent = "Ajouter";
}

export function remplirFormulaireJoueur(joueur) {
    $('nom').value = joueur.nom;
    if ($('age')) $('age').value = joueur.age ?? '';
    $('numero').value = joueur.numero;
    document.querySelectorAll("input[name='poste']").forEach((radio) => {
        radio.checked = (radio.value === joueur.poste);
    });
    document.querySelectorAll("input[name='statut']").forEach((radio) => {
        radio.checked = (radio.value === joueur.statut);
    })
    if ($('h1Ajout')) $('h1Ajout').textContent = "Modifier le joueur";
    if ($('btnValider')) $('btnValider').textContent = "Modifier";
    $('dialogAjout').showPopover();
}

export function remplirFormulaireMatch(match) {
    $('nomMatch').value = match.nom;
    $('date').value = match.date;
    // if ($('date')) $('age').value = joueur.age ?? '';
    $('heure').value = match.heure;
    $('adresse').value = match.adresse;
    document.querySelectorAll("input[name='lieu']").forEach((radio) => {
        radio.checked = (radio.value === match.lieu);
    });
    if ($('h1Ajout')) $('h1Ajout').textContent = "Modifier le match";
    if ($('btnValider')) $('btnValider').textContent = "Modifier";
    $('dialogAjout').showPopover();
}

export function fermerModale() {
    $('dialogAjout').hidePopover();
}

export function initialiserModaleJoueur(surReinitialisation = () => {}) {
    const dialog = $('dialogAjout');
    const form = document.querySelector('.formAjout');
    if (!dialog || !form) return;

    const reinitialiser = () => {
        surReinitialisation();
        reinitialiserFormulaireJoueur();
    };

    $('btnAnnuler')?.addEventListener('click', (e) => {
        e.preventDefault();
        fermerModale();
    });
    $('btnFermer')?.addEventListener('click', fermerModale);
    $('btnOuvrir')?.addEventListener('click', reinitialiser);
    dialog.addEventListener('toggle', (e) => {
        if (e.newState === 'closed') reinitialiser();
    });
    form.addEventListener('click', (e) => e.stopPropagation());
}

export function initialiserModaleMatch(surReinitialisation = () => {}) {
    const dialog = $('dialogAjout');
    const form = document.querySelector('.formAjout');
    if (!dialog || !form) return;

    const reinitialiser = () => {
        surReinitialisation();
        reinitialiserFormulaireMatch();
    };

    $('btnAnnuler')?.addEventListener('click', (e) => {
        e.preventDefault();
        fermerModale();
    });
    $('btnFermer')?.addEventListener('click', fermerModale);
    $('btnOuvrir')?.addEventListener('click', reinitialiser);
    dialog.addEventListener('toggle', (e) => {
        if (e.newState === 'closed') reinitialiser();
    });
    form.addEventListener('click', (e) => e.stopPropagation());
}