import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Home} from '/imports/ui/Home/home';
import { NotFound } from '/imports/ui/NotFound/notfound';

export const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};