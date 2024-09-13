import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import data from '../assets/data/individual_fixtures.json';




type IndividualFixtures = {
    fixture_id: number;
    event_name: string;
    event_number: number;
    event_start_time: string;
    runner: string;
    sport_id:number;
};



const IndividualFixturesTable = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<IndividualFixtures>[]>(
    () => [
      {
        accessorKey: 'fixture_id', //access nested data with dot notation
        header: 'Fixture ID',
        size: 50,
      },
      {
        accessorKey: 'event_name',
        header: 'Event Name',
        size: 50,
      },
      {
        accessorKey: 'event_number', //normal accessorKey
        header: 'Event Number',
        size: 50,
      },
      {
        accessorKey: 'event_start_time',
        header: 'Event Start Time',
        size: 150,
      },
      {
        accessorKey: 'runner',
        header: 'Runner',
        size: 100,
      },
      {
        accessorKey: 'sport_id',
        header: 'Sport ID',
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

export default IndividualFixturesTable;
