import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { AppRouter } from './components/Routes/pages_routes';

export const App = () => {
  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      );
};


