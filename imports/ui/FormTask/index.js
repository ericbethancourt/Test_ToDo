import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export const FormTask = () => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const task_input = document.getElementById("task").value;
        const taskinsert = { name_task: task_input, done: false };
        try {
            Meteor.call("task.insert", taskinsert);
            console.log("parece que si funco")
        }
        catch (error) {
            console.error("Error al insertar la tarea:", error);
        }
        
    }

    return (
        <div>
            <h1>Formulario de tarea</h1>
            <p>Agrega una tarea</p>
            <form onSubmit={handleSubmit}>
                <input type="text" id="task" placeholder="escribe tu tarea"></input>
                <button type="submit" >Agregar</button>
            </form>
            <div>
                <Link to="/list">Ver Productos</Link>
            </div>
        </div>
    )
}