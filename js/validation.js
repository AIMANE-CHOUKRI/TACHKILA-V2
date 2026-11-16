export const ageMin = 18;
export const ageMax = 39;
export const nbGardiensMax = 2;

export const regexNom = /^[\p{L}][\p{L}\s'’-]{2,29}$/u;
export const regexNumero = /^([1-9]|[1-9][0-9])$/;
export const regexAge = /^(1[89]|2[0-9]|3[0-9])$/;
export const regexAdversaire = /^[\p{L}\d][\p{L}\d\s'’.-]{1,29}$/u;
export const regexLieu = /^[\p{L}\d][\p{L}\d\s'’.,-]{1,39}$/u;
export const regexDate = /^\d{4}-\d{2}-\d{2}$/;
export const regexHeure = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
export const regexScore = /^[0-9]{1,2}$/;

export function validerNom(nom) {
    if (!regexNom.test(nom.trim())) {
        return "Le nom doit contenir 3 à 30 lettres.";
    }
    return '';
}

export function validerAge(age) {
    if (!regexAge.test(String(age).trim())) {
        return `L'âge doit être compris entre ${ageMin} et ${ageMax} ans.`;
    }
    return '';
}

export function validerPoste(poste, joueurs, idIgnore = null) {
    if (poste === '') {
        return "Sélectionnez un poste.";
    }
    if (poste === 'gardien') {
        const autresGardiens = joueurs.filter(j => j.poste === 'gardien' && j.id !== idIgnore);
        if (autresGardiens.length >= nbGardiensMax) {
            return `L'effectif compte déjà ${nbGardiensMax} gardiens.`;
        }
    }
    return '';
}

export function validerNumero(numero, joueurs, idIgnore = null) {
    const texte = String(numero).trim();
    if (!regexNumero.test(texte)) {
        return "Le numéro doit être compris entre 1 et 99.";
    }
    const pris = joueurs.find(j => j.numero === Number(texte) && j.id !== idIgnore);
    if (pris) {
        return `Le numéro ${texte} est déjà pris par ${pris.nom}.`;
    }
    return '';
}

export function validerStatut(statut) {
    if (statut !== 'En forme' && statut !== 'Blessé') {
        return "Sélectionnez un statut.";
    }
    return '';
}

export function validerJoueur({ nom, age, poste, numero, statut }, joueurs, idIgnore = null) {
    return {
        nom: validerNom(nom),
        age: validerAge(age),
        poste: validerPoste(poste, joueurs, idIgnore),
        numero: validerNumero(numero, joueurs, idIgnore),
        statut: validerStatut(statut)
    };
}

export function formulaireValide(erreurs) {
    return !Object.values(erreurs).some(message => message !== '');
}

export function validerAdversaire(adversaire) {
    if (!regexAdversaire.test(adversaire.trim())) {
        return "L'adversaire doit contenir 2 à 30 caractères.";
    }
    return '';
}

export function validerDate(date) {
    if (!regexDate.test(date)) {
        return "Choisissez une date valide.";
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) {
        return "Choisissez une date valide.";
    }
    return '';
}

export function validerHeure(heure) {
    if (!regexHeure.test(heure)) {
        return "Saisissez une heure valide (HH:MM).";
    }
    return '';
}

export function validerLieu(lieu) {
    if (!regexLieu.test(lieu.trim())) {
        return "Le lieu doit contenir 2 à 40 caractères.";
    }
    return '';
}

export function validerType(type) {
    if (type !== 'domicile' && type !== 'exterieur') {
        return "Choisissez domicile ou extérieur.";
    }
    return '';
}

export function validerMatch({ adversaire, date, heure, lieu, type }) {
    return {
        adversaire: validerAdversaire(adversaire),
        date: validerDate(date),
        heure: validerHeure(heure),
        lieu: validerLieu(lieu),
        type: validerType(type)
    };
}

export function validerScore(score) {
    if (!regexScore.test(String(score).trim())) {
        return "Le score doit être un nombre entre 0 et 99.";
    }
    return '';
}

export function validerScores({ scoreAtlas, scoreAdverse }) {
    return {
        scoreAtlas: validerScore(scoreAtlas),
        scoreAdverse: validerScore(scoreAdverse)
    };
}