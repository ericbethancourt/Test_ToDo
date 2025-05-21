import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { arrayMove } from '@dnd-kit/sortable';

// Función para actualizar el estado de una tarea (completada/pendiente)
export const updateTaskStatus = (taskId, newStatus, onSuccess, onError) => {
    Meteor.call("task.update", taskId, newStatus, (error) => {
        if (error) {
            // Si hay error, notificar
            Swal.fire({
                toast: true,
                position: 'bottom',
                icon: 'error',
                title: 'Error',
                text: 'No se pudo mover la tarea',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (onError) onError(error);
        } else {
            if (onSuccess) onSuccess();
        }
    });
};

// Función para eliminar una tarea
export const deleteTask = (taskId, onSuccess, onError) => {
    Swal.fire({
        toast: true,
        position: 'bottom',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Meteor.call("task.delete", taskId, (error) => {
                if (error) {
                    Swal.fire({
                        toast: true,
                        position: 'bottom',
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un error al eliminar la tarea',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    
                    if (onError) onError(error);
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'bottom',
                        icon: 'success',
                        title: '¡Eliminada!',
                        text: 'La tarea ha sido eliminada',
                        showConfirmButton: false,
                        timer: 1900
                    });
                    
                    if (onSuccess) onSuccess();
                }
            });
        }
    });
};

// Función para reordenar tareas
export const reorderTasks = (taskIds, containerType, onSuccess, onError) => {
    Meteor.call("task.reorder", taskIds, containerType, (error) => {
        if (error) {
            Swal.fire({
                toast: true,
                position: 'bottom',
                icon: 'error',
                title: 'Error',
                text: 'No se pudo reordenar las tareas',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (onError) onError(error);
        } else {
            if (onSuccess) onSuccess();
        }
    });
};

// Función para crear una nueva tarea
export const createTask = (taskData, onSuccess, onError) => {
    if (taskData.name_task.trim() === "") {
        Swal.fire({
            toast: true,
            position: 'bottom',
            icon: 'question',
            title: 'Oops...',
            text: 'La tarea no puede estar vacía',
            showConfirmButton: false,
            timer: 2500,
        });
        return;
    }
    
    Meteor.call("task.insert", taskData, (error, result) => {
        if (error) {
            Swal.fire({
                toast: true,
                position: 'bottom',
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un error al insertar la tarea',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (onError) onError(error);
        } else {
            Swal.fire({
                toast: true,
                position: 'bottom',
                icon: 'success',
                title: 'Tarea insertada correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (onSuccess) onSuccess(result);
        }
    });
};

// Funciones para calcular nuevas posiciones después de ordenar
export const generateNewTaskLists = (activeTask, overTask, localTaskUndone, localTaskDone) => {
    // Si tienen el mismo estado (ambas completadas o ambas pendientes)
    if (activeTask.done === overTask.done) {
        // Determinar qué array modificar
        const tasks = activeTask.done ? [...localTaskDone] : [...localTaskUndone];
        
        // Encontrar los índices
        const activeIndex = tasks.findIndex(t => t._id === activeTask._id);
        const overIndex = tasks.findIndex(t => t._id === overTask._id);
        
        if (activeIndex !== -1 && overIndex !== -1) {
            // Reordenar usando arrayMove
            const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);
            
            // Devolver los arrays actualizados
            if (activeTask.done) {
                return {
                    undone: localTaskUndone,
                    done: reorderedTasks
                };
            } else {
                return {
                    undone: reorderedTasks,
                    done: localTaskDone
                };
            }
        }
    } else {
        // Si tienen estados diferentes, la tarea activa cambia de estado
        const updatedTask = { ...activeTask, done: overTask.done };
        
        // Eliminar del contenedor original
        let newUndone = [...localTaskUndone];
        let newDone = [...localTaskDone];
        
        if (activeTask.done) {
            newDone = newDone.filter(t => t._id !== activeTask._id);
        } else {
            newUndone = newUndone.filter(t => t._id !== activeTask._id);
        }
        
        // Insertar en el nuevo contenedor en la posición correcta
        if (updatedTask.done) {
            const overIndex = localTaskDone.findIndex(t => t._id === overTask._id);
            if (overIndex !== -1) {
                newDone.splice(overIndex, 0, updatedTask);
            } else {
                newDone.push(updatedTask);
            }
        } else {
            const overIndex = localTaskUndone.findIndex(t => t._id === overTask._id);
            if (overIndex !== -1) {
                newUndone.splice(overIndex, 0, updatedTask);
            } else {
                newUndone.push(updatedTask);
            }
        }
        
        return {
            undone: newUndone,
            done: newDone
        };
    }
    
    // Si algo falla, devolver los arrays originales
    return {
        undone: localTaskUndone,
        done: localTaskDone
    };
}; 