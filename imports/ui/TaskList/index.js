import React, { useTransition } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import '/imports/ui/styles/tasklist.css';

export default TaskList = () => {
    const subscribeUndone = Meteor.subscribe('task.undone');
    const subscribeDone = Meteor.subscribe('task.done');

    // Función para obtener valor numérico de prioridad (para ordenar)
    const getPriorityValue = (priority) => {
        switch(priority) {
            case 'muy-urgente': return 5;
            case 'urgente': return 4;
            case 'normal': return 3;
            case 'baja': return 2;
            case 'no-urgente': return 1;
            default: return 3; // Normal por defecto
        }
    };

    const taskUndone = useTracker(() => {
        const tasks = task.find({done: false}).fetch();
        // Ordenar por prioridad (de mayor a menor urgencia)
        return tasks.sort((a, b) => 
            getPriorityValue(b.priority) - getPriorityValue(a.priority)
        );
    });

    const taskDone = useTracker(() => {
        const tasks = task.find({done: true}).fetch();
        // Ordenar por prioridad (de mayor a menor urgencia)
        return tasks.sort((a, b) => 
            getPriorityValue(b.priority) - getPriorityValue(a.priority)
        );
    });
    
    // Función para obtener la clase CSS según la prioridad
    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'muy-urgente':
                return 'priority-muy-urgente';
            case 'urgente':
                return 'priority-urgente';
            case 'normal':
                return 'priority-normal';
            case 'baja':
                return 'priority-baja';
            case 'no-urgente':
                return 'priority-no-urgente';
            default:
                return 'priority-normal';
        }
    };
    
    // Función para obtener el texto de la etiqueta según la prioridad
    const getPriorityLabel = (priority) => {
        switch(priority) {
            case 'muy-urgente':
                return 'Muy urgente';
            case 'urgente':
                return 'Urgente';
            case 'normal':
                return 'Normal';
            case 'baja':
                return 'Baja';
            case 'no-urgente':
                return 'No urgente';
            default:
                return 'Normal';
        }
    };
    
    return (     
        <>
           <h2 className="h2-title">Lista de tareas</h2>
        <div className="div-container-tasklist">
            <div className="div-container-tasklist-undone">
                <h2 className="h2-task-undone">Tareas pendientes</h2>
                {taskUndone.length === 0 ? (
                    <p>No hay tareas pendientes</p>
                        ) : (taskUndone.map((task, index, array) => (
                            <><li key={task._id}>
                                <div className="task-content">
                                    <span className="task-text"> {task.name_task}</span>
                                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                </div>
                                <input placeholder="✔" className="task-checkbox" type="checkbox" checked={task.done}
                                    onChange={() => Meteor.call("task.update", task._id, !task.done)} />
 
                            </li>
                            {index < array.length - 1 && <div className="separador" />}
                           
        </>
                        ))
                )}
            </div>
            
            <div className="div-container-tasklist-done">
                <h2>Tareas completadas</h2>
                {taskDone.length === 0 ? (
                    <p>No hay tareas pendientes</p>
                        ) : (taskDone.map((task, index, array) => (
                            <><li key={task._id}>
                                <div className="task-content">
                                    <span className="task-text">{task.name_task}</span>
                                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                </div>
                                <span className="task-checkbox">✔</span>
                            </li>
                            {index < array.length - 1 && <div className="separador" />}
        </>
                        ))
                )}
            </div>
        </div>
        </>
    )
}