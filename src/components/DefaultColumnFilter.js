import React from 'react';

//tablo icin input alan,  varsayılan filtreleme bileşeni oluşturuldu
//parametre olarak column prop u alındı ve mevcut filtre değeri(filterValue) ve setFilter destructuring edildi
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      className="form-control"
      value={filterValue || ''}  //mevcut bir değer varsa Value o olsun yoksa boş olsun
      onChange={(e) => {
        setFilter(e.target.value || undefined); //yeni degerler kabul edildi
      }}
      placeholder="Search..."
    />
  );
};

export default DefaultColumnFilter;
