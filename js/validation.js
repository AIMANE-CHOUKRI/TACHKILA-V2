export const ageMin = 18;
export const ageMax = 39;

export const regexNom = /^[\p{L}\s'’-]+$/u;

export function validerNom(nom){
    const n = nom.trim();
    if (n.length < 3 || n.length > 30 || !regexNom.test(n) || !/\p{L}/u.test(n)){
        return "Nom invalide (3-30 lettres).";
    }
    return '';
}

export function validerAge(age){
    const a = String(age).trim();
    const n = Number(a);
    if (a === '' || !Number.isInteger(n) || n < ageMin || n > ageMax){
        return `Âge invalide (${ageMin} à ${ageMax}).`;
    }
    return '';
}

export function validerPoste(poste){
    return poste ? '' : "Sélectionnez un poste.";
}

export function validerNumero(numero, joueurs, idIgnore = null){
    const num = String(numero).trim();
    const n = Number(num);
    if (num === '' || !Number.isInteger(n) || n < 1 || n > 99){
        return "Numéro invalide (1 à 99).";
    }
    const pris = joueurs.find(j => j.numero === n && j.id !== idIgnore);
    return pris ? `Le numéro ${n} est déjà pris par ${pris.nom}.` : '';
}

export function validerStatut(statut){
    return statut ? '' : "Sélectionnez un statut."
}

export function validerJoueur({nom,age,poste,numero,statut},joueurs,idIgnore=null){
    return validerNom(nom)
    || validerAge(age)
    || validerPoste(poste)
    || validerNumero(numero,joueurs,idIgnore)
    || validerStatut(statut);
}