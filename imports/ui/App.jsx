import React, { useEffect } from 'react';
import { FormTask } from './FormTask/forms';
import { Meteor } from 'meteor/meteor';
// import { MongoClient } from 'mongodb'; // No se usa directamente en el frontend

export const App = () => {
  return (
    <div>
      <FormTask />
    </div>
  );
};


