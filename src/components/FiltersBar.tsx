import React from 'react';

interface FiltersBarProps {
  search: string;
  setSearch: (val: string) => void;
  availableFilters: Record<string, string[]>;
  activeFilters: Record<string, string>;
  setActiveFilter: (field: string, value: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ 
  search, 
  setSearch, 
  availableFilters, 
  activeFilters, 
  setActiveFilter 
}) => {
  return (
    <div className="filters-bar">
      <div className="search-wrapper">
        <svg style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          className="input-field"
          style={{paddingLeft: '2.5rem'}}
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {Object.entries(availableFilters).map(([field, options]) => (
        <select
          key={field}
          className="filter-select"
          value={activeFilters[field] || ''}
          onChange={(e) => setActiveFilter(field, e.target.value)}
        >
          <option value="">All {field.charAt(0).toUpperCase() + field.slice(1)}s</option>
          {options.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FiltersBar;
