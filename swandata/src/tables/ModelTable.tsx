import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  TextField
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import {rtdb} from '../utils/firebase'
import { ref, get, set, remove} from 'firebase/database'; // If using Realtime Database
import * as cfg from '../utils/variables';
import DeleteIcon from '@mui/icons-material/Delete';
import MarketCell from '../cell/market'
import FixtureEdit from '../cell/fixtureEdit'

type dataType = cfg.Model
const tableName = 'model'
const keyName = 'selection_id'
type UserApiResponse =  Array<dataType>;

const fetchData = async () => {
  const snapshot = await get(ref(rtdb, tableName));
  const data: dataType[] = [];
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val() as dataType;
    childData[keyName] = childSnapshot.key;
    data.push(childData);
  });
  return data;
};

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedData, setEditedData] = useState<Record<string, dataType>>({});

  const columns = useMemo<MRT_ColumnDef<dataType>[]>(
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
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
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
        editComponent: (props:any) => (
          <h1>hi</h1>
        ),
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: false
        }),
      },
    ],
    [editedData, validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createData, isPending: isCreatingData } =
    useCreateData();
  //call READ hook
  const {
    data: fetchedData = [],
    isError: isLoadingDataError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingData,
    refetch,
  } = useGetData();
  //call UPDATE hook
  const { mutateAsync: updateData, isPending: isUpdatingData } =
    useUpdateData();
  //call DELETE hook
  const { mutateAsync: deleteData, isPending: isDeletingUser } =
    useDeleteData();

  //CREATE action
  const handlecreateData: MRT_TableOptions<dataType>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {

    setValidationErrors({});
    await createData(values);
    table.setCreatingRow(null); //exit creating mode
    refetch();
  };

  //UPDATE action
  const handleSaveUsers = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateData(Object.values(editedData));
    setEditedData({});
    refetch();
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<dataType>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteData(row.original[keyName]);
      refetch();
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedData,
    createDisplayMode: 'row', 
    editDisplayMode: 'cell', 
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableColumnPinning: true,
    enableEditing: true,
    enableRowActions: true,
    getRowId: (row) => row.selection_id,
    muiToolbarAlertBannerProps: isLoadingDataError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handlecreateData,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={
            Object.keys(editedData).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingData ? <CircularProgress size={25} /> : 'Save'}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="toolbar">

      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); 
        }}
      >
        Create New Model
      </Button>
            <Button
            variant="contained"
            onClick={()=>refetch()}
            >
                Reload Data
            </Button>

      </div>
      
    ),
    initialState: {
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isLoadingData,
      isSaving: isCreatingData || isUpdatingData || isDeletingUser,
      showAlertBanner: isLoadingDataError,
      showProgressBars: isFetchingUsers,
    },
  });

  



  return <MaterialReactTable table={table}  />;
};

//CREATE hook (post new user to api)
function useCreateData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: dataType) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: async (values: dataType) => {
      values[keyName] =  uuidv4();
      await set(ref(rtdb, tableName+'/' + values[keyName]), values)
      .then(() => {
        console.log('Data created successfully with key:', values[keyName]);
      })
      .catch((error) => {
        console.error('Error creating data:', error);
      });

    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetData() {
  return  useQuery<UserApiResponse>({
    queryKey: [
      tableName // the Query Key of query. Default is the table name. 
    ],
    queryFn: async () => {
      let json = await fetchData();
      return json;
    }
  })
}

//UPDATE hook (put user in api)
function useUpdateData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: dataType[]) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    onMutate: async (values: dataType[]) => {
      values.forEach(value=>{
        set(ref(rtdb, tableName+'/' + value[keyName]), value)
        .then(() => {
          console.log('Data updated successfully with key:', value[keyName]);
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
      });


    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (id: string) => {
      remove(ref(rtdb, tableName+'/' + id))
      .then(() => {
        console.log('Data deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
      });
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
    <Example />
);

export default ExampleWithProviders;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
