import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '/imports/ui/styles/form.css';


export default FormTask = () => {
    const [message, setMessage] = useState("");

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const task_input = document.getElementById("task").value;
        const taskinsert = { name_task: task_input, done: false };
        try {
           document.getElementById("task").value = "";
           Meteor.call("task.insert", taskinsert, (error, result) =>{
            if (error) {
                setMessage("Hubo un error al insertar la tarea");
            } else {
                setMessage("Tarea insertada correctamente");
            }
           });
        }
        catch (error) {
            console.error("Error al insertar la tarea:", error);
        }

        setTimeout(() => {
            setMessage("");
        }, 3000);
        
    }

    return (
        <>
        <div className="div-container-form">
            <h1>Formulario de tarea</h1>
            <p className="form-subtitle">Agrega una tarea: </p>
            <form className="form-container" onSubmit={handleSubmit}>
                <input className="form-input" type="text" id="task" placeholder="escribe tu tarea"></input>
                <button className="form-button" type="submit">Agregar</button>
            </form>
            <div>
                {message && (
                    <p>{message}</p>
                )}
            </div>
        </div>
        
        </>
    )
}