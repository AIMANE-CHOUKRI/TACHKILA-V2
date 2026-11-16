export const joueursInitiaux = [
    { id: 1, nom: 'Yassine Amrani', numero: 1, age: 29, poste: 'gardien', statut: 'En forme', position: 'gb', capitaine: true },
    { id: 2, nom: 'Reda El Alami', numero: 2, age: 22, poste: 'defenseur', statut: 'En forme', position: 'dg', capitaine: false },
    { id: 3, nom: 'Nabil Zaki', numero: 3, age: 20, poste: 'defenseur', statut: 'En forme', position: 'banc', capitaine: false },
    { id: 4, nom: 'Hamza Idrissi', numero: 4, age: 33, poste: 'defenseur', statut: 'En forme', position: 'dc1', capitaine: false },
    { id: 5, nom: 'Anas Berrada', numero: 5, age: 22, poste: 'defenseur', statut: 'En forme', position: 'dd', capitaine: false },
    { id: 6, nom: 'Sofiane Tazi', numero: 6, age: 33, poste: 'milieu', statut: 'Blessé', position: 'banc', capitaine: false },
    { id: 7, nom: 'Omar Lahlou', numero: 8, age: 32, poste: 'milieu', statut: 'En forme', position: 'banc', capitaine: false },
    { id: 8, nom: 'Ayoub Sabir', numero: 9, age: 35, poste: 'attaquant', statut: 'En forme', position: 'bu1', capitaine: false },
    { id: 9, nom: 'Karim Belkacem', numero: 10, age: 27, poste: 'milieu', statut: 'En forme', position: 'mg', capitaine: false },
    { id: 10, nom: 'Walid Baddou', numero: 11, age: 21, poste: 'attaquant', statut: 'En forme', position: 'bu2', capitaine: false },
    { id: 11, nom: 'Adil Chraibi', numero: 13, age: 24, poste: 'defenseur', statut: 'Blessé', position: 'banc', capitaine: false },
    { id: 12, nom: 'Youssef Naciri', numero: 14, age: 23, poste: 'milieu', statut: 'En forme', position: 'mc1', capitaine: false },
    { id: 13, nom: 'Mehdi Mansouri', numero: 15, age: 22, poste: 'milieu', statut: 'En forme', position: 'mc2', capitaine: false },
    { id: 14, nom: 'Ilyas Bennani', numero: 18, age: 22, poste: 'milieu', statut: 'En forme', position: 'md', capitaine: false }
];

function dateDans(jours) {
    const d = new Date();
    d.setDate(d.getDate() + jours);
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const jour = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mois}-${jour}`;
}

export const matchesInitiaux = [
    { id: 1, adversaire: 'Olympique Safran', date: dateDans(5), heure: '15:00', lieu: 'Stade Municipal Oasis', type: 'domicile', scoreAtlas: null, scoreAdverse: null },
    { id: 2, adversaire: 'Club Atlas Sud', date: dateDans(-2), heure: '15:00', lieu: 'Stade Municipal Oasis', type: 'domicile', scoreAtlas: null, scoreAdverse: null },
    { id: 3, adversaire: 'Union Sportive Essaouira', date: dateDans(-9), heure: '18:00', lieu: 'Complexe Sportif Al Massira', type: 'domicile', scoreAtlas: 3, scoreAdverse: 1 },
    { id: 4, adversaire: 'Jeunesse Sportive Safi', date: dateDans(-16), heure: '16:00', lieu: 'Stade El Massira', type: 'exterieur', scoreAtlas: 0, scoreAdverse: 2 },
    { id: 5, adversaire: 'Widad Amicale', date: dateDans(-23), heure: '17:30', lieu: 'Stade des Palmiers', type: 'exterieur', scoreAtlas: 1, scoreAdverse: 1 }
];