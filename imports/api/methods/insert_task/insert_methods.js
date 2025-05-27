import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { task } from '/imports/api/task_collection/task';

Meteor.methods({
    async 'task.insert'(taskinsert) {
        check(taskinsert, {
            name_task: String,
            done: Boolean,
            priority: String,
            description: String,
        });

        // Determinar la posición máxima actual para tareas no completadas
        const maxPositionTask = await task.findOneAsync(
            { done: taskinsert.done },
            { sort: { position: -1 }, fields: { position: 1 } }
        );

        // Establecer la nueva posición como la máxima + 1, o 0 si no hay tareas
        const newPosition = maxPositionTask && typeof maxPositionTask.position === 'number' 
            ? maxPositionTask.position + 1 
            : 0;

        // Crear tarea con posición, fecha de creación y fecha de finalización inicial
        const taskWithPosition = {
            ...taskinsert,
            position: newPosition,
            createdAt: new Date(),
            completedAt: null
        };

        return await task.insertAsync(taskWithPosition);
    },
});