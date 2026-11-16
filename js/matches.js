export function dateHeureMatch(match) {
    return new Date(`${match.date}T${match.heure}`);
}

export function matchEstJoue(match) {
    return dateHeureMatch(match).getTime() < Date.now();
}

export function scoreEstSaisi(match) {
    return match.scoreAtlas !== null && match.scoreAdverse !== null;
}

export function resultatMatch(match) {
    if (!scoreEstSaisi(match)) return null;
    if (match.scoreAtlas > match.scoreAdverse) return 'victoire';
    if (match.scoreAtlas < match.scoreAdverse) return 'defaite';
    return 'nul';
}

export function trouverMatch(matches, id) {
    return matches.find(m => m.id === id) ?? null;
}

export function titreMatch(match) {
    return match.type === 'domicile' ? `Atlas FC vs ${match.adversaire}` : `${match.adversaire} vs Atlas FC`;
}

export function formaterDateMatch(match) {
    const d = dateHeureMatch(match);
    return {
        jourSemaine: d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '').toUpperCase(),
        jour: d.getDate(),
        mois: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()
    };
}

export function ajouterMatch(matches, { adversaire, date, heure, lieu, type }) {
    const nouveau = {
        id: Date.now(),
        adversaire: adversaire.trim(),
        date,
        heure,
        lieu: lieu.trim(),
        type,
        scoreAtlas: null,
        scoreAdverse: null
    };
    return [...matches, nouveau];
}

export function modifierMatch(matches, id, { adversaire, date, heure, lieu, type }) {
    return matches.map(m => {
        if (m.id !== id) return m;
        const modifie = { ...m, adversaire: adversaire.trim(), date, heure, lieu: lieu.trim(), type };
        if (!matchEstJoue(modifie)) {
            modifie.scoreAtlas = null;
            modifie.scoreAdverse = null;
        }
        return modifie;
    });
}

export function supprimerMatch(matches, id) {
    return matches.filter(m => m.id !== id);
}

export function saisirScore(matches, id, scoreAtlas, scoreAdverse) {
    const match = trouverMatch(matches, id);
    if (!match || !matchEstJoue(match)) {
        return null;
    }
    return matches.map(m => m.id === id ? { ...m, scoreAtlas: Number(scoreAtlas), scoreAdverse: Number(scoreAdverse) } : m);
}

export function trierMatches(matches) {
    return [...matches].sort((a, b) => dateHeureMatch(a) - dateHeureMatch(b));
}

export function filtrerMatches(matches, onglet, recherche) {
    const texte = recherche.trim().toLowerCase();
    return matches.filter(m => {
        const ongletCorrespond = onglet === 'tous' || (onglet === 'joues') === matchEstJoue(m);
        const adversaireCorrespond = m.adversaire.toLowerCase().includes(texte);
        return ongletCorrespond && adversaireCorrespond;
    });
}

export function compterParOnglet(matches) {
    const joues = matches.filter(m => matchEstJoue(m)).length;
    return { tous: matches.length, avenir: matches.length - joues, joues };
}