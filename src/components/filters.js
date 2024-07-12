import React from 'react';

// FilterOptions: Filtrelemek için seçenekler mevcut olduğunda kullanılacak olan fonksiyonel bileşen 
// opsiyonlar butonlar halinde gözükür
const FilterOptions = ({ column, options, toggleOption }) => {
  const handleButtonClick = (option) => {
    let newFilterValue;
    if (column.filterValue && column.filterValue.includes(option)) {
      newFilterValue = column.filterValue.filter(item => item !== option);
    } else {
      newFilterValue = column.filterValue ? [...column.filterValue, option] : [option];
    }
    toggleOption(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="btn-group" role="group" aria-label={column.Header}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`btn ${column.filterValue && column.filterValue.includes(option) ? 'active' : 'nonactive'}`}
          onClick={() => handleButtonClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

// Tam text eşleştirir
function exactTextFilter(rows, id, filterValue) {
  if (!filterValue || filterValue.length === 0) {
    return rows;
  }
  return rows.filter(row => filterValue.includes(row.values[id]));
}

export { FilterOptions, exactTextFilter };
