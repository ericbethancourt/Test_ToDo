import React from 'react';
import TaskList from '/imports/ui/components/TaskList/tasklist';

export const Home = () => {
    return (
        <>
        <h2 className="h2-title">Lista de tareas</h2>
        <TaskList />
        </>
    )
}