import React from 'react';
import TaskItem from '/imports/ui/components/TaskItem/taskitem';
import '/imports/ui/styles/tasklist.css';
import { useDroppable } from '@dnd-kit/core';

const TaskContainer = ({ id, title, tasks, isDone, isLoading, getPriorityClass, getPriorityLabel }) => {
    // Configurar el área donde se pueden soltar elementos
    const { setNodeRef, isOver } = useDroppable({
        id: id
    });
    
    // Determinar clases adicionales basadas en el estado del drag and drop
    const containerClass = `div-container-tasklist-${isDone ? 'done' : 'undone'} ${isOver ? 'drag-over' : ''}`;

    return (
        <div 
            ref={setNodeRef}
            className={containerClass}
        >
            <h2>{title}</h2>
            {isLoading ? (
                <p>Cargando tareas...</p>
            ) : tasks.length === 0 ? (
                <p>No hay tareas {isDone ? 'completadas' : 'pendientes'}</p>
            ) : (
                tasks.map((taskItem, index, array) => (
                    <TaskItem 
                        key={taskItem._id}
                        task={taskItem} 
                        index={index} 
                        isLastItem={index === array.length - 1} 
                        isDone={isDone}
                        getPriorityClass={getPriorityClass}
                        getPriorityLabel={getPriorityLabel}
                    />
                ))
            )}
        </div>
    );
};

// Función estática para renderizar overlay - mantiene encapsulación
TaskContainer.renderTaskOverlay = (task, getPriorityClass, getPriorityLabel) => {
    return (
        <div className="dragging-overlay">
            <TaskItem 
                task={task}
                index={0}
                isLastItem={true}
                isDone={task.done}
                getPriorityClass={getPriorityClass}
                getPriorityLabel={getPriorityLabel}
            />
        </div>
    );
};

export default TaskContainer; 