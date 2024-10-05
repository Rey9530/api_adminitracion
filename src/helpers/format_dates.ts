
// Función para formatear fechas de forma nativa en JavaScript
export function formatDate(date: Date, forFileName: boolean = false): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, se suma 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (forFileName) {
        // Formato para nombres de archivo: YYYYMMDD_HHmmss
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    } else {
        // Formato estándar: YYYY-MM-DD HH:mm:ss
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export function formatOnlyDate(date: Date, forFileName: boolean = false): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, se suma 1
    const day = String(date.getDate()).padStart(2, '0'); 

    if (forFileName) {
        // Formato para nombres de archivo: YYYYMMDD_HHmmss
        return `${year}${month}${day}`;
    } else {
        // Formato estándar: YYYY-MM-DD HH:mm:ss
        return `${year}-${month}-${day}`;
    }
}