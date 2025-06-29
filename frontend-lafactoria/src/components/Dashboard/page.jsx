import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import EmpresaForm from '../EmpresaForm/page.jsx';
import FacturaForm from '../FacturaForm/page.jsx';
import BuscarEmpresa from '../BuscarEmpresa/page.jsx';
import Perfil from '../Perfil/page.jsx';
import Configuracion from '../Configuracion/page.jsx';
import Header from '../Header';

function Dashboard() {
  const location = useLocation();

  // Rutas donde NO se debe mostrar el menú clásico
  const hideLayoutRoutes = ['/dashboard/perfil', '/dashboard/configuracion'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname.toLowerCase());

  return (
    <>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        <div className="container py-4">

          {!shouldHideLayout && (
            <>
              <h1 className="mb-4">LaFactoria</h1>
              <nav className="mb-4">
                <Link to="/dashboard/empresas" className="btn btn-outline-primary me-2">Empresas</Link>
                <Link to="/dashboard/facturas" className="btn btn-outline-success me-2">Facturas</Link>
                <Link to="/dashboard/buscar" className="btn btn-outline-secondary">Buscar Empresa</Link>
              </nav>
            </>
          )}

          <Routes>
            <Route path="empresas" element={<EmpresaForm />} />
            <Route path="facturas" element={<FacturaForm />} />
            <Route path="buscar" element={<BuscarEmpresa />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="" element={<p className="text-muted">Selecciona una opción para comenzar.</p>} />
          </Routes>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
