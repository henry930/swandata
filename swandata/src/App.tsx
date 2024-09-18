import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Dashboard />
      </div>
    </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
