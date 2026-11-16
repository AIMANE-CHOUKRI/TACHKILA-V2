export const AGE_MIN = 18;
export const AGE_MAX = 39;

export const REGEX_NOM = /^[\p{L}\s'’-]+$/u;

// Validation Joueurs

export function validerNom(nom) {
    const n = nom.trim();
    if (n.length < 3 || n.length > 30 || !REGEX_NOM.test(n) || !/\p{L}/u.test(n)) {
        return "Nom invalide (3-30 lettres).";
    }
    return '';
}

export function validerAge(age) {
    const brut = String(age).trim();
    const n = Number(brut);
    if (brut === '' || !Number.isInteger(n) || n < AGE_MIN || n > AGE_MAX) {
        return `Âge invalide (${AGE_MIN} à ${AGE_MAX}).`;
    }
    return '';
}

export function validerPoste(poste) {
    return poste ? '' : "Sélectionnez un poste.";
}

export function validerNumero(numero, joueurs, idIgnore = null) {
    const brut = String(numero).trim();
    const n = Number(brut);
    if (brut === '' || !Number.isInteger(n) || n < 1 || n > 99) {
        return "Numéro invalide (1 à 99).";
    }
    const pris = joueurs.find(j => j.numero === n && j.id !== idIgnore);
    return pris ? `Le numéro ${n} est déjà pris par ${pris.nom}.` : '';
}

export function validerStatut(statut){
    return statut ? '' : "Sélectionnez un statut." 
}

export function validerJoueur({ nom, age, poste, numero, statut }, joueurs, idIgnore = null) {
    return validerNom(nom)
        || validerAge(age)
        || validerPoste(poste)
        || validerNumero(numero, joueurs, idIgnore)
        || validerStatut(statut);
}

// Matches

export function validerNomMatch(nomMatch) {
    const n = nomMatch.trim();
    if (n.length < 3 || n.length > 30 || !REGEX_NOM.test(n) || !/\p{L}/u.test(n)) {
        return "Nom d'équipe invalide (3-30 lettres).";
    }
    return '';
}

export function validerDate(date){
    return date ? '' : "Sélectionnez une date." 
}

export function validerHeure(heure){
    return heure ? '' : "Sélectionnez un heure." 
}

export function validerAdresse(adresse) {
    const n = adresse.trim();
    if (n.length < 3 || n.length > 30 || !REGEX_NOM.test(n) || !/\p{L}/u.test(n)) {
        return "Lieu invalide (3-30 lettres).";
    }
    return '';
}

export function validerLieu(lieu){
    return lieu ? '' : "Sélectionnez un lieu." 
}

export function validerMatch(nomMatch, date, heure, adresse, lieu) {
    return validerNomMatch(nomMatch)
        || validerDate(date)
        || validerHeure(heure)
        || validerAdresse(adresse)
        || validerLieu(lieu);
}