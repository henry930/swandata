import { useMemo } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import MarketCell from '../cell/market'
import data from '../assets/data/model_selections.json'


type Model = {
    model_id: number;
    selection_id:string;
    fixture_id: number;
    market_id: number;
    selection: string;
    value: string;
    bottom_price: number;
};



const ModelTable = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Model>[]>(
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
        header: 'Market',
        Cell: ({ cell }) => (<MarketCell id={cell.getValue<number>()} />),
        size: 50,
      },
      {
        accessorKey: 'selection',
        header: 'Selection',
        size: 150,
      },
      {
        accessorKey: 'bottom_price',
        header: 'Bottom Price',
        size: 100,
      },
      {
        accessorKey: 'value',
        header: 'Value',
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

  return (
    <div>
      <Stack spacing={2} direction="row">
        <Button variant="contained">Create Model</Button>
      </Stack>  
      <MaterialReactTable table={table} />
    </div>
  )
};

export default ModelTable;
