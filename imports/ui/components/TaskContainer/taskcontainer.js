import React from 'react';
import TaskItem from '/imports/ui/components/TaskItem/taskitem';
import '/imports/ui/styles/tasklist.css';

const TaskContainer = ({ title, tasks, isDone, isLoading, handleDragOver, handleDragLeave, handleDrop, handleDragStart, handleDragEnd, getPriorityClass, getPriorityLabel }) => (
    <div 
        className={`div-container-tasklist-${isDone ? 'done' : 'undone'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, isDone)}
    >
        <h2 className={isDone ? '' : 'h2-task-undone'}>{title}</h2>
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
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    getPriorityClass={getPriorityClass}
                    getPriorityLabel={getPriorityLabel}
                />
            ))
        )}
    </div>
);

export default TaskContainer; 