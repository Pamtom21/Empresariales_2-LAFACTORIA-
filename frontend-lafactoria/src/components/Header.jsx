import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import '../Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="lafact-header d-flex justify-content-between align-items-center px-4">
      <Dropdown>
        <Dropdown.Toggle variant="light" className="perfil-btn">
          Perfil
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => navigate('/dashboard/perfil')} >Mi cuenta</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/dashboard/configuracion')} >Configuración</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => navigate('/')}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div className="lafact-title text-center flex-grow-1">Bienvenido a LaFactoria</div>

      <div style={{ width: '75px' }}></div> {/* Balance visual */}
    </header>
  );
}

export default Header;
