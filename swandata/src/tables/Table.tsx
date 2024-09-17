import { useMemo , useState,useEffect} from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  createRow,
  MRT_ColumnDef,
} from 'material-react-table';

import { v4 as uuidv4 } from 'uuid';
import {rtdb} from '../utils/firebase'
import { ref, get, set, remove} from 'firebase/database'; // If using Realtime Database
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
  useQuery,
} from '@tanstack/react-query';
import {dbUtils} from '../utils/firebase'
import * as cfg from '../utils/variables'
import TraderCell from '../cell/trader'
import FixtureEdit from '../cell/fixtureEdit'
import {MarketCell,MarketEdit} from '../cell/market'

type UserApiResponse =  Array<any>;


const Table = (_props: {type:string}) => {
  
  let type=_props.type || 'trader';
  const [tableName, setTableName] = useState('trader');
  const [keyName, setKeyName] = useState('trader_id');
  const [columns,setColumns] = useState<MRT_ColumnDef<any,any>[]>([]);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  // Column Definition. (I am sorry that, I can't seperate them into other files. TO do)
  const TraderColumns = useMemo<MRT_ColumnDef<any>[]>(
    () =>  [
      {
        accessorKey: 'trader_id',
        header: 'Trader ID',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'trader_name',
        header: 'Trader Name',
        muiEditTextFieldProps: {
          required: true,
        },
        size: 50,
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
        },
        size: 50,
      }
  ],
    [],
  );
  const BetsColumns = useMemo<MRT_ColumnDef<any>[]>(
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
        // Cell: ({ cell }) => (<MarketCell id={cell.getValue<number>()} />),

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
  const MarketColumns = useMemo<MRT_ColumnDef<any>[]>(
    () =>  [
      {
          accessorKey: 'market_id', //access nested data with dot notation
          enableEditing: false,
          header: 'Market ID',
          size: 50,
      },
      {
          accessorKey: 'market_name',
          header: 'Market Name',
          size: 50,
          
      },
  ],
    [],
  );
  const ModelColumns = useMemo<MRT_ColumnDef<any>[]>(
    () => 
   
    [
      {
        accessorKey: 'selection_id',
        header: 'Selection ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'fixture_id',
        header: 'Fixture ID',
        Edit: ({ cell, column, row, table }) => {    
          return (<FixtureEdit id={cell.getValue<string>()}/>)
        },
        size: 50,
      },
      {
        accessorKey: 'market_id', //normal accessorKey
        header: 'Market',
        Cell: ({ cell }) => (<MarketCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              let myDb = new dbUtils(tableName,keyName)
              const item = { ...row.original }; // Create a copy to avoid mutation
              item.market_id = e.id;
              console.log(cell,row)
              row._valuesCache['market_id']= e.id            
          }
          return (<MarketEdit id={cell.getValue<string>()} onChange={handleChange}/>)
        },

        size: 50,
      },
      {
        accessorKey: 'selection',
        header: 'Selection',
        size: 150,
        editVariant: 'select',
        editSelectOptions: cfg.selectionStates,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original });
          }

        }),
      },
      {
        accessorKey: 'bottom_price',
        header: 'Bottom Price',
        size: 100,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          onBlur: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'value',
        header: 'Value',
        size: 100,
       
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: false
        }),
      },
    ],
    [editedData],
  );

  const SportsColumns = useMemo<MRT_ColumnDef<any>[]>(
    () =>  [
      {
          accessorKey: 'sport_id', //access nested data with dot notation
          enableEditing: false,
          header: 'Sport ID',
          size: 50,
      },
      {
          accessorKey: 'sport_name',
          header: 'Sport Name',
          size: 50,
          
      },
      {
        accessorKey: 'description',
        header: 'Sport Description',
        size: 200,
        
    },
  ],
    [],
  );

  const EventsColumns = useMemo<MRT_ColumnDef<any>[]>(
    () =>  [
      {
          accessorKey: 'event_id', //access nested data with dot notation
          enableEditing: false,
          header: 'Event ID',
          size: 50,
      },
      {
          accessorKey: 'sport_id',
          header: 'Sport',
          size: 50,
          
      },
      {
        accessorKey: 'event_time',
        header: 'Event Start Time',
        size: 50,        
      },
      {
        accessorKey: 'participants',
        header: 'Participants',
        size: 50,        
      },
      {
        accessorKey: 'result',
        header: 'Results',
        size: 50,        
      },
      {
        accessorKey: 'score',
        header: 'Score',
        size: 50,        
      },
      {
        accessorKey: 'winner',
        header: 'Winner',
        size: 50,        
      },
  ],
    [],
  );
  //////////
  

  useEffect(() => {
    switch (type){
      default:
      case 'trader':
          setTableName('trader')
          setKeyName('trader_id')
          setColumns(TraderColumns)
      break;
      
      case 'markets':
          setTableName('markets')
          setKeyName('market_id')
          setColumns(MarketColumns)
      break;

      case 'bets':
        setTableName('bets')
        setKeyName('bid')
        setColumns(BetsColumns)
      break;

      case 'model':
        setTableName('model')
        setKeyName('selection_id')
        setColumns(ModelColumns)
      break;

      case 'sports':
        setTableName('sports')
        setKeyName('sport_id')
        setColumns(SportsColumns)
      break;

      case 'events':
        setTableName('events')
        setKeyName('event_id')
        setColumns(EventsColumns)
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
    refetch
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
        <DialogTitle variant="h3">Create New {tableName}</DialogTitle>
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
        <DialogTitle variant="h3">Edit {tableName}</DialogTitle>
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
          Create New {tableName}
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
            <MaterialReactTable table={table}/>
    );
};



export default Table;
