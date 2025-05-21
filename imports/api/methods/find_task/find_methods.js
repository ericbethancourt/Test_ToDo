import { Meteor } from "meteor/meteor";
import { task } from '/imports/api/task_collection/task';

//Tareas pendientes
Meteor.publish('task.undone', function() {
    return task.find(
        { done: false },
        { sort: { position: 1 } } // Ordenar por posición ascendente
    );
});

//Tareas completadas
Meteor.publish('task.done', function() {
    return task.find(
        { done: true },
        { sort: { position: 1 } } // Ordenar por posición ascendente
    );
});
