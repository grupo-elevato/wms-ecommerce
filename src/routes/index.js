import React from 'react';
import { Routes, Route } from 'react-router-dom';

import DanfeScan from '../pages/DanfeScan';
import Conferencia from '../pages/Conferencia';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DanfeScan />} />
      <Route path="/conferencia" element={<Conferencia />} />
    </Routes>
  );
}
