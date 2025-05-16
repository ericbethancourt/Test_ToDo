import React from 'react';



export const FormTask = () => {
    const myDB = client.db("db staging");
    const myColl = myDB.collection("todo_list");

    const handleSubmit = (e) => {
        e.preventDefault();
        const task = document.getElementById("task").value;
        const taskinsert = { name: task, done: false };
        const insert = await 
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