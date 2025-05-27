import React from 'react';
import '/imports/ui/styles/tasklist.css';
import { PRIORITY_LEVELS, PRIORITY_CLASSES, PRIORITY_LABELS } from '/imports/ui/utils/constants';
import { useTaskList } from './hooks/useTaskList';
import TaskListControls from './TaskListControls/tasklistcontrols';
import TaskListContainer from './TaskListContainer/tasklistcontainer';

const TaskList = () => {
    // Usar el hook personalizado para toda la lógica
    const {
        activeId,
        activeTask,
        isLoading,
        filteredTaskUndone,
        filteredTaskDone,
        undoneIds,
        doneIds,
        individualFilter,
        groupFilter,
        setIndividualFilter,
        setGroupFilter,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    } = useTaskList();
    
    // Funciones de utilidad para prioridades
    const getPriorityClass = (priority) => PRIORITY_CLASSES[priority] || PRIORITY_CLASSES[PRIORITY_LEVELS.NORMAL];
    const getPriorityLabel = (priority) => PRIORITY_LABELS[priority] || PRIORITY_LABELS[PRIORITY_LEVELS.NORMAL];
    
    return (
        <>            
            <TaskListControls 
                individualFilter={individualFilter}
                setIndividualFilter={setIndividualFilter}
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
            />

            <TaskListContainer 
                activeId={activeId}
                activeTask={activeTask}
                isLoading={isLoading}
                filteredTaskUndone={filteredTaskUndone}
                filteredTaskDone={filteredTaskDone}
                undoneIds={undoneIds}
                doneIds={doneIds}
                getPriorityClass={getPriorityClass}
                getPriorityLabel={getPriorityLabel}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
            />
        </>
    );
};

export default TaskList; 