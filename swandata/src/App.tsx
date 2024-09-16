import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <div className="App">
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
