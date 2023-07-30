import React, { useEffect } from 'react'
//Styles
import styles from './ConfigHospital.module.css'
//Router
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
//Hooks
import { useParams, useNavigate } from 'react-router-dom';
//Pages
import Beds from './Beds/Beds';
import EditSector from './EditSector/EditSector';
//Context
import { useSectorContext } from '../../../components/Context/SectorContext';

type Props = {
}

const ConfigHospital = (props: Props) => {

  const sectorSelected = useSectorContext();

  const { hospital, sector } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(()=>{
    //Assim que abro uma página por padrão será sempre pra rota pai, antes do /leitos e /editar
    if(location.pathname === `/hospitais/cadastrar/${hospital}/configurar/${sector}`){
      navigate(`/hospitais/cadastrar/${hospital}/configurar/${sector}/leitos`);
    }

    if(sector){
      sectorSelected?.setSectorSelected(sector);
    }

  }, [hospital, sector, location, navigate]);

  return (
    <>
      <ul className="nav nav-tabs border-0">
        <li className="nav-item border-0">
          <NavLink className={`nav-link ${styles.nav_tab}`} aria-current="page" to={`/hospitais/cadastrar/${hospital}/configurar/${sector}/leitos`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            <span>Leito</span>
          </NavLink>
        </li>
        <li className="nav-item border-0">
          <NavLink className={`nav-link ${styles.nav_tab}`} aria-current="page" to={`/hospitais/cadastrar/${hospital}/configurar/${sector}/editar`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
            <span>Setor</span>
          </NavLink>
        </li>
      </ul>
      <div className={styles.container}>
        <div className={styles.content}>
          <Routes>
            <Route path="leitos" element={<Beds/>}/>
            <Route path="editar" element={<EditSector/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default ConfigHospital;