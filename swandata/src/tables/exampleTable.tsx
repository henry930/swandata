import { useState } from 'react';
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
  } from 'material-react-table';

const MyTable = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
  ]);

  const columns = [
    {
      accessorKey: 'id', // Use accessorKey for column identification
      header: 'ID',
      editable: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      editable: true,
    },
    {
      accessorKey: 'age',
      header: 'Age',
      editable: true,
    },
  ];

  const handleEditRow = (newData:any, oldData:any) => {
    // Your custom validation and data submission logic
    if (newData.name === '') {
      alert('Name is required');
      return;
    }

    const updatedData = data.map((item) =>
      item.id === oldData.id ? newData : item
    );

    setData(updatedData);
  };

  const handleRowAdd = (newData:any) => {
    // Your custom validation and data submission logic
    if (newData.name === '') {
      alert('Name is required');
      return;
    }

    setData([...data, newData]);
  };

  const handleRowDelete = (oldData:any) => {
    // Your custom deletion logic
    const updatedData = data.filter((item) => item.id !== oldData.id);
    setData(updatedData);
  };

  return (
    <MaterialReactTable
      data={data}
      columns={columns}
      editable={{
        onEditingRowSave: handleEditRow,
        onRowAdd: handleRowAdd,
        onRowDelete: handleRowDelete,
      }}
    />
  );
};

export default MyTable;