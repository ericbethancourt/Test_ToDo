import { PRIORITY_VALUES } from './constants';

// Función para filtrar tareas por prioridad individual
export const filterTasksByPriority = (tasks, priorityFilter) => {
    if (!priorityFilter) {
        return tasks;
    }
    return tasks.filter(task => task.priority === priorityFilter);
};

// Función para ordenar tareas por prioridad grupal
export const sortTasksByPriority = (tasks, sortOrder) => {
    if (!sortOrder) {
        return tasks;
    }
    
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityA = PRIORITY_VALUES[a.priority] || 0;
        const priorityB = PRIORITY_VALUES[b.priority] || 0;
        
        if (sortOrder === 'high-to-low') {
            return priorityB - priorityA; // Mayor a menor
        } else if (sortOrder === 'low-to-high') {
            return priorityA - priorityB; // Menor a mayor
        }
        
        return 0;
    });
    
    return sortedTasks;
};

// Función combinada para aplicar ambos filtros
export const applyTaskFilters = (tasks, individualFilter, groupFilter) => {
    // Primero aplicar filtro individual
    let filteredTasks = filterTasksByPriority(tasks, individualFilter);
    
    // Luego aplicar ordenamiento grupal
    filteredTasks = sortTasksByPriority(filteredTasks, groupFilter);
    
    return filteredTasks;
}; 