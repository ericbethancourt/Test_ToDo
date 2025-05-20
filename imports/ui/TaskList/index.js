import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import '/imports/ui/styles/tasklist.css';
import Swal from 'sweetalert2';
import { FaTrash, FaCheck, FaBars } from 'react-icons/fa';
import TaskContainer from '/imports/ui/components/TaskContainer/taskcontainer';
import TaskItem from '/imports/ui/components/TaskItem/taskitem';
import { PRIORITY_LEVELS, PRIORITY_VALUES, PRIORITY_CLASSES, PRIORITY_LABELS } from '/imports/ui/utils/constants';

const TaskList = () => {
    const getPriorityValue = (priority) => PRIORITY_VALUES[priority] || PRIORITY_VALUES[PRIORITY_LEVELS.NORMAL];
    const getPriorityClass = (priority) => PRIORITY_CLASSES[priority] || PRIORITY_CLASSES[PRIORITY_LEVELS.NORMAL];
    const getPriorityLabel = (priority) => PRIORITY_LABELS[priority] || PRIORITY_LABELS[PRIORITY_LEVELS.NORMAL];

    const { taskUndone, taskDone, isLoading } = useTracker(() => {
        const subUndone = Meteor.subscribe('task.undone');
        const subDone = Meteor.subscribe('task.done');

        const isLoading = !subUndone.ready() || !subDone.ready();
        
        const sortByPriority = (a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority);
        
        const undoneItems = task.find({done: false}).fetch().sort(sortByPriority);
        const doneItems = task.find({done: true}).fetch().sort(sortByPriority);
        
        return {
            taskUndone: undoneItems,
            taskDone: doneItems,
            isLoading
        };
    });
    
    const handleDragStart = (e, taskItem) => {
        e.dataTransfer.setData('taskId', taskItem._id);
        e.currentTarget.classList.add('dragging');
    };
    
    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('dragging');
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };
    
    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };
    
    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            Meteor.call("task.update", taskId, newStatus);
        }
    };
    
    return (     
        <>
            <h2 className="h2-title">Lista de tareas</h2>
            <div className="div-container-tasklist">
                <TaskContainer 
                    title="Tareas pendientes" 
                    tasks={taskUndone} 
                    isDone={false}
                    isLoading={isLoading}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDrop}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    getPriorityClass={getPriorityClass}
                    getPriorityLabel={getPriorityLabel}
                />
                <TaskContainer 
                    title="Tareas completadas" 
                    tasks={taskDone} 
                    isDone={true}
                    isLoading={isLoading}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDrop}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    getPriorityClass={getPriorityClass}
                    getPriorityLabel={getPriorityLabel}
                />
            </div>
        </>
    );
};

export default TaskList;