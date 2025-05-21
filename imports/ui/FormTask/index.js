import React, { useState } from 'react';
import '/imports/ui/styles/form.css';
import { createTask } from '/imports/ui/components/TaskOperations/TaskOperations';

const FormTask = () => {
    const [priority, setPriority] = useState("normal");

    const handleSubmit = (e) => {
        e.preventDefault();
        const task_input = document.getElementById("task").value;

        const taskData = { 
            name_task: task_input, 
            done: false,
            priority: priority 
        };
        
        createTask(
            taskData, 
            // Callback de éxito
            () => {
                document.getElementById("task").value = "";
                setPriority("normal");
            }
        );
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    return (
        <div className="div-container-form">
            <h1>TaskList</h1>
            <p className="form-subtitle">Agrega una tarea: </p>
            <form className="form-container" onSubmit={handleSubmit}>
                <input 
                    className="form-input" 
                    type="text" 
                    id="task" 
                    placeholder="Escribe tu tarea"
                />
                <button 
                    className="form-button" 
                    type="submit"
                >
                    Agregar
                </button>
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
    );
};

export default FormTask;