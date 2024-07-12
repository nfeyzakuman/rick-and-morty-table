import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FilterOptions, exactTextFilter } from './components/filters';
import DefaultColumnFilter from './components/DefaultColumnFilter';
import CharacterDetails from './components/CharacterDetails';
import './App.css'; 

const App = () => {
  const [data, setData] = useState([]);  //data: uygulamanın veri setini temsil eder, basta bos bir dizidir
  const [loading, setLoading] = useState(true); // loading: veri yükleme durumunu temsil eder, basta yükleniyordur 
  const [selectedCharacter, setSelectedCharacter] = useState(null); //selectedCharacter: secili karakteri temsil eder, basta boştur
  const [pageNumberInput, setPageNumberInput] = useState(''); //pageNumberInput: kullanıcının gitmek istedigi sayfa numarasını temsil eder, basta bostur
  const [customPageSize, setCustomPageSize] = useState(''); //customPageSize: ozelleştirilmis sayfa boyutunu temsil eder, basta bostur

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      let allData = []; //allData adlı bos dizi oluşturuldu
      let nextUrl = 'https://rickandmortyapi.com/api/character'; // nextUrl e ilk link verildi

      while (nextUrl) {  //link bos olana kadar allData ya veri yüklemesi yapıldı
        const result = await axios(nextUrl);
        allData = [...allData, ...result.data.results];
        nextUrl = result.data.info.next;
      }

      setData(allData); //data, allData ya set edildi
      setLoading(false); // yükleme islemi bitti 
    };

    fetchAllData();
  }, []);

  const columns = React.useMemo( // kolonlar ve filtreleme secenekleri olusturuldu
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Filter: DefaultColumnFilter,
        filter: 'text',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: ({ column }) => (
          <FilterOptions
            column={column}
            options={['Alive', 'Dead', 'unknown']}
            toggleOption={(value) => {
              column.setFilter(value || undefined);
            }}
          />
        ),
        filter: exactTextFilter,
      },
      {
        Header: 'Species',
        accessor: 'species',
        Filter: ({ column }) => (
          <FilterOptions
            column={column}
            options={['Human', 'Alien', 'Mythological Creature', 'Humanoid', 'Poopybutthole']}
            toggleOption={(value) => {
              column.setFilter(value || undefined);
            }}
          />
        ),
        filter: exactTextFilter,
      },
      {
        Header: 'Gender',
        accessor: 'gender',
        Filter: ({ column }) => (
          <FilterOptions
            column={column}
            options={['Female', 'Male', 'unknown']}
            toggleOption={(value) => {
              column.setFilter(value || undefined);
            }}
          />
        ),
        filter: exactTextFilter,
      },
    ],
    []
  );

  // useTable hook u ile tablo yapısı tanımlandı ve gerekli degerler döndürüldü
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(  
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // baslangıc durumu ilk sayfada 10 sıra gösterimidir
    },
    useFilters,  //tabloda filtreleme, sıralama ve sayfalandırma özellikleri kullanıldı
    useSortBy,
    usePagination
  );


  const handlePageSizeChange = (e) => { //sayfa boyutunu degistiren fonksiyon
    const size = Number(e.target.value);
    if (size > 0) setPageSize(size);
  };

  const handleCustomPageSizeChange = (e) => { //kullanıcının girdigi degere göre sayfa boyutunu degiştiren fonksiyon 
    if (e.key === 'Enter') {
      const size = Number(customPageSize);
      if (size > 0 && size <= data.length) {  // girilen deger 0 ile veri sayısı arasında olmalı (0,data.length]
        setPageSize(size);
        setCustomPageSize('');
      } else {
        alert(`Invalid custom page size. Please enter a number between 1 and ${data.length}.`); // gecersiz girdi uyarısı verir
        setCustomPageSize('');
      }
    }
  };

  const handlePageNumberKeyPress = (e) => { // enter a basılınca istenen sayfaya gitme fonksiyonunu cagırır
    if (e.key === 'Enter') {
      handleGotoPage();
    }
  };

  const handleGotoPage = () => { // gecerli numaralar girilirse istenen sayfaya git, aksi halde uyar
    const page = Number(pageNumberInput) - 1;
    if (page >= 0 && page < pageCount) {
      gotoPage(page);
      setPageNumberInput(''); // inputu temizle
    } else {
      alert(`Invalid page number. Please enter a number between 1 and ${pageCount}.`);
      setPageNumberInput(''); // inputu temizle
    }
  };

  const handleRowClick = (row) => { //tıklanan satırı secili karakter yapar
    if (selectedCharacter && row.original === selectedCharacter) {
      setSelectedCharacter(null); // Eğer zaten seçili olan satıra tekrar tıklanırsa seçimi kaldır
    } else {
      setSelectedCharacter(row.original); // Diğer durumda seçili satırı ayarla
    }
  };

  const noData = page.length === 0; //noData mevcut sayfada veri olup olmadigini kontrol eder

  if (loading) {  // yükleme islemi henüz yapılıyorken kullanıcı bilgilendirilir
    return <div className="container mt-5"><div className="alert alert-info">Loading...</div></div>;
  }

  return ( //React tablosu ve bootstrap kullanılarak dinamik tablo bileseni olusturuldu. 
    <div className="container mt-4">
      {headerGroups.map((headerGroup) => (
        <div className="row mb-3" key={headerGroup.id}>
          {headerGroup.headers.map((column) => (
            <div className="col" key={column.id}>
              <label>{column.render('Header')}</label>
              {column.id === 'name' ? (
                <div className="input-group mb-2">
                  <DefaultColumnFilter column={column} />
                </div>
              ) : (
                <div className="btn-group d-flex mb-2">
                  <button
                    className={`btn ${column.filterValue === '' ? 'active' : ''}`}
                    onClick={() => column.setFilter(undefined)}
                  >
                    Clear
                  </button>
                  {column.render('Filter')}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <table {...getTableProps()} className="table table-striped table-hover">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ⬙' : ' ⬘') : ' ◇'}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row)}
                className={row.original === selectedCharacter ? 'selected-row' : ''}
                style={{ cursor: 'pointer' }}
                key={row.id}
              >
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {noData && <div className="alert alert-warning">No data matches your filters</div>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div class="controls">
          <button className="btn" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button className="btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          <button className="btn" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button className="btn" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <input
          type="number"
          className="form-control"
          placeholder="Go to page"
          style={{ width: '130px', display: 'inline-block', marginLeft: '10px' }}
          value={pageNumberInput}
          onChange={(e) => setPageNumberInput(e.target.value)}
          onKeyDown={handlePageNumberKeyPress}
        />
        <select
          className="form-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{ width: '130px', display: 'inline-block', marginLeft: '10px' }}
        >
          {[10, 250, 500, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="form-control"
          placeholder="Custom size"
          style={{ width: '130px', display: 'inline-block', marginLeft: '10px' }}
          value={customPageSize}
          onChange={(e) => setCustomPageSize(e.target.value)}
          onKeyDown={handleCustomPageSizeChange}
        />
      </div>
      {selectedCharacter && <CharacterDetails character={selectedCharacter} />}
    </div>
  );
};

export default App;



