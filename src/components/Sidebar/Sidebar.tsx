//Styles
import styles from './Sidebar.module.css';
//Router
import { NavLink } from 'react-router-dom';
//Redux
import { list } from '../../slices/hospitalSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Hooks
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
//interface
import { AuthHookResult } from '../../interfaces/Authentication';
import { IHospital } from '../../interfaces/Hospital';
//Context
import { useCnesContext } from '../../Context/CnesDefaultContext';

type Props = {
    sideBarRef: React.RefObject<HTMLDivElement>,
}

const Sidebar = ({sideBarRef}: Props) => {

    const { auth }:AuthHookResult = useAuth();

    /**
     * Start Expandir área interna
     */
    const expandArea = useRef<HTMLDivElement>(null);

    const handleExpand = ():void => {
        expandArea.current?.classList.toggle(styles.expand);
    };

    /**
     * Cnes default
     */
    const cnes = useCnesContext();

    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    const { hospitals } : { hospitals: IHospital[] } = useSelector((state: RootState) => state.hospital);

    useEffect(()=>{
        dispatch(list());
    }, []);

    //Para que a classe active apareça no navlink é preciso que a url definida na classe nav link, seja mesmo daquele navegado.
    useEffect(()=>{
        //Só irá definir o valor padrão ao clicar no menu dos leitos caso o cnes padrão /contexto não tiver sido definido previamente.
        if(hospitals.length > 0 && !cnes?.cnesDefault){
            const hospital_active = hospitals.filter((obj) => obj.is_active);

            if(hospital_active.length > 0){
                const hospital = hospital_active[0] as IHospital;
                cnes?.setCnesDefault(hospital.cnes);
            }

        }
        
    }, [hospitals]);

    return (
        <nav ref={sideBarRef} className={`${styles.sidebar} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <div className={`${styles.sidebar_left}`} ref={expandArea}>
                <ul className={`nav ${styles.container_nav}`}>
                    <li className={`nav-item ${styles.expand_button}`} onClick={handleExpand}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" fill="white" viewBox="0 0 16 16">
                            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to='/'>
                            <div className={styles.logo_nav}>
                                <svg width="24" height="24" className="bi bi-bar-chart" viewBox="0 0 16 16" >
                                    <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                </svg>
                            </div>
                            <div className={styles.text_nav}>
                                <p>Dashboard</p>
                            </div>
                        </NavLink>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to={`/leitos/${cnes?.cnesDefault}`}>
                            <div className={styles.logo_nav}>
                                <svg width="24" height="24" viewBox="0 0 249.000000 203.000000" preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.000000,203.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path d="M1760 1970 c-33 -8 -62 -55 -150 -242 -40 -87 -78 -158 -84 -158 -6 0 -33 34 -61 75 -40 60 -57 77 -85 85 -47 13 -495 13 -542 0 -68 -19 -89 -85 -44 -137 l24 -28 251 -3 251 -3 52 -77 c115 -171 125 -182 167 -182 23 0 47 7 59 18 11 9 57 98 103 197 45 99 88 186 94 193 8 9 23 -4 65 -59 30 -39 65 -75 78 -80 33 -13 389 -11 435 2 30 8 42 18 53 45 12 29 12 39 0 68 -20 48 -57 56 -258 56 l-167 0 -73 96 c-40 53 -78 102 -84 109 -16 21 -56 33 -84 25z"/>
                                        <path d="M75 1705 l-25 -24 0 -781 0 -781 25 -24 c30 -31 83 -33 116 -6 23 18 24 25 27 175 l3 156 1025 0 1024 0 0 -164 c0 -148 2 -166 20 -188 39 -50 118 -37 139 22 14 42 15 804 1 905 -19 130 -96 249 -203 313 -83 50 -142 62 -305 63 l-144 1 -25 -54 c-13 -29 -38 -68 -56 -86 l-31 -32 190 0 c211 0 253 -8 316 -60 20 -17 49 -56 65 -88 28 -57 28 -58 28 -257 l0 -200 -480 0 -480 0 -3 298 c-3 332 -7 311 68 311 l36 1 -59 82 c-33 46 -61 83 -64 83 -13 0 -81 -42 -100 -62 -50 -53 -53 -76 -53 -395 0 -164 -4 -304 -8 -311 -7 -10 -104 -12 -453 -10 l-444 3 -5 548 -5 549 -24 19 c-33 27 -86 25 -116 -6z"/>
                                        <path d="M546 1346 c-200 -84 -260 -345 -117 -508 171 -194 484 -121 558 131 30 104 -6 231 -88 310 -65 62 -119 84 -214 88 -68 3 -89 0 -139 -21z m219 -177 c69 -61 83 -125 42 -192 -33 -54 -72 -77 -133 -77 -89 0 -154 65 -154 155 0 83 67 145 157 145 44 0 58 -5 88 -31z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className={styles.text_nav}>
                                <p>Leitos</p>
                            </div>
                        </NavLink>
                    </li>
                    {
                        auth && (
                            <li className={`nav-item ${styles.item}`}>
                                <NavLink to='/hospitais'>
                                    <div className={styles.logo_nav}>
                                    <svg width="30" height="30" viewBox="0 0 184 163">
                                        <path d="M50.4 36.1C-3.1 83.1-.5 80.4 4 84.5c2.5 2.3 4.7 1.4 11.6-4.9 2.9-2.5 5.4-4.6 5.7-4.6.4 0 .7 15.2.9 33.8l.3 33.8 2.6 4.9c3.2 6.4 9.3 11 16.3 12.5 3.6.7 20.8 1 53.7.8 47.3-.3 48.5-.3 52.4-2.4 5.4-2.9 9.4-7 11.6-11.9 1.7-3.6 1.9-7.1 1.9-37.2 0-20.3.4-33.4 1-33.8.5-.3 3.6 1.9 7 5 3.3 3 6.8 5.5 7.8 5.5 2.6 0 4.2-2 4.2-5.1 0-2.3-6.1-8.1-41.2-39.1C96.9 3.9 93.4 1 91.4 1c-.6 0-19.1 15.8-41 35.1zm65.8-2.4l29.6 26.2 6.2 5.4v36.9c0 40.7-.1 41.6-6.1 45.9l-3.4 2.4H91.8c-49.9 0-50.7 0-53.5-2.1-1.5-1.2-3.7-3.6-4.8-5.5-1.9-3.2-2-5.5-2.3-40l-.3-36.7 29.8-26.5C77.1 25.1 91 13.1 91.6 13.1c.6-.1 11.7 9.2 24.6 20.6zM82.1 57.3c-3.6 2.1-5 5.6-5.1 12.4V76h-6c-11 0-14 3.2-14 15s3 15 14 15h6v5.5c0 11.7 3.7 15 16.4 14.3 6.2-.3 7.9-.7 10-2.7 2.3-2.2 2.6-3.2 2.6-9.7v-7.2l7.4-.4c6.2-.3 7.9-.7 10-2.7 2.4-2.3 2.6-3 2.6-12.1s-.2-9.8-2.6-12.1c-2.1-2-3.8-2.4-10-2.7l-7.4-.4v-7.2c0-6.5-.3-7.5-2.6-9.7-2.2-2.1-3.7-2.4-10.7-2.7-5.6-.1-9 .2-10.6 1.1zM97 74.2c0 11.1.7 11.8 11.7 11.8h8.3v5 5h-8.2c-11.1 0-11.8.7-11.8 11.7v8.3h-5.5-5.6l.2-8.7c.2-10.9-.3-11.3-11.8-11.3H66v-5-5h8.1C85.8 86 86 85.8 86 75v-9h5.5H97v8.2z"/>
                                    </svg>
                                    </div>
                                    <div className={styles.text_nav}>
                                        <p>Hospitais</p>
                                    </div>
                                </NavLink>
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    )
};

export default Sidebar;