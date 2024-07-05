import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";

import './index.css';
import { Providers } from './app/providers';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Providers >
        <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);