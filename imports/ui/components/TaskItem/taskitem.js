import React from 'react';
import { FaTrash, FaCheck, FaBars, FaEdit } from 'react-icons/fa';
import '/imports/ui/styles/tasklist.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deleteTask, editTask } from '/imports/ui/components/TaskOperations/TaskOperations';
import { formatDate, PRIORITY_LEVELS, PRIORITY_LABELS } from '/imports/ui/utils/constants';

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
    const handleDeleteTask = (e) => {
        e.stopPropagation(); // Prevenir que se active el drag
        deleteTask(task._id);
    };
    
    // Manejar la edición de tareas
    const handleEditTask = (e) => {
        e.stopPropagation(); // Prevenir que se active el drag
        editTask(
            task,
            PRIORITY_LEVELS,
            PRIORITY_LABELS,
            () => {
                // Callback de éxito - la tarea se actualizará automáticamente vía reactive data
                console.log('Tarea editada exitosamente');
            },
            (error) => {
                // Callback de error
                console.error('Error editando tarea:', error);
            }
        );
    };
    
    // Obtener la fecha apropiada según el estado de la tarea
    const getTaskDate = () => {
        if (isDone && task.completedAt) {
            return formatDate(task.completedAt);
        } else if (!isDone && task.createdAt) {
            return formatDate(task.createdAt);
        }
        return '';
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
                    <div className="task-meta">
                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                        </span>
                        {getTaskDate() && (
                            <span className="task-date">
                                {getTaskDate()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="task-actions">
                    {!isDone && (
                        <button 
                            className="edit-task-button" 
                            onClick={handleEditTask}
                            title="Editar tarea"
                        >
                            <FaEdit className="icon-blue" />
                        </button>
                    )}
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