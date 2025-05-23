import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import '/imports/ui/styles/tasklist.css';
import TaskContainer from '/imports/ui/components/TaskContainer/taskcontainer';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Importar componentes y funciones reutilizables
import DragDropContext, { animateLayoutChanges } from '/imports/ui/components/DragDropContext/DragDropContext';
import { 
    updateTaskStatus, 
    reorderTasks, 
    generateNewTaskLists 
} from '/imports/ui/components/TaskOperations/TaskOperations';
import { PRIORITY_LEVELS, PRIORITY_CLASSES, PRIORITY_LABELS, formatDate } from '/imports/ui/utils/constants';

const TaskList = () => {
    const [activeId, setActiveId] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    // Estados locales para las tareas
    const [localTaskUndone, setLocalTaskUndone] = useState([]);
    const [localTaskDone, setLocalTaskDone] = useState([]);
    
    // Referencia para controlar la inicialización
    const isInitialMount = useRef(true);
    const lastTaskUndoneIds = useRef([]);
    const lastTaskDoneIds = useRef([]);
    
    // Funciones de utilidad para prioridades
    const getPriorityClass = (priority) => PRIORITY_CLASSES[priority] || PRIORITY_CLASSES[PRIORITY_LEVELS.NORMAL];
    const getPriorityLabel = (priority) => PRIORITY_LABELS[priority] || PRIORITY_LABELS[PRIORITY_LEVELS.NORMAL];

    // Obtener datos de tareas de la base de datos
    const { taskUndone, taskDone, isLoading } = useTracker(() => {
        const subUndone = Meteor.subscribe('task.undone');
        const subDone = Meteor.subscribe('task.done');

        const isLoading = !subUndone.ready() || !subDone.ready();
        
        // Obtener las tareas ordenadas por posición
        const undoneItems = task.find({done: false}, {sort: {position: 1}}).fetch();
        const doneItems = task.find({done: true}, {sort: {position: 1}}).fetch();
        
        return {
            taskUndone: undoneItems,
            taskDone: doneItems,
            isLoading
        };
    });
    
    // Actualizar los estados locales cuando cambian los datos de la base de datos
    useEffect(() => {
        // Si estamos cargando, no hacer nada
        if (isLoading) return;
        
        // Primera carga: inicializar el estado local
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setLocalTaskUndone(taskUndone);
            setLocalTaskDone(taskDone);
            
            // Guardar los IDs actuales
            lastTaskUndoneIds.current = taskUndone.map(t => t._id);
            lastTaskDoneIds.current = taskDone.map(t => t._id);
            return;
        }
        
        // Para actualizaciones posteriores, verificar si realmente hay cambios
        // en la estructura de los datos desde la base de datos
        const currentUndoneIds = taskUndone.map(t => t._id);
        const currentDoneIds = taskDone.map(t => t._id);
        
        // Verificar si los IDs han cambiado (adiciones/eliminaciones)
        const undoneIdsChanged = JSON.stringify(currentUndoneIds) !== JSON.stringify(lastTaskUndoneIds.current);
        const doneIdsChanged = JSON.stringify(currentDoneIds) !== JSON.stringify(lastTaskDoneIds.current);
        
        // Actualizar solo si hay cambios en la estructura
        if (undoneIdsChanged) {
            setLocalTaskUndone(taskUndone);
            lastTaskUndoneIds.current = currentUndoneIds;
        }
        
        if (doneIdsChanged) {
            setLocalTaskDone(taskDone);
            lastTaskDoneIds.current = currentDoneIds;
        }
    }, [taskUndone, taskDone, isLoading]);
    
    // Crear arrays de IDs para usar con SortableContext
    const undoneIds = localTaskUndone.map(item => item._id);
    const doneIds = localTaskDone.map(item => item._id);
    
    // Función que se ejecuta cuando comienza el arrastre
    const handleDragStart = (event) => {
        const { active } = event;
        const taskId = active.id;
        
        // Encontrar la tarea en los arrays de tareas locales
        const foundTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === taskId);
        
        if (foundTask) {
            setActiveId(taskId);
            setActiveTask(foundTask);
        }
    };
    
    // Función optimizada para el arrastre
    const handleDragOver = (event) => {
        // Solo actualizar si es necesario para evitar re-renderizaciones
        const { active, over } = event;
        
        if (!over || over.id === 'container-done' || over.id === 'container-undone') {
            return;
        }
        
        // Implementar actualización en tiempo real para mejor feedback visual
        const activeId = active.id;
        const overId = over.id;
        
        const activeTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === activeId);
        const overTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === overId);
        
        if (activeTask && overTask && activeTask.done === overTask.done) {
            // Actualizar solo si están en el mismo contenedor
            const tasks = activeTask.done ? [...localTaskDone] : [...localTaskUndone];
            
            const activeIndex = tasks.findIndex(t => t._id === activeId);
            const overIndex = tasks.findIndex(t => t._id === overId);
            
            if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                const newTasks = arrayMove(tasks, activeIndex, overIndex);
                
                if (activeTask.done) {
                    setLocalTaskDone(newTasks);
                } else {
                    setLocalTaskUndone(newTasks);
                }
            }
        }
    };
    
    // Función que se ejecuta cuando termina el arrastre
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        // Limpiar el estado
        setActiveId(null);
        setActiveTask(null);
        
        // Si no hay un objetivo válido, no hacer nada
        if (!over) return;
        
        const taskId = active.id;
        const targetId = over.id;
        
        // Si se suelta sobre un contenedor, cambiar el estado de la tarea
        if (targetId === 'container-done' || targetId === 'container-undone') {
            const newStatus = targetId === 'container-done';
            const currentTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === taskId);
            
            // Solo actualizar si realmente cambió el estado
            if (currentTask && currentTask.done !== newStatus) {
                // 1. Actualizar primero localmente
                const updatedTask = { ...currentTask, done: newStatus };
                
                // Eliminar la tarea del contenedor actual y añadirla al nuevo
                if (newStatus) {
                    // La tarea se mueve a "completadas"
                    const newUndone = localTaskUndone.filter(t => t._id !== taskId);
                    const newDone = [...localTaskDone, updatedTask]; // Añadir al final por defecto
                    
                    // Actualizar estados locales inmediatamente
                    setLocalTaskUndone(newUndone);
                    setLocalTaskDone(newDone);
                    
                    // 2. Enviar la actualización a la base de datos
                    updateTaskStatus(
                        taskId, 
                        newStatus, 
                        // En caso de éxito
                        () => {
                            // Sincronizar el orden con la base de datos
                            const newUndoneIds = newUndone.map(t => t._id);
                            const newDoneIds = newDone.map(t => t._id);
                            
                            reorderTasks(newUndoneIds, "undone");
                            reorderTasks(newDoneIds, "done");
                        },
                        // En caso de error
                        () => {
                            // Revertir cambios en caso de error
                            setLocalTaskUndone(localTaskUndone);
                            setLocalTaskDone(localTaskDone);
                        }
                    );
                } else {
                    // La tarea se mueve a "pendientes"
                    const newDone = localTaskDone.filter(t => t._id !== taskId);
                    const newUndone = [...localTaskUndone, updatedTask]; // Añadir al final por defecto
                    
                    // Actualizar estados locales inmediatamente
                    setLocalTaskDone(newDone);
                    setLocalTaskUndone(newUndone);
                    
                    // 2. Enviar la actualización a la base de datos
                    updateTaskStatus(
                        taskId, 
                        newStatus, 
                        // En caso de éxito
                        () => {
                            // Sincronizar el orden con la base de datos
                            const newUndoneIds = newUndone.map(t => t._id);
                            const newDoneIds = newDone.map(t => t._id);
                            
                            reorderTasks(newUndoneIds, "undone");
                            reorderTasks(newDoneIds, "done");
                        },
                        // En caso de error
                        () => {
                            // Revertir cambios en caso de error
                            setLocalTaskUndone(localTaskUndone);
                            setLocalTaskDone(localTaskDone);
                        }
                    );
                }
            }
            return;
        }
        
        // Si se suelta sobre otra tarea, reordenar
        const activeTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === taskId);
        const overTask = [...localTaskUndone, ...localTaskDone].find(t => t._id === targetId);
        
        if (activeTask && overTask) {
            // Usar la función de utilidad para generar las nuevas listas de tareas
            const { undone, done } = generateNewTaskLists(
                activeTask, 
                overTask, 
                localTaskUndone, 
                localTaskDone
            );
            
            // Actualizar estados locales inmediatamente
            setLocalTaskUndone(undone);
            setLocalTaskDone(done);
            
            // Si tienen el mismo estado, solo reordenar
            if (activeTask.done === overTask.done) {
                // Actualizar orden en la base de datos
                const listIds = activeTask.done ? done.map(t => t._id) : undone.map(t => t._id);
                const listType = activeTask.done ? "done" : "undone";
                
                reorderTasks(listIds, listType);
            } else {
                // Si cambian de estado, actualizar tanto el estado como el orden
                updateTaskStatus(
                    taskId, 
                    overTask.done, 
                    // En caso de éxito, actualizar orden
                    () => {
                        // Actualizar orden en ambas listas
                        reorderTasks(undone.map(t => t._id), "undone");
                        reorderTasks(done.map(t => t._id), "done");
                    },
                    // En caso de error, revertir cambios
                    () => {
                        setLocalTaskUndone(localTaskUndone);
                        setLocalTaskDone(localTaskDone);
                    }
                );
            }
        }
    };
    
    // Renderizar un overlay para la tarea durante el arrastre
    const renderDragOverlay = () => {
        if (!activeTask) return null;
        
        // Usar la función estática de TaskContainer para mantener encapsulación
        return TaskContainer.renderTaskOverlay(
            activeTask, 
            getPriorityClass, 
            getPriorityLabel
        );
    };
    
    return (
        <>
            <h2 className="h2-title">Lista de tareas</h2>
            <DragDropContext
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                activeId={activeId}
                renderDragOverlay={renderDragOverlay}
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
                            tasks={localTaskUndone} 
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
                            tasks={localTaskDone} 
                            isDone={true}
                            isLoading={isLoading}
                            getPriorityClass={getPriorityClass}
                            getPriorityLabel={getPriorityLabel}
                        />
                    </SortableContext>
                </div>
            </DragDropContext>
        </>
    );
};

export default TaskList;