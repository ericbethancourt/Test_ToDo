import { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import { arrayMove } from '@dnd-kit/sortable';
import { 
    updateTaskStatus, 
    reorderTasks, 
    generateNewTaskLists 
} from '/imports/ui/components/TaskOperations/TaskOperations';
import { applyTaskFilters } from '/imports/ui/utils/taskFilters';

export const useTaskList = () => {
    const [activeId, setActiveId] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    // Estados locales para las tareas
    const [localTaskUndone, setLocalTaskUndone] = useState([]);
    const [localTaskDone, setLocalTaskDone] = useState([]);
    
    // Estados para los filtros
    const [individualFilter, setIndividualFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    
    // Referencia para controlar la inicialización
    const isInitialMount = useRef(true);
    const lastTaskUndoneIds = useRef([]);
    const lastTaskDoneIds = useRef([]);

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
        // Si estamos cargando o hay una operación de arrastre activa, no hacer nada
        if (isLoading || activeId) return;

        // Primera carga: inicializar el estado local
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setLocalTaskUndone(taskUndone);
            setLocalTaskDone(taskDone);
            lastTaskUndoneIds.current = taskUndone.map(t => t._id);
            lastTaskDoneIds.current = taskDone.map(t => t._id);
            return;
        }

        // Para actualizaciones posteriores, verificar si realmente hay cambios
        const currentUndoneIds = taskUndone.map(t => t._id);
        const currentDoneIds = taskDone.map(t => t._id);

        const undoneIdsChanged = JSON.stringify(currentUndoneIds) !== JSON.stringify(lastTaskUndoneIds.current);
        const doneIdsChanged = JSON.stringify(currentDoneIds) !== JSON.stringify(lastTaskDoneIds.current);

        // Comprobar si el contenido de alguna tarea ha cambiado
        // Esto es crucial para detectar ediciones
        const hasContentChanged = (localTasks, dbTasks) => {
            if (localTasks.length !== dbTasks.length) return true; // si hay adiciones/eliminaciones
            return dbTasks.some(dbTask => {
                const localTask = localTasks.find(lt => lt._id === dbTask._id);
                // Si la tarea no existe localmente (improbable si los IDs no cambiaron) o si su contenido es diferente
                return !localTask || JSON.stringify(localTask) !== JSON.stringify(dbTask);
            });
        };

        const undoneContentChanged = hasContentChanged(localTaskUndone, taskUndone);
        const doneContentChanged = hasContentChanged(localTaskDone, taskDone);

        if (undoneIdsChanged || undoneContentChanged) {
            setLocalTaskUndone(taskUndone);
            lastTaskUndoneIds.current = currentUndoneIds;
        }

        if (doneIdsChanged || doneContentChanged) {
            setLocalTaskDone(taskDone);
            lastTaskDoneIds.current = currentDoneIds;
        }
    }, [taskUndone, taskDone, isLoading, activeId, localTaskUndone, localTaskDone]);
    
    // Aplicar filtros a las tareas
    const filteredTaskUndone = applyTaskFilters(localTaskUndone, individualFilter, groupFilter);
    const filteredTaskDone = applyTaskFilters(localTaskDone, individualFilter, groupFilter);
    
    // Crear arrays de IDs para usar con SortableContext
    const undoneIds = filteredTaskUndone.map(item => item._id);
    const doneIds = filteredTaskDone.map(item => item._id);
    
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

    return {
        // Estados
        activeId,
        activeTask,
        isLoading,
        filteredTaskUndone,
        filteredTaskDone,
        undoneIds,
        doneIds,
        individualFilter,
        groupFilter,
        
        // Setters para filtros
        setIndividualFilter,
        setGroupFilter,
        
        // Handlers de drag & drop
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
}; 