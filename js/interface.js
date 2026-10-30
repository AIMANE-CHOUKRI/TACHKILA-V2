const $ = (id) => document.getElementById(id);

let timerMessage;

export function afficherMessage(txt, error = false) {
    const message = $('message');
    if (!message) return;
    clearTimeout(timerMessage);
    message.textContent = txt;
    message.style.backgroundColor = error ? 'red' : 'green';
    message.classList.remove('hidden');
    timerMessage = setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}

export function echapper(texte){
    return String(texte).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]
    ));
}

export function lireFormulaireJoueur(){
    const poste = document.querySelector("input[name='poste']:checked");
    const age = $('age');
    return {
        nom: $('nom').value.trim(),
        age: age ? age.value.trim() : undefined,
        poste: poste ? poste.value : '',
        numero: $('numero').value.trim()
    };
}

export function reinitialiserFormulaire() {
    document.querySelector('.formAjout').reset();
    if ($('h1Ajout')) $('h1Ajout').textContent = "Ajouter un joueur";
    if ($('btnValider')) $('btnValider').textContent = "Ajouter";
}

export function remplirFormulaire(joueur) {
    $('nom').value = joueur.nom;
    if ($('age')) $('age').value = joueur.age ?? '';
    $('numero').value = joueur.numero;
    document.querySelectorAll("input[name='poste']").forEach((radio) => {
        radio.checked = (radio.value === joueur.poste);
    });
    if ($('h1Ajout')) $('h1Ajout').textContent = "Modifier le joueur";
    if ($('btnValider')) $('btnValider').textContent = "Modifier";
    $('dialogAjout').showPopover();
}

export function fermerModale(){
    $('dialogAjout').hidePopover();
}

export function initialiserModale(surReinitialisation = () => {}) {
    const dialog = $('dialogAjout');
    const form = document.querySelector('.formAjout');
    if (!dialog || !form) return;

    const reinitialiser = () => {
        surReinitialisation();
        reinitialiserFormulaire();
    }

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