import React, { useTransition } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import '/imports/ui/styles/tasklist.css';

export default TaskList = () => {
    const subscribeUndone = Meteor.subscribe('task.undone');
    const subscribeDone = Meteor.subscribe('task.done');

    const taskUndone = useTracker(() => {
        return task.find({done: false}).fetch();
    });

    const taskDone = useTracker(() => {
        return task.find({done: true}).fetch();
    });
    
    return (     
        <>
           <h2 className="h2-title">Lista de tareas</h2>
        <div className="div-container-tasklist">
            <div className="div-container-tasklist-undone">
                <h2 className="h2-task-undone">Tareas pendientes</h2>
                {taskUndone.length === 0 ? (
                    <p>No hay tareas pendientes</p>
                        ) : (taskUndone.map((task) => (
                            <li key={task._id}>
                                {task.name_task} 
                                <input type="checkbox" checked={task.done} 
                                onChange={() => Meteor.call("task.update", task._id, !task.done)}/>
                            </li>
                        ))
                )}
            </div>
            
            <div className="div-container-tasklist-done">
                <h2>Tareas completadas</h2>
                {taskDone.length === 0 ? (
                    <p>No hay tareas pendientes</p>
                        ) : (taskDone.map((task) => (
                            <li key={task._id}>
                                {task.name_task} ✔</li>
                        ))
                )}
            </div>
        </div>
        </>
    )
    }