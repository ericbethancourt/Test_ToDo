import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskContainer from '/imports/ui/components/TaskContainer/taskcontainer';
import DragDropContext, { animateLayoutChanges } from '/imports/ui/components/DragDropContext/DragDropContext';
import DragOverlay from '../DragOverlay/dragoverlay';

const TaskListContainer = ({
    activeId,
    activeTask,
    isLoading,
    filteredTaskUndone,
    filteredTaskDone,
    undoneIds,
    doneIds,
    getPriorityClass,
    getPriorityLabel,
    handleDragStart,
    handleDragOver,
    handleDragEnd
}) => {
    return (
        <DragDropContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            activeId={activeId}
            renderDragOverlay={() => (
                <DragOverlay 
                    activeTask={activeTask}
                    getPriorityClass={getPriorityClass}
                    getPriorityLabel={getPriorityLabel}
                />
            )}
        >
            <div className="div-container-tasklist">
                <SortableContext 
                    items={undoneIds}
                    strategy={verticalListSortingStrategy}
                    animateLayoutChanges={animateLayoutChanges}
                >
                    <TaskContainer 
                        id="container-undone"
                        title="Tareas pendientes" 
                        tasks={filteredTaskUndone} 
                        isDone={false}
                        isLoading={isLoading}
                        getPriorityClass={getPriorityClass}
                        getPriorityLabel={getPriorityLabel}
                    />
                </SortableContext>
                
                <SortableContext 
                    items={doneIds}
                    strategy={verticalListSortingStrategy}
                    animateLayoutChanges={animateLayoutChanges}
                >
                    <TaskContainer 
                        id="container-done"
                        title="Tareas completadas" 
                        tasks={filteredTaskDone} 
                        isDone={true}
                        isLoading={isLoading}
                        getPriorityClass={getPriorityClass}
                        getPriorityLabel={getPriorityLabel}
                    />
                </SortableContext>
            </div>
        </DragDropContext>
    );
};

export default TaskListContainer; 