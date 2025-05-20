import React from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { FaTrash, FaCheck, FaBars } from 'react-icons/fa';
import '/imports/ui/styles/tasklist.css';

// Constantes para prioridad importadas desde un archivo de constantes
import { PRIORITY_CLASSES, PRIORITY_LEVELS } from '/imports/ui/utils/constants';

const TaskItem = ({ task, index, isLastItem, isDone, handleDragStart, handleDragEnd, getPriorityClass, getPriorityLabel }) => {
    const handleDeleteTask = () => {
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
                Meteor.call("task.delete", task._id, (error) => {
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
                    } else {
                        Swal.fire({
                            toast: true,
                            position: 'bottom',
                            icon: 'success',
                            title: '¡Eliminada!',
                            text: 'La tarea ha sido eliminada',
                            showConfirmButton: false,
                            timer: 1900
                        }
                        );
                    }
                });
            }
        });
    };
    
    return (
        <div className="task-container" key={task._id}>
            <li
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                className="task-item"
            >
                <div className="task-content">
                    <span className="task-text">{task.name_task}</span>
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                    </span>
                </div>
                <div className="task-actions">
                    <button 
                        className="delete-task-button" 
                        onClick={handleDeleteTask}
                        title="Eliminar tarea"
                    >
                        <FaTrash className="icon-blue" />
                    </button>
                    <div className="task-drag-handle">
                        <span className="drag-icon">
                            {isDone ? <FaCheck className="icon-blue" /> : <FaBars className="icon-blue" />}
                        </span>
                    </div>
                </div>
            </li>
            {!isLastItem && <div className="separador" />}
        </div>
    );
};

export default TaskItem; 