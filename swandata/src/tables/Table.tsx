import { useMemo , useState,useEffect} from 'react';
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
import FixtureEdit from '../cell/fixtureEdit';
import {
  useQuery,
} from '@tanstack/react-query';

// Initial Setup
// type any = any; 

type UserApiResponse =  Array<any>;

interface Params {
  tableName: string;
  keyName: string;
  type: string;
  columns: string;
}

const Table = (_props: {type:string}) => {
  
  let type=_props.type;
  const [tableName, setTableName] = useState('trader');
  const [keyName, setKeyName] = useState('trader_id');
  let dummyData: cfg.Trader
  const [dataColumns,setDataColumns] = useState<object>([])

  useEffect(() => {
    switch (type){
      default:
      case 'trader':
          setTableName('trader')
          setKeyName('trader_id')
          setDataColumns(cfg.Tradercolumns)
      break;

      case 'markets':
          setTableName('markets')
          setKeyName('market_id')
          setDataColumns(cfg.MarketColumns)
      break;
    }

  }, []);


  const fetchData = async () => {
    const snapshot = await get(ref(rtdb, tableName));
    const data: any[] = [];
    try {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val() as any;
        childData[keyName] = childSnapshot.key;
        data.push(childData);
      });
    } catch(e){
      console.log("Error");
    }

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
  const createData =async (values:any) =>{
      await set(ref(rtdb, tableName+'/' + values[keyName]), values)
      .then(() => {
        console.log('Data created successfully with key:', values[keyName]);
      })
      .catch((error) => {
        console.error('Error creating data:', error);
      });

  }
  const updateData =async (values:any) =>{
      await set(ref(rtdb, tableName+'/' + values[keyName]), values)
      .then(() => {
        console.log('Data updated successfully with key:', values[keyName]);
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
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () =>   dataColumns,
    [],
  );
  
  //CREATE action. Some pre or post process in data editing
  const handleCreateData: MRT_TableOptions<any>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setCreatingRow(null); //exit creating mode
    await createData(values);
    refetch();
  };

  //UPDATE action  Some pre or post process in data editing
  const handleSaveData: MRT_TableOptions<any>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setEditingRow(null); //exit editing mode
    await updateData(values);
    refetch();
  };

  //DELETE action  Some pre or post process in data editing
  const openDeleteConfirmModal = async(row: MRT_Row<any>) => {
    if (window.confirm('Are you sure you want to delete this trader?')) {
      await deleteData(row.original[keyName]);
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
    onCreatingRowSave: handleCreateData,
    onEditingRowSave: handleSaveData,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Trader</DialogTitle>
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
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="toolbar">
        <Button
                variant="contained"
                onClick={() => {
                  table.setCreatingRow(
                    createRow(table, {
                        trader_id: uuidv4(),
                        trader_name: '', 
                        credit: 0
                    }),
                  );
                }}
              >
          Create New Trader
        </Button>

        <Button
        variant="contained"
        onClick={()=>refetch()}
        >
            Reload Data
        </Button>
      </div>
      
    ),
    data, 
  });

  return (  
            <MaterialReactTable table={table} />
    );
};


export default Table;
