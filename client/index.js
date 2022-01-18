import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import store from './store';
import App from "./app.js";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Admin from "./components/Admin";


const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
 rootElement
);