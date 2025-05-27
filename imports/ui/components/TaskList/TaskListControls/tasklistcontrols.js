import React from 'react';
import FormTask from '/imports/ui/components/FormTask/formtask';
import TaskFilters from '/imports/ui/components/TaskFilters/TaskFilters';

const TaskListControls = ({ 
    individualFilter, 
    setIndividualFilter, 
    groupFilter, 
    setGroupFilter 
}) => {
    return (
        <div className="controls-container">
            <FormTask />
            <TaskFilters 
                individualFilter={individualFilter}
                setIndividualFilter={setIndividualFilter}
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
            />
        </div>
    );
};

export default TaskListControls; 