import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';
import ItemPicker from './Item';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <Router>
      <Routes>
        <Route path="/item" element={<ItemPicker/>} />
      </Routes>
  </Router>
</React.StrictMode>
);

reportWebVitals();