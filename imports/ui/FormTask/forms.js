import React from 'react';



export const FormTask = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const task = document.getElementById("task").value;
        console.log(task);
    }
    return (
        <div>
            <h1>Formulario de tarea</h1>

            <p>Agrega una tarea</p>
            <form onClick={handleSubmit}>
                <input type="text" id="task" placeholder="escribe tu tarea"></input>
                <button type="submit" >Agregar</button>
            </form>
        </div>
    )
}