export function paginer(liste, page, parPage) {
    const totalPages = Math.max(1, Math.ceil(liste.length / parPage));
    const pageCourante = Math.min(Math.max(page, 1), totalPages);
    const debut = (pageCourante - 1) * parPage;
    return {
        elements: liste.slice(debut, debut + parPage),
        pageCourante,
        totalPages
    };
}