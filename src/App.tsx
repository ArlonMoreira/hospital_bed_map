import React, { useRef, MouseEventHandler, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/NavBar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import HospitalBeds from './pages/HospitalBeds/HospitalBeds';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
//Redux
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux'; // Importe o tipo AnyAction do pacote 'redux'
import { RootState } from './store';
import { refreshToken } from './slices/authSlice';
//Interface
import { IAuth } from './interfaces/Authentication';

function App() {

  const [openModalLoading, setOpenModalLoading] = useState<boolean>(false);

  /**
   * Start: Atualizar token de autenticação;
   */
  const dispath = useDispatch<ThunkDispatch<RootState, IAuth, AnyAction>>();

  useEffect(()=>{ //Atualiza o token assim que acessar a aplicação
    dispath(refreshToken());
  }, [dispath]);

  /**
   * Start: Ocultar e apresentar Sidebar a partir da navbar
   */
  const sidebar = useRef<HTMLDivElement>(null); //Referência a barra de navegação

  return (
    <div className='App'>
      <Logout />
      <Login openModalLoading={openModalLoading}/>
      <Navbar sidebarRef={sidebar}/>
      <div className='main'>
        <BrowserRouter>
          <Sidebar setOpenModalLoading={setOpenModalLoading} sideBarRef={sidebar}/>
          <div className='container-fluid'>
            <Routes>
              <Route path='/' element={<Dashboard />}/>
              <Route path='/leitos' element={<HospitalBeds />} />
            </Routes>
          </div>        
        </BrowserRouter>
      </div>
    </div>
  );
  
}

export default App;
