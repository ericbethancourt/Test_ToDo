import React from 'react';
import { PRIORITY_LEVELS, PRIORITY_LABELS } from '/imports/ui/utils/constants';
import '/imports/ui/styles/filters.css';

const TaskFilters = ({ 
    individualFilter, 
    setIndividualFilter, 
    groupFilter, 
    setGroupFilter 
}) => {
    
    const handleIndividualFilterChange = (e) => {
        setIndividualFilter(e.target.value);
    };

    const handleGroupFilterChange = (e) => {
        setGroupFilter(e.target.value);
    };

    return (
        <div className="filters-container">
            <div className="filter-group">
                <label htmlFor="individual-filter" className="filter-label-ind">
                    Filtrar por:
                </label>
                <select 
                    id="individual-filter"
                    value={individualFilter} 
                    onChange={handleIndividualFilterChange}
                    className="filter-select"
                >
                    <option value="">Todas las prioridades</option>
                    <option value={PRIORITY_LEVELS.VERY_URGENT}>
                        {PRIORITY_LABELS[PRIORITY_LEVELS.VERY_URGENT]}
                    </option>
                    <option value={PRIORITY_LEVELS.URGENT}>
                        {PRIORITY_LABELS[PRIORITY_LEVELS.URGENT]}
                    </option>
                    <option value={PRIORITY_LEVELS.NORMAL}>
                        {PRIORITY_LABELS[PRIORITY_LEVELS.NORMAL]}
                    </option>
                    <option value={PRIORITY_LEVELS.LOW}>
                        {PRIORITY_LABELS[PRIORITY_LEVELS.LOW]}
                    </option>
                    <option value={PRIORITY_LEVELS.NOT_URGENT}>
                        {PRIORITY_LABELS[PRIORITY_LEVELS.NOT_URGENT]}
                    </option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="group-filter" className="filter-label-gr">
                    Ordenar por:
                </label>
                <select 
                    id="group-filter"
                    value={groupFilter} 
                    onChange={handleGroupFilterChange}
                    className="filter-select"
                >
                    <option value="">Sin ordenar</option>
                    <option value="high-to-low">Muy urgente a menos urgente</option>
                    <option value="low-to-high">Menos urgente a muy urgente</option>
                </select>
            </div>
        </div>
    );
};

export default TaskFilters; 