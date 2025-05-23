import React from 'react';
import { 
    DndContext, 
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    rectIntersection,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';

// Estrategia de detección de colisiones optimizada que mejora la sensibilidad sin sacrificar rendimiento
export const collisionDetectionStrategy = (args) => {
    // Primero intentar con rectIntersection que es eficiente y precisa
    const intersections = rectIntersection(args);
    
    // Si hay intersecciones, devolverlas
    if (intersections.length > 0) {
        return intersections;
    }
    
    // Si no hay intersecciones, usar closestCenter como respaldo
    // pero solo cuando estamos cerca de un elemento
    const center = closestCenter(args);
    
    // Solo devolver si estamos lo suficientemente cerca
    if (center.length > 0) {
        const { active, droppableContainers } = args;
        const activeRect = active.rect.current.translated;
        
        // Solo devolver colisiones cercanas (dentro de 100px de distancia)
        return center.filter(droppable => {
            const droppableId = droppable.id;
            const droppableContainer = droppableContainers.find(container => container.id === droppableId);
            
            if (!droppableContainer) return false;
            
            const droppableRect = droppableContainer.rect.current;
            
            // Calcular distancia entre centros
            const dx = (activeRect.left + activeRect.width / 2) - (droppableRect.left + droppableRect.width / 2);
            const dy = (activeRect.top + activeRect.height / 2) - (droppableRect.top + droppableRect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Solo considerar colisiones dentro de una distancia razonable
            return distance < 100; // 100px de distancia máxima
        });
    }
    
    return [];
};

// Hook para configurar sensores de arrastre
export const useDragSensors = () => {
    return useSensors(
        useSensor(PointerSensor, {
            // Reducir la distancia para mejor detección
            activationConstraint: { distance: 5 },
            // Ghost image simple
            dragInitializer: {
                onDragStart(event) {
                    // Usar una imagen vacía pequeña es más eficiente
                    const emptyImage = new Image();
                    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    event.dataTransfer.setDragImage(emptyImage, 0, 0);
                },
            }
        }),
        useSensor(KeyboardSensor)
    );
};

// Función para animar cambios de layout
export const animateLayoutChanges = (args) => {
    const { isSorting, wasSorting, draggedElement, transition, node } = args;
    
    // Añadir clase de transición personalizada
    if (node) {
        // Si es el elemento que se está arrastrando, no animar
        if (draggedElement === node) {
            return false;
        }
        
        // Si estamos ordenando, aplicar clase específica de reordenamiento
        if (isSorting || wasSorting) {
            requestAnimationFrame(() => {
                node.classList.add('task-reordering');
                
                // Eliminar la clase después de que termine la transición
                setTimeout(() => {
                    node.classList.remove('task-reordering');
                }, 150);
            });
        }
    }
    
    // Ajustar la duración de la transición para que sea más corta
    if (transition) {
        transition.duration = 120; // ms
    }
    
    // Permitir las animaciones más ligeras para mejor rendimiento
    return true;
};

// Componente principal de contexto de arrastre
const DragDropContext = ({ 
    children, 
    onDragStart, 
    onDragOver, 
    onDragEnd, 
    activeId, 
    renderDragOverlay 
}) => {
    // Usar los sensores predefinidos
    const sensors = useDragSensors();
    
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            measuring={{
                droppable: {
                    strategy: 'rects'
                }
            }}
        >
            {children}
            
            <DragOverlay 
                wrapperElement="div" 
                className="drag-overlay-wrapper" 
                dropAnimation={{
                    duration: 120,
                    easing: 'ease-out',
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: { active: { opacity: '0.4' } }
                    })
                }}
            >
                {activeId && renderDragOverlay ? renderDragOverlay() : null}
            </DragOverlay>
        </DndContext>
    );
};

export default DragDropContext; 