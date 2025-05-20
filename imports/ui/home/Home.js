import React from 'react';
import TaskList from '/imports/ui/TaskList/index';
import FormTask from '/imports/ui/FormTask/index';


export const Home = () => {
    return (
        <>
        <FormTask />
        <TaskList />
        </>
       
    )
}