import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormTask } from '/imports/ui/FormTask/index';
import { TaskList } from '/imports/ui/TaskList/index';
import { NotFound } from '/imports/ui/not_found/index';

export const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<FormTask />} />
        <Route path="/list" element={<TaskList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};