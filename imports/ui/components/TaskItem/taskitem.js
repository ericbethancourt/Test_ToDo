import React from 'react';
import { FaTrash, FaCheck, FaBars } from 'react-icons/fa';
import '/imports/ui/styles/tasklist.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deleteTask } from '/imports/ui/components/TaskOperations/TaskOperations';
import { PRIORITY_CLASSES, PRIORITY_LEVELS } from '/imports/ui/utils/constants';

const TaskItem = ({ task, index, isLastItem, isDone, getPriorityClass, getPriorityLabel }) => {
    // Configuración optimizada con mejores opciones de interactividad
    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition,
        isDragging 
    } = useSortable({
        id: task._id,
        data: {
            task: task,
            index
        },
        // Configurar un área de arrastre extendida para mejor detección
        layoutMeasuring: {
            strategy: 'always',
        },
        transition: {
            duration: 120, // ms
            easing: 'ease-out'
        }
    });
    
    // Estilo simplificado para mejor rendimiento con transición controlada
    const style = {
        ...(transform ? { 
            transform: CSS.Transform.toString(transform),
            transition: transition
        } : {}),
        opacity: isDragging ? 0.4 : 1,
        visibility: isDragging ? 'hidden' : 'visible',
    };
    
    // Manejar la eliminación de tareas
    const handleDeleteTask = () => {
        deleteTask(task._id);
    };
    
    // Clase condicional simplificada para mejor rendimiento
    const containerClass = `task-container${isDragging ? ' task-container-dragging' : ''}`;
    
    return (
        // Usar clases preparadas en lugar de cálculos en línea
        <div 
            className={containerClass}
            key={task._id}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <li className={`task-item${isDragging ? ' dragging' : ''}`}>
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