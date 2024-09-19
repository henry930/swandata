import { useMemo , useState,useEffect} from 'react'
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  createRow,
  MRT_ColumnDef,
} from 'material-react-table'
import {dbUtils, rtdb} from '../utils/firebase'
import { ref, get, set, remove} from 'firebase/database' // If using Realtime Database
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  useQuery,
} from '@tanstack/react-query'
import * as cfg from '../utils/variables'

// All Cell Component for custom editing and rendering
import {TraderCell,TraderEdit} from '../cell/trader'
import {EventCell,EventEdit} from '../cell/event'
import {MarketCell,MarketEdit} from '../cell/market'
import {SportCell,SportEdit} from '../cell/sport'
import {DateTimeCell, DateTimeEdit} from '../cell/datetime'
import {ResultCell} from '../cell/result'
import {ParticipantCell, ParticipantEdit} from '../cell/participant'
import {resolveBet,resolveSelectedBets} from '../action/bets'

type UserApiResponse =  Array<any>


const Table = (_props: {type:string}) => {
  
  let type=_props.type || 'trader'
  const [tableName, setTableName] = useState('trader')
  const [keyName, setKeyName] = useState('trader_id')
  const [columns,setColumns] = useState<MRT_ColumnDef<any,any>[]>([])
  const [editedData, setEditedData] = useState<Record<string, any>>({})

  // Column Definition. (I am sorry that, I can't seperate them into other files. TO DO)
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
  )
  const BetsColumns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      
      {
        accessorKey: 'bet_id', //access nested data with dot notation
        header: 'Bet ID',
        size: 50,
      },
      {
        accessorKey: 'selection_id', //access nested data with dot notation
        header: 'Selection ID',
        size: 50,
      },
      {
        accessorKey: 'event_id',
        header: 'Event',
        Cell: ({ cell }) => (<EventCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row.original.event_id = e.id
              row._valuesCache['event_id']= e.id            
          }
          return (<EventEdit id={cell.getValue<string>()} onChange={handleChange}/>)
        },

        size: 50,
      },
      {
        accessorKey: 'market_id', //normal accessorKey
        header: 'Market',
        Cell: ({ cell }) => (<MarketCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row.original.market_id = e.id
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
            setEditedData({ ...editedData, [row.id]: row.original })
          }
        }),
      },
      {
        accessorKey: 'value',
        header: 'Value',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'value',
          required: false,
          onBlur: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original })
          },
        }),
        size: 100,
      },
      {
        accessorKey: 'bet_time',
        header: 'Bet Time',
        Cell: ({ cell }) => (<DateTimeCell datetime={cell.getValue<string>()}/>),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row._valuesCache['bet_time'] = e
          }
          return (<DateTimeEdit datetime={cell.getValue<string>()}  onChange={handleChange}/>)
        },  

        size: 100,
      },
      {
        accessorKey: 'stake_size',
        header: 'Stake Size',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          onBlur: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original })
          },
        }),
        size: 100,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          onBlur: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original })
          },
        }),
        size: 100,
      },

      {
        accessorKey: 'trader_id',
        header: 'Trader',
        Cell: ({ cell }) => (<TraderCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row.original.market_id = e.id
              row._valuesCache['trader_id']= e.id            
          }
          return (<TraderEdit id={cell.getValue<string>()} onChange={handleChange}/>)
        },
        size: 100,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        editVariant: 'select',
        editSelectOptions: cfg.statusStates,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original })
          }
        }),
      },
      
    ],
    [],
  )
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
  )
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
        accessorKey: 'name',
        header: 'Name',
        size: 100,
      },
      {
        accessorKey: 'event_id',
        header: 'Event',
        Cell: ({ cell }) => (<EventCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row.original.event_id = e.id
              row._valuesCache['event_id']= e.id            
          }
          return (<EventEdit id={cell.getValue<string>()} onChange={handleChange}/>)
        },

        size: 50,
      },
      {
        accessorKey: 'market_id', //normal accessorKey
        header: 'Market',
        Cell: ({ cell }) => (<MarketCell id={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row.original.market_id = e.id
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
            setEditedData({ ...editedData, [row.id]: row.original })
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
            setEditedData({ ...editedData, [row.id]: row.original })
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
  )
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
  )
  const EventsColumns = useMemo<MRT_ColumnDef<any>[]>(
    () =>  [
      {
          accessorKey: 'event_id', //access nested data with dot notation
          enableEditing: false,
          header: 'Event ID',
          size: 50,
      },
      {
        accessorKey: 'event_name', //access nested data with dot notation
        enableEditing: true,
        header: 'Event Name',
        size: 50,
    },
      {
          accessorKey: 'sport_id',
          header: 'Sport',
          Cell: ({ cell }) => (<SportCell id={cell.getValue<string>()} />),
          Edit: ({ cell, column, row, table }) => {    
            function handleChange(e:any){
                row.original.sport_id = e.id
                row._valuesCache['sport_id']= e.id         
                // Updating Event Name if event name is empty.

            }
            return (<SportEdit id={cell.getValue<string>()} onChange={handleChange}/>)
          },  
          size: 50,
          
      },
      {
        accessorKey: 'event_time',
        header: 'Event Start Time',
        size: 50,  
        Cell: ({ cell }) => (<DateTimeCell datetime={cell.getValue<string>()}/>),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:any){
              row._valuesCache['event_time'] = e
          }
          return (<DateTimeEdit datetime={cell.getValue<string>()}  onChange={handleChange}/>)
        },  

      },
      {
        accessorKey: 'participants',
        header: 'Participants',
        Cell: ({ cell }) => (<ParticipantCell value={cell.getValue<string>()} />),
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(e:string){
              console.log(e)
              row._valuesCache['participants'] = e
          }
          return (<ParticipantEdit value={cell.getValue<string>()}  onChange={handleChange}/>)
        },  
      
        size: 50,        
      },
      {
        accessorKey: 'result',
        header: 'Results',
        Cell: ({ cell,column,row,table }) => {    
          function handleChange(result:string){
              row._valuesCache['result'] = result
              row._valuesCache['status'] = 'result'


            // It is cell. So, need to update manually
              let myDb = new dbUtils('events','event_id')
             
              let item = {...[row._valuesCache]}
              myDb.saveData(item)

          }
          return (<ResultCell value={cell.getValue<string>()}  onChange={handleChange}/>)
        },  
        Edit: ({ cell, column, row, table }) => {    
          function handleChange(result:string){
              row._valuesCache['result'] = result
              row._valuesCache['status'] = 'result'

          }
          return (<ResultCell value={cell.getValue<string>()}  onChange={handleChange}/>)
        },  
        size: 50,        
      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        editSelectOptions: cfg.eventStates,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) => {
            setEditedData({ ...editedData, [row.id]: row.original })
          }
        }),
        size: 50,        
      },
  ],
    [],
  )

  // Initial Variable Settings for Display different data by master table settings
  useEffect(() => {
    switch (type){
      default:
      case 'trader':
          setTableName('trader')
          setKeyName('trader_id')
          setColumns(TraderColumns)
      break
      
      case 'markets':
          setTableName('markets')
          setKeyName('market_id')
          setColumns(MarketColumns)
      break

      case 'bets':
        setTableName('bets')
        setKeyName('bet_id')
        setColumns(BetsColumns)
      break

      case 'model':
        setTableName('model')
        setKeyName('selection_id')
        setColumns(ModelColumns)
      break

      case 'sports':
        setTableName('sports')
        setKeyName('sport_id')
        setColumns(SportsColumns)
      break

      case 'events':
        setTableName('events')
        setKeyName('event_id')
        setColumns(EventsColumns)
      break
    }
  }, [])

  // Custom Button Actions for different usage
  
  // Resolve All Bets of selected traders 
  const handleResolveBetsByTrader = async (table:any) =>{
    const selectedRows = table.getSelectedRowModel().rows
    let myDb = new dbUtils('bets','bet_id')
    for (let i=0; i<selectedRows.length; i++) {
      let trader_id = selectedRows[i].original[keyName]
      try {
        let res = await myDb.queryData('trader_id',trader_id) as cfg.Bets[]
        let ids = res.map((item:cfg.Bets) => item.bet_id)
        resolveSelectedBets(ids)
      }catch(e){
          console.error(e)
      }
    }
  }

  // Once Events Results come, update bets status to 'Payout' to notify which Bets records need to be resolved.
  const handleUpdateBetsByEvents = async (table:any) =>{
    const selectedRows = table.getSelectedRowModel().rows
    let myDb = new dbUtils('bets','bet_id')
    for (let i=0; i<selectedRows.length; i++) {
      let event_id = selectedRows[i].original[keyName]
      try {
        let updates ={
          'status':'Payout'
        }
        let res = await myDb.queryData('event_id',event_id) as cfg.Bets[]
        let ids = res.map((item:cfg.Bets) => item.bet_id)
        ids.forEach(id=>{
          myDb.updateData(id,updates)
        })
      }catch(e){
          console.error(e)
      }
    }
  }

  // Resolve all selected events' bets
  const handleResolveBetsByEvents = async (table:any) =>{
    const selectedRows = table.getSelectedRowModel().rows
    let myDb = new dbUtils('bets','bet_id')
    for (let i=0; i<selectedRows.length; i++) {
      let event_id = selectedRows[i].original[keyName]
      try {
        let res = await myDb.queryData('event_id',event_id) as cfg.Bets[]
        let ids = res.map((item:cfg.Bets) => item.bet_id)
        resolveSelectedBets(ids)
      }catch(e){
          console.error(e)
      }
    }
  }

  // Resolve all Payout status's bets
  const handleResolvePayoutBets = async (table:any) =>{
    let myDb = new dbUtils('bets','bet_id')
      try {
        let res = await myDb.queryData('status','Payout') as cfg.Bets[]
        let ids = res.map((item:cfg.Bets) => item.bet_id)
        resolveSelectedBets(ids)
      }catch(e){
          console.error(e)
      }
  }

  // Resolve all selected bets
  const handleResolveBets = async (table:any) =>{
    const selectedRows = table.getSelectedRowModel().rows

    for (let i=0; i<selectedRows.length; i++) {
      let id = selectedRows[i].original[keyName]
      let returnMsg = await resolveBet(id)
      console.log(returnMsg)
    }

  }

  // Fetch data for table
  const fetchData = async () => {
    const snapshot = await get(ref(rtdb, tableName))
    const data: any[] = []
    try {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val() as any
        childData[keyName] = childSnapshot.key
        data.push(childData)
      })
    } catch(e){
      console.log("Error")
    }
    return data
  }
 
  // Query setup for table.
  const {
    data = [], //your data and api response will probably be different
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      tableName // the Query Key of query. Default is the table name. 
    ],
    queryFn: async () => {
      let json = await fetchData()
      return json
    }
  })
  // General data functions for tables
  const createData =async (values:any) =>{
      await set(ref(rtdb, tableName+'/' + values[keyName]), values)
      .then(() => {
        console.log('Data created successfully with key:', values[keyName])
      })
      .catch((error) => {
        console.error('Error creating data:', error)
      })

  }
  const updateData =async (values:any) =>{
      await set(ref(rtdb, tableName+'/' + values[keyName]), values)
      .then(() => {
        console.log('Data updated successfully with key:', values[keyName])
        refetch()
      })
      .catch((error) => {
        console.error('Error updating data:', error)
      })
  }
  const deleteData = async (id:string) =>{
      await remove(ref(rtdb, tableName+'/' + id))
          .then(() => {
            console.log('Data deleted successfully')
          })
          .catch((error) => {
            console.error('Error deleting data:', error)
          })
  }

  //CREATE action for create data button. Some pre or post process in data editing
  const handleCreateData: MRT_TableOptions<any>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setCreatingRow(null) //exit creating mode
    await createData(values)
    refetch()
  }

  //UPDATE action for edit data button. Some pre or post process in data editing
  const handleSaveData: MRT_TableOptions<any>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    table.setEditingRow(null) //exit editing mode
    await updateData(values) 
    refetch()
  }

  //DELETE action for delete data button. Some pre or post process in data editing
  const openDeleteConfirmModal = async(row: MRT_Row<any>) => {
    if (window.confirm('Are you sure you want to delete this trader?')) {
      await deleteData(row.original[keyName])
      refetch()
    }
  }

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

    // Custom Buttons for different tables}
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="toolbar">
        <Button
                variant="contained"
                onClick={() => {
                  let initValue = cfg.getInitValue(tableName)
                  table.setCreatingRow(
                    createRow(table, initValue),
                  )
                }}
              >
          Create New {tableName}
        </Button>

        <Button
        variant="contained"
        onClick={()=>{
             refetch()
          }
        }
        >
            Reload Data
        </Button>
        {(tableName=='bets') && (
          <div>
            <Button variant="contained" onClick={()=>handleResolveBets(table)}>Resolve Selected Bets</Button>
            <Button variant="contained" onClick={()=>handleResolvePayoutBets(table)}>Resolve Payout Bets</Button>
          </div>
        )}  
        {(tableName=='events') && (
          <div>
            <Button variant="contained" onClick={()=>handleResolveBetsByEvents(table)}>Resolve Bets By Event</Button>
            <Button variant="contained" onClick={()=>handleUpdateBetsByEvents(table)}>Update Bets Status By Event</Button>
          </div>
        )}  
        {(tableName=='trader') && (
          <div>
            <Button variant="contained" onClick={()=>handleResolveBetsByTrader(table)}>Resolve Bets By Trader</Button>
          </div>
        )}  
      </div>      
    ),
    data, 
  })
  return (  
            <MaterialReactTable table={table}/>
    )
}

export default Table
