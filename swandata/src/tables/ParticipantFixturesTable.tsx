import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import data from '../assets/data/participant_fixtures.json';

type ParticipantFixtures = {
    fixture_id: number;
    participant_1: string;
    participant_2: string;
    sport_id: number;
    event_start_time: string;
};



const ParticipantFixturesTable = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<ParticipantFixtures>[]>(
    () => [
      
      {
        accessorKey: 'fixture_id',
        header: 'Fixture ID',
        size: 50,
      },
      {
        accessorKey: 'participant_1', //normal accessorKey
        header: 'Participant 1 (Home)',
        size: 50,
      },
      {
        accessorKey: 'participant_2',
        header: 'Participant 2 (Away)',
        size: 150,
      },
      {
        accessorKey: 'sport_id',
        header: 'Sport ID',
        size: 100,
      },
      {
        accessorKey: 'event_start_time',
        header: 'Event Start Time',
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

export default ParticipantFixturesTable;
