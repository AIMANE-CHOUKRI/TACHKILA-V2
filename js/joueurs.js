const positions = {
    gardien: [['gb','GB - Gardien']],
    defenseur: [['dg','DG - Défenseur gauche'], ['dc1','DC - Central 1'], ['dc2','DC - Central 2'], ['dd','DD - Défenseur droit']],
    milieu: [['mg','MG - Défenseur gauche'], ['mc1','MC - Central 1'], ['mc2','MC - Central 2'], ['md','MD - Défenseur droit']],
    attaquant: [['bu1','BU - Buteur 1'], ['bu2','Buteur - 2']]
};

export function positionsPourPoste(poste){
    return positions[poste] ?? [];
}

export function posteCompatible(poste, position){
    return positionsPourPoste(poste).some(([code]) => code === position);
}

export function joueurALaPosition(joueurs, position){
    return joueurs.find(j => j.position === position) ?? null;
}

export function compterPlaces(joueurs){
    return joueurs.filter(j => j.position && j.position !== 'banc').length;
}

export function ajouterJoueur(joueurs, {nom,age,poste,numero}){
    const nouveau = {
        id: Date.now(),
        nom: nom.trim(),
        age: age === underfined ? null: Number(age),
        numero: Number(numero),
        poste,
        position: 'banc'
    };
    return [...joueurs, nouveau];
}

export function modifierJoueur(joueurs, id, {nom,age,poste,numero}){
    return joueurs.map(j => {
        if(j.id !== id) return j;
        return {
            ...j,
            nom: nom.trim(),
            age: age === undefined ? j.age : Number(age),
            numero: Number(numero),
            poste,
            position: j.poste === poste ? j.position : 'banc'
        };
    });
}

export function supprimerJoueur(joueurs, id){
    return joueurs.filter(j => j.id !== id);
}

export function placerJoueur(joueurs,id,position){
    if (position !== 'banc' && joueurs.some(j => j.position === position && j.id !== id)) {
        return null;
    }
    return joueurs.map(j => j.id === id ? { ...j, position } : j);
}