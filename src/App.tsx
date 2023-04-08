import React, { useRef, MouseEventHandler } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//styles
import styles from './App.module.css';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/NavBar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import HospitalBeds from './pages/HospitalBeds/HospitalBeds';

function App() {

  const sidebar_left = useRef<HTMLDivElement>(null);

  const handleShow = (buttonRef: React.RefObject<HTMLDivElement>, activeClass: any): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      sidebar_left.current?.classList.toggle('d-none');
      buttonRef.current?.classList.toggle(activeClass);
    }
    
  };

  return (
    <div className='App'>
      <Navbar handleShow={handleShow}/>
      <div className='main'>
        <BrowserRouter>
          <Sidebar sideBarRef={sidebar_left}/>
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
