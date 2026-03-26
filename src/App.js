import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyles from './assets/styles/global';
import Routes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes />
    </BrowserRouter>
  );
}
