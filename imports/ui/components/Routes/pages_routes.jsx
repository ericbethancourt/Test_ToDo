import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Home} from '/imports/ui/home/Home';
import { NotFound } from '/imports/ui/not_found/index';

export const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};