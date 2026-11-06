import { joueursInitiaux } from "./donnees-initiales";

function lire(cle, parDefaut) {
    try {
        const valeur = JSON.parse(localStorage.getItem(cle));
        return Array.isArray(valeur) ? valeur : structuredClone(parDefaut);
    } catch {
        return structuredClone(parDefaut);
    }
}

function enregistrer(cle, valeur) {
    localStorage.setItem(cle, JSON.stringify(valeur));
}

export function lireJoueurs(){
    return lire('joueurs',joueursInitiaux);
}

export function enregistrerJoueurs(joueurs){
    enregistrer('joueurs',joueurs);
}
