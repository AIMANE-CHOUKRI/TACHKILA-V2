export const nbPlacesMax = 11;

const positions = {
    gardien: [
        ['gb', 'GB - Gardien']
    ],
    defenseur: [
        ['dg', 'DG - Arrière gauche'],
        ['dc1', 'DC - Défenseur central 1'],
        ['dc2', 'DC - Défenseur central 2'],
        ['dd', 'DD - Arrière droit']
    ],
    milieu: [
        ['mg', 'MG - Milieu gauche'],
        ['mc1', 'MC - Milieu central 1'],
        ['mc2', 'MC - Milieu central 2'],
        ['md', 'MD - Milieu droit']
    ],
    attaquant: [
        ['bu1', 'BU - Buteur 1'],
        ['bu2', 'BU - Buteur 2']
    ]
};

export function positionsPourPoste(poste) {
    return positions[poste] ?? [];
}

export function posteCompatible(poste, position) {
    return positionsPourPoste(poste).some(([code]) => code === position);
}

export function joueurALaPosition(joueurs, position) {
    return joueurs.find(j => j.position === position) ?? null;
}

export function compterPlaces(joueurs) {
    return joueurs.filter(j => j.position !== 'banc').length;
}

export function trouverJoueur(joueurs, id) {
    return joueurs.find(j => j.id === id) ?? null;
}

export function ajouterJoueur(joueurs, { nom, age, poste, numero, statut }) {
    const nouveau = {
        id: Date.now(),
        nom: nom.trim(),
        numero: Number(numero),
        age: Number(age),
        poste,
        statut,
        position: 'banc',
        capitaine: false
    };
    return [...joueurs, nouveau];
}

export function modifierJoueur(joueurs, id, { nom, age, poste, numero, statut }) {
    return joueurs.map(j => {
        if (j.id !== id) return j;
        const quitteLeTerrain = j.poste !== poste || statut === 'Blessé';
        return {
            ...j,
            nom: nom.trim(),
            numero: Number(numero),
            age: Number(age),
            poste,
            statut,
            position: quitteLeTerrain ? 'banc' : j.position
        };
    });
}

export function supprimerJoueur(joueurs, id) {
    return joueurs.filter(j => j.id !== id);
}

export function peutPlacer(joueurs, id, position) {
    const joueur = trouverJoueur(joueurs, id);
    if (!joueur) return "Joueur introuvable.";
    if (position === 'banc') return '';
    if (joueur.statut === 'Blessé') return `${joueur.nom} est blessé, il ne peut pas jouer.`;
    if (!posteCompatible(joueur.poste, position)) return "Cette position ne correspond pas au poste du joueur.";
    const occupant = joueurALaPosition(joueurs, position);
    if (occupant && occupant.id !== id) return `Cette position est déjà occupée par ${occupant.nom}.`;
    return '';
}

export function placerJoueur(joueurs, id, position) {
    if (peutPlacer(joueurs, id, position) !== '') {
        return null;
    }
    return joueurs.map(j => j.id === id ? { ...j, position } : j);
}

export function designerCapitaine(joueurs, id) {
    const dejaCapitaine = joueurs.some(j => j.id === id && j.capitaine);
    return joueurs.map(j => ({ ...j, capitaine: j.id === id && !dejaCapitaine }));
}

export function filtrerJoueurs(joueurs, recherche, poste) {
    const texte = recherche.trim().toLowerCase();
    return joueurs.filter(j => {
        const nomCorrespond = j.nom.toLowerCase().includes(texte);
        const posteCorrespond = poste === 'tous' || j.poste === poste;
        return nomCorrespond && posteCorrespond;
    });
}