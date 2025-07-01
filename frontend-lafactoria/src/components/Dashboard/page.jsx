import React, { useState } from 'react'; // ← ¡aquí está el fix!
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import EmpresaForm from '../EmpresaForm/page.jsx';
import FacturaForm from '../FacturaForm/page.jsx';
import BuscarEmpresa from '../BuscarEmpresa/page.jsx';
import Perfil from '../Perfil/page.jsx';
import Configuracion from '../Configuracion/page.jsx';
import Header from '../Header';
import Compras from '../Compras/page.jsx';
import Catalogos from '../Catalogos/page.jsx';
import Pago from '../Pago/page.jsx';


function Dashboard() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const hideLayoutRoutes = ['/dashboard/perfil', '/dashboard/configuracion', '/dashboard/compras', '/dashboard/catalogos', '/dashboard/pago'];
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
            <Route path="compras" element={<Compras carrito={carrito} />} />
            <Route path="catalogos" element={
              <Catalogos productos={productos} setProductos={setProductos} agregarAlCarrito={agregarAlCarrito} />
            } />
            <Route path="" element={<p className="text-muted">Selecciona una opción para comenzar.</p>} />
            <Route path="pago" element={<Pago />} />

          </Routes>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
