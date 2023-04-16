import React, { useRef, MouseEventHandler } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/NavBar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import HospitalBeds from './pages/HospitalBeds/HospitalBeds';
import Login from './components/Login/Login';

function App() {

  const sidebar_left = useRef<HTMLDivElement>(null);

  const resizeShow = (buttonRef: React.RefObject<HTMLDivElement>, activeClass: any, show: boolean): void => {
    if(show){
      sidebar_left.current?.classList.remove('d-none');
      buttonRef.current?.classList.remove(activeClass);
    } else {
      sidebar_left.current?.classList.add('d-none');
      buttonRef.current?.classList.add(activeClass);
    }
    
  };

  const handleShow = (buttonRef: React.RefObject<HTMLDivElement>, activeClass: any): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      sidebar_left.current?.classList.toggle('d-none');
      buttonRef.current?.classList.toggle(activeClass);
    } 
  };

  return (
    <div className='App'>
      <Login />
      <Navbar handleShow={handleShow} resizeShow={resizeShow}/>
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
