import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import AboutUsPage from './pages/AboutUs';
import QuotationPage from './pages/Quotation';
import InvoicePage from './pages/Invoice'; 
import CreateInvoicePage from './pages/CreateInvoice'; // <-- 1. Import new page

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/invoice" element={<InvoicePage />} /> 
        <Route path="/create-invoice" element={<CreateInvoicePage />} /> {/* <-- 2. Add new route */}

        <Route path="/quotation/*" element={<QuotationPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);