import React from 'react';
import Swal from 'sweetalert2';
import '/imports/ui/styles/form.css';
import { createTask } from '/imports/ui/components/TaskOperations/TaskOperations';

const FormTask = () => {
    const handleAddTaskClick = () => {
        Swal.fire({
            title: 'Agregar Nueva Tarea',
            customClass: {
                popup: 'swal-popup-rounded',
                title: 'swal-title-styled'
            },
            allowOutsideClick: false,
            allowEscapeKey: true,
            html: `
                <div style="text-align: left;">
                    <label for="swal-input-name" 
                           style="display: block; font-weight: bold; font-size:16px; margin-bottom:5px">
                        Nombre de la tarea:
                    </label>
                    <input id="swal-input-name" 
                           class="swal2-input-n" 
                           placeholder="Escribe el nombre de la tarea"
                           style="margin-bottom: 15px;">
                    
                    <label for="swal-input-description" 
                           style="display: block; font-weight: bold; font-size:16px; margin-bottom:5px">
                        Descripción:
                    </label>
                    <textarea id="swal-input-description" 
                              class="swal2-textarea-desc" 
                              placeholder="Describe la tarea (opcional)"
                              rows="3"
                              style="width: 100%; padding: 8px; border: none; border-bottom: 1.5px solid #0e56d9; 
                                     outline: none; border-radius: 5px; font-family: system-ui; font-size: 14px;
                                     resize: vertical; margin-bottom: 15px;"></textarea>
                    
                    <label for="swal-input-priority" 
                           style="display: block; margin-bottom: 5px; font-weight: bold; font-size:16px;">
                        Prioridad:
                    </label>
                    <select id="swal-input-priority" class="swal2-input-p">
                        <option value="muy-urgente">Muy urgente</option>
                        <option value="urgente">Urgente</option>
                        <option value="normal" selected>Normal</option>
                        <option value="baja">Baja</option>
                        <option value="no-urgente">No urgente</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Agregar Tarea',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const description = document.getElementById('swal-input-description').value;
                const priority = document.getElementById('swal-input-priority').value;
                
                if (!name.trim()) {
                    Swal.showValidationMessage('El nombre de la tarea no puede estar vacío');
                    return false;
                }
                
                return { 
                    name: name.trim(), 
                    description: description.trim(), 
                    priority: priority 
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { name, description, priority } = result.value;
                
                const taskData = { 
                    name_task: name, 
                    description: description,
                    done: false,
                    priority: priority 
                };
                
                createTask(taskData);
            }
        });
    };

    return (
        <div className="div-container-form">
            <h1>TaskList</h1>
            <div className="add-task-container">
                <button 
                    className="add-task-button" 
                    onClick={handleAddTaskClick}
                >
                    Agregar Tarea
                </button>
            </div>
        </div>
    );
};

export default FormTask; 