import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import { check } from 'meteor/check';


Meteor.methods({
    async 'task.update'(taskId, status){
        check(taskId, String);
        check(status, Boolean);
        
        // Preparar los campos a actualizar
        const updateFields = { done: status };
        
        // Si la tarea se está completando, añadir fecha de finalización
        if (status === true) {
            updateFields.completedAt = new Date();
        } else {
            // Si se está marcando como no completada, limpiar fecha de finalización
            updateFields.completedAt = null;
        }
        
        return await task.updateAsync(taskId, {$set: updateFields});
    },

    async 'task.edit'(taskId, taskName, priority){
        check(taskId, String);
        check(taskName, String);
        check(priority, String);
        
        // Validar que el nombre no esté vacío
        if (taskName.trim().length === 0) {
            throw new Meteor.Error('invalid-task-name', 'El nombre de la tarea no puede estar vacío');
        }
        
        // Preparar los campos a actualizar
        const updateFields = { 
            name_task: taskName.trim(),
            priority: priority
        };
        
        return await task.updateAsync(taskId, {$set: updateFields});
    }
});