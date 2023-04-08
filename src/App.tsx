import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//styles
import styles from './App.module.css';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/NavBar/Navbar';

function App() {

  return (
    <div className='App'>
      <Navbar />
      <div className='main'>
        <BrowserRouter>
          <Sidebar />
          <div className='container-fluid'>
          <h1>Teste</h1>
            <Routes>
                
            </Routes>
          </div>        
        </BrowserRouter>
      </div>
    </div>
  );
  
}

export default App;
