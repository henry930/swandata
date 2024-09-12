import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import data from './assets/data/bets_placed.json';

type Person = {
    bid: number;
    selection_id:string;
    fixture_id: number;
    market_id: number;
    selection: string;
    value: string;
    bet_time: string;
    stake_size: number;
    price: number;
    trader_id: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
// const data: Person[] = [
//   {
//     name: {
//       firstName: 'John',
//       lastName: 'Doe',
//     },
//     address: '261 Erdman Ford',
//     city: 'East Daphne',
//     state: 'Kentucky',
//   },
//   {
//     name: {
//       firstName: 'Jane',
//       lastName: 'Doe',
//     },
//     address: '769 Dominic Grove',
//     city: 'Columbus',
//     state: 'Ohio',
//   },
//   {
//     name: {
//       firstName: 'Joe',
//       lastName: 'Doe',
//     },
//     address: '566 Brakus Inlet',
//     city: 'South Linda',
//     state: 'West Virginia',
//   },
//   {
//     name: {
//       firstName: 'Kevin',
//       lastName: 'Vandy',
//     },
//     address: '722 Emie Stream',
//     city: 'Lincoln',
//     state: 'Nebraska',
//   },
//   {
//     name: {
//       firstName: 'Joshua',
//       lastName: 'Rolluffs',
//     },
//     address: '32188 Larkin Turnpike',
//     city: 'Omaha',
//     state: 'Nebraska',
//   },
// ];

const Table = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'selection_id', //access nested data with dot notation
        header: 'Selection ID',
        size: 50,
      },
      {
        accessorKey: 'fixture_id',
        header: 'Fixture ID',
        size: 50,
      },
      {
        accessorKey: 'market_id', //normal accessorKey
        header: 'Market ID',
        size: 50,
      },
      {
        accessorKey: 'selection',
        header: 'Selection',
        size: 150,
      },
      {
        accessorKey: 'bet_time',
        header: 'Bet Time',
        size: 100,
      },
      {
        accessorKey: 'stake_size',
        header: 'Stake Size',
        size: 100,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
      },
      {
        accessorKey: 'trader_id',
        header: 'Trader ID',
        size: 100,
      },
      
    ],
    [],
  );
  

  const table = useMaterialReactTable({
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default Table;
