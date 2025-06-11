import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmpresaForm from './components/EmpresaForm/page.jsx';
import FacturaForm from './components/FacturaForm/page.jsx';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <h1 className="mb-4">LaFactoria</h1>

        <nav className="mb-4">
          <Link to="/empresas" className="btn btn-outline-primary me-2">Empresas</Link>
          <Link to="/facturas" className="btn btn-outline-success">Facturas</Link>
        </nav>

        <Routes>
          <Route path="/" element={<div className="text-muted"><p>Bienvenido al sistema de facturación.</p></div>} />
          <Route path="/empresas" element={<EmpresaForm />} />
          <Route path="/facturas" element={<FacturaForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
