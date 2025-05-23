// Constantes para los niveles de prioridad
export const PRIORITY_LEVELS = {
    VERY_URGENT: 'muy-urgente',
    URGENT: 'urgente',
    NORMAL: 'normal',
    LOW: 'baja',
    NOT_URGENT: 'no-urgente'
};

// Constantes para los valores de prioridad (para ordenar)
export const PRIORITY_VALUES = {
    [PRIORITY_LEVELS.VERY_URGENT]: 5,
    [PRIORITY_LEVELS.URGENT]: 4,
    [PRIORITY_LEVELS.NORMAL]: 3,
    [PRIORITY_LEVELS.LOW]: 2,
    [PRIORITY_LEVELS.NOT_URGENT]: 1
};

// Constantes para las clases CSS de prioridad
export const PRIORITY_CLASSES = {
    [PRIORITY_LEVELS.VERY_URGENT]: 'priority-muy-urgente',
    [PRIORITY_LEVELS.URGENT]: 'priority-urgente',
    [PRIORITY_LEVELS.NORMAL]: 'priority-normal',
    [PRIORITY_LEVELS.LOW]: 'priority-baja',
    [PRIORITY_LEVELS.NOT_URGENT]: 'priority-no-urgente'
};

// Constantes para las etiquetas de prioridad
export const PRIORITY_LABELS = {
    [PRIORITY_LEVELS.VERY_URGENT]: 'Muy urgente',
    [PRIORITY_LEVELS.URGENT]: 'Urgente',
    [PRIORITY_LEVELS.NORMAL]: 'Normal',
    [PRIORITY_LEVELS.LOW]: 'Baja',
    [PRIORITY_LEVELS.NOT_URGENT]: 'No urgente'
};

// Función para formatear fechas en formato dd/mm/aaaa
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}; 