import React from 'react';
import TaskContainer from '/imports/ui/components/TaskContainer/taskcontainer';

const DragOverlay = ({ activeTask, getPriorityClass, getPriorityLabel }) => {
    if (!activeTask) return null;
    
    // Usar la función estática de TaskContainer para mantener encapsulación
    return TaskContainer.renderTaskOverlay(
        activeTask, 
        getPriorityClass, 
        getPriorityLabel
    );
};

export default DragOverlay; 