import { useRef, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//styles
import styles from './App.module.css';
//Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Hospitals from './pages/Hospitals/Hospitals';
import Authentication from './pages/Authentication/Authentication';
import EditHospital from './pages/EditHospital/EditHospital';
import Hospital from './pages/Hospital/Hospital';
import Beds from './pages/Beds/Beds';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/NavBar/Navbar';
import Logout from './components/Logout/Logout';
//Redux
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux'; // Importe o tipo AnyAction do pacote 'redux'
import { RootState } from './store';
import { refreshToken } from './slices/authSlice';
//Interface
import { IAuth } from './interfaces/Authentication';
import { IHospital } from './interfaces/Hospital';
//Hooks
import { useAuth } from './hooks/useAuth';

//tsrace

function App() {
  
  const { auth } = useAuth();
  const [hospitalList, setHospitalList] = useState<Array<IHospital>>([]);
  
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
  const sideBarRef = useRef<HTMLDivElement>(null); //Referência a barra de navegação

  return (
    <div className={styles.App}>
      <Logout />
      <BrowserRouter>
        <div className='d-flex flex-column h-100'>
          <Navbar sidebarRef={sideBarRef}/>
          <div className='main w-100 h-100'>
              <Sidebar sideBarRef={sideBarRef} setHospitalList={setHospitalList}/>
              <div className='container-fluid py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2'>
                <Routes>
                  <Route path='/' element={<Dashboard />}/>
                  <Route path='login' element={!auth ? <Authentication />: <Navigate to='/'/> }/>
                  <Route path='leitos/:id' element={<Beds hospitalList={hospitalList}/>}/>
                  <Route path="hospitais" element={auth ? <Hospitals /> : <Navigate to="/" />}/>
                  <Route path="hospitais/editar/:hospital" element={auth ? <EditHospital /> : <Navigate to="/" />}/>
                  <Route path='hospitais/cadastrar/:hospital/*' element={auth ? <Hospital /> : <Navigate to="/" />}/>
                </Routes>
              </div>        
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
  
}

export default App;
