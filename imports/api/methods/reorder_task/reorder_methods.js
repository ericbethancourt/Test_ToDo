import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import { check } from 'meteor/check';

Meteor.methods({
    async 'task.reorder'(taskIds, containerType) {
        // Validar parámetros
        check(taskIds, [String]);
        check(containerType, String);
        
        // Verificar que el contenedor es válido
        if (containerType !== 'done' && containerType !== 'undone') {
            throw new Meteor.Error('invalid-container', 'El contenedor debe ser "done" o "undone"');
        }
        
        // Determinar si las tareas están completadas o no según el contenedor
        const isDone = containerType === 'done';
        
        // Para cada tarea en el array, actualizar su posición
        const updates = taskIds.map(async (taskId, index) => {
            return await task.updateAsync(
                { _id: taskId },
                { 
                    $set: { 
                        position: index,
                        done: isDone // Asegurarse de que la tarea esté en el estado correcto
                    } 
                }
            );
        });
        
        // Ejecutar todas las actualizaciones y devolver el resultado
        return await Promise.all(updates);
    }
}); 