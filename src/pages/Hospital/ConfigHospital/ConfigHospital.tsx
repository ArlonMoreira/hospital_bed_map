import React, { useEffect } from 'react'
//Styles
import styles from './ConfigHospital.module.css'
//Router
import { Routes, Route, NavLink } from 'react-router-dom';
//Hooks
import { useParams, useNavigate } from 'react-router-dom';
//Pages
import Beds from './Beds/Beds';

type Props = {
}

const ConfigHospital = (props: Props) => {

  const { hospital, sector } = useParams();
  const navigate = useNavigate();
  
  useEffect(()=>{
    navigate(`/hospitais/cadastrar/${hospital}/configurar/${sector}/leitos`);
  }, [hospital, sector]);

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to={`/hospitais/cadastrar/${hospital}/configurar/${sector}/leitos`}>Leitos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to={`/hospitais/cadastrar/${hospital}/configurar/${sector}/editar`}>Editar</NavLink>
        </li>
      </ul>
      <div className={styles.container}>
        <Routes>
          <Route path="leitos" element={<Beds/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default ConfigHospital;