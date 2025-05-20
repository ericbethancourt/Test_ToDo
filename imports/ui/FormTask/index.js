import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useState } from 'react';
import '/imports/ui/styles/form.css';
import Swal from 'sweetalert2';


export default FormTask = () => {
    const [priority, setPriority] = useState("normal");

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const task_input = document.getElementById("task").value;

        if (task_input.trim() === "") {
            Swal.fire({
                toast: true,
                position: 'bottom',
                icon: 'question',
                title: 'Oops...',
                text: 'La tarea no puede estar vacía',
                showConfirmButton: false,
                timer: 2500,
            });
            return;
        }

        const taskinsert = { 
            name_task: task_input, 
            done: false,
            priority: priority 
        };
        
        try {
           document.getElementById("task").value = "";
           setPriority("normal");
           Meteor.call("task.insert", taskinsert, (error, result) =>{
            if (error) {
                Swal.fire({
                    toast: true,
                    position: 'bottom',
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error al insertar la tarea',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: 'bottom',
                    icon: 'success',
                    title: 'Tarea insertada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
           });
        }
        catch (error) {
            console.error("Error al insertar la tarea:", error);
        }
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    }

    return (
        <>
        <div className="div-container-form">
            <h1>TaskList</h1>
            <p className="form-subtitle">Agrega una tarea: </p>
            <form className="form-container" onSubmit={handleSubmit}>
                <input className="form-input" type="text" id="task" placeholder="Escribe tu tarea"></input>
                <button className="form-button" type="submit">Agregar</button>
                    <div className="priority-selector">
                    <label htmlFor="priority">Prioridad:</label>
                    <select 
                        id="priority" 
                        value={priority} 
                        onChange={handlePriorityChange}
                        className="priority-select"
                    >
                        <option value="muy-urgente">Muy urgente</option>
                        <option value="urgente">Urgente</option>
                        <option value="normal">Normal</option>
                        <option value="baja">Baja</option>
                        <option value="no-urgente">No urgente</option>
                    </select>
                </div>
               
            </form>
        </div>
        
        </>
    )
}