import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import TraderCell from '../cell/trader'
import MarketCell from '../cell/market'
import data from '../assets/data/bets_placed.json';

type Bets = {
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


function MyCustomCell( value:string ) {
  return <span style={{ color: 'blue' }}>{value}</span>;
}


const BetsTable = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Bets>[]>(
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
        Cell: ({ cell }) => (<MarketCell id={cell.getValue<number>()} />),

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
        header: 'Trader',
        Cell: ({ cell }) => (<TraderCell id={cell.getValue<string>()} />),
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
    enableEditing: false,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default BetsTable;
