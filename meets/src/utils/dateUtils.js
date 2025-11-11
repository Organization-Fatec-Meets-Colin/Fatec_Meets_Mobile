/**
 * Calcula quanto tempo passou desde uma data até agora
 * @param {string|Date} date - Data no formato ISO ou objeto Date
 * @returns {string} Tempo relativo formatado (ex: "há 2h", "há 3 dias")
 */
export const getTimeAgo = (date) => {
    if (!date) return '';

    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now - postDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return 'agora';
    } else if (diffInMinutes < 60) {
        return `há ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
        return `há ${diffInHours}h`;
    } else if (diffInDays < 7) {
        return diffInDays === 1 ? 'há 1 dia' : `há ${diffInDays} dias`;
    } else if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? 'há 1 semana' : `há ${diffInWeeks} semanas`;
    } else if (diffInMonths < 12) {
        return diffInMonths === 1 ? 'há 1 mês' : `há ${diffInMonths} meses`;
    } else {
        return diffInYears === 1 ? 'há 1 ano' : `há ${diffInYears} anos`;
    }
};

/**
 * Formata uma data para exibição detalhada
 * @param {string|Date} date - Data no formato ISO ou objeto Date
 * @returns {string} Data formatada (ex: "08/11/2025 às 14:30")
 */
export const formatDate = (date) => {
    if (!date) return '';

    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};
