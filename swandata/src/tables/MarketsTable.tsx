import { useMemo, useEffect, useState} from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  createRow,
} from 'material-react-table';

import { v4 as uuidv4 } from 'uuid';
import {rtdb} from '../utils/firebase'
import { ref, get, set, remove} from 'firebase/database'; // If using Realtime Database
import * as cfg from '../utils/variables'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';


type UserApiResponse =  Array<cfg.Market>;

const tableName = 'markets';


const Table = () => {
  const [length, setLength] = useState(0);  
  const fetchData = async () => {
    const snapshot = await get(ref(rtdb, tableName));
    const data: cfg.Market[] = [];
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val() as cfg.Market;
      childData.market_id = childSnapshot.key;
      data.push(childData);
    });
    setLength(data.length);
    return data;
  };
  const {
    data = [], //your data and api response will probably be different
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      tableName // the Query Key of query. Default is the table name. 
    ],
    queryFn: async () => {
      let json = await fetchData();
      return json;
    }
  })
  const createData =async (values:cfg.Market) =>{
      await set(ref(rtdb, tableName+'/' + values.market_id), values)
      .then(() => {
        console.log('Data created successfully with key:', values.market_id);
      })
      .catch((error) => {
        console.error('Error creating data:', error);
      });

  }
  const updateData =async (values:cfg.Market) =>{
      await set(ref(rtdb, tableName+'/' + values.market_id), values)
      .then(() => {
        console.log('Data updated successfully with key:', values.market_id);
        refetch();
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }
  const deleteData = async (id:string) =>{
      await remove(ref(rtdb, tableName+'/' + id))
          .then(() => {
            console.log('Data deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
          });
  }
  const columns = useMemo<MRT_ColumnDef<cfg.Market>[]>(
    () =>  cfg.MarketColumns,
    [],
  );
  
  //CREATE action. Some pre or post process in data editing
  const handleCreateUser: MRT_TableOptions<cfg.Market>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setCreatingRow(null); //exit creating mode
    await createData(values);
    refetch();
  };

  //UPDATE action  Some pre or post process in data editing
  const handleSaveUser: MRT_TableOptions<cfg.Market>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setEditingRow(null); //exit editing mode
    await updateData(values);
    refetch();
  };

  //DELETE action  Some pre or post process in data editing
  const openDeleteConfirmModal = async(row: MRT_Row<cfg.Market>) => {
    if (window.confirm('Are you sure you want to delete this market?')) {
      await deleteData(row.original.market_id);
      refetch();
    }
  };

  const table = useMaterialReactTable({
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: false,
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
    enableEditing: true,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowSave: handleCreateUser,
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Market</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Trader</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      
      let id = uuidv4();
      
      return (
          <div className="toolbar">
            <Button
                    variant="contained"
                    onClick={() => {
                      table.setCreatingRow(
                        createRow(table, {
                          "market_name":"",
                          "market_id": id
                        }),
                      );
                    }}
                  >
              Create New Market
            </Button>

            <Button
            variant="contained"
            onClick={()=>refetch()}
            >
                Reload Data
            </Button>
          </div>
          
        )
    },
    data, 
  });


  return (  
            <MaterialReactTable table={table} />
    );
};

const queryClient = new QueryClient();

const MarketsTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>
);

export default MarketsTable;
