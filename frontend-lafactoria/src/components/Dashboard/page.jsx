import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EmpresaForm from '../EmpresaForm/page.jsx';
import FacturaForm from '../FacturaForm/page.jsx';
import BuscarEmpresa from '../BuscarEmpresa/page.jsx';
import Header from '../Header';

function Dashboard() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '70px' }}>
    <div className="container py-4">
      <h1 className="mb-4">LaFactoria</h1>

      <nav className="mb-4">
        <Link to="/dashboard/empresas" className="btn btn-outline-primary me-2">Empresas</Link>
        <Link to="/dashboard/facturas" className="btn btn-outline-success me-2">Facturas</Link>
        <Link to="/dashboard/buscar" className="btn btn-outline-secondary">Buscar Empresa</Link>
      </nav>

      <Routes>
        <Route path="empresas" element={<EmpresaForm />} />
        <Route path="facturas" element={<FacturaForm />} />
        <Route path="buscar" element={<BuscarEmpresa />} />
        <Route path="" element={<p className="text-muted">Selecciona una opción para comenzar.</p>} />
      </Routes>
    </div></div>
    </>
  );
}

export default Dashboard;
