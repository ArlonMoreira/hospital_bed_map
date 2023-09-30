import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
//Router
import { Routes, Route, NavLink } from "react-router-dom";
//Styles
import styles from './Hospital.module.css';
//Router
import { Link, useParams, useNavigate } from 'react-router-dom';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { hospital as getDataHospital } from '../../slices/hospitalSlice';
import { list as listTypeAccomodation, reset as resetTypeAccomodation } from '../../slices/typeAccomodationSlice';
import { list as listSector, clearSectors } from '../../slices/sectorSlice';
import { refreshToken } from '../../slices/authSlice';
//Interface
import { IHospital } from '../../interfaces/Hospital';
import { ITypeAccommodation } from '../../interfaces/TypeAccommodation';
import { ISector } from '../../interfaces/Sector';
//Component
import RegisterBed from '../../components/RegisterBed/RegisterBed';
import RemoveSector from '../../components/RemoveSector/RemoveSector';
import RegisterSector from '../../components/RegisterSector/RegisterSector';
import RemoveBed from '../../components/RemoveBed/RemoveBed';
//Pages
import ConfigHospital from './ConfigHospital/ConfigHospital';

const Hospital = () => {

    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Params
    const { hospital } = useParams();

    /**
     * Show sidebar
     * When click in fade page, the aside area is closed.
     */

    const pageAside = useRef<HTMLDivElement>(null);

    const handleShow = ():void => {
        pageAside.current?.classList.toggle(styles.open);
    };

    /**
     * Caso entrar em um celular com tela pequen por padrão 
     * a area de navegação estará fechada.
     */

    const toggleNavArea = () => {
        if(window.innerWidth < 769){
            pageAside.current?.classList.remove(styles.open);
        } else {
            pageAside.current?.classList.add(styles.open);
        }
    };

    useEffect(()=>{
        toggleNavArea();

        window.addEventListener('resize', ()=>{
            toggleNavArea();
        });

    }, []);

    const handleNav = () => {
        toggleNavArea();
    };

    /**
     * Get data hospital
     */
    //Hospital data from hospital slice
    const { hospital: hospitalData }: { hospital: IHospital | null } = useSelector((state: RootState) => state.hospital);
    //Type accomodation data from typeAccomodation slice
    const { typeAccommodation } : { typeAccommodation:ITypeAccommodation[] } = useSelector((state: RootState) => state.typeAccomodation)

    //when open this page, the data contained in the slice of accommodation type and sectors will be cleared
    useEffect(()=>{
        //Clear type accomodation data. Then type accomodation is used in select form.
        dispatch(resetTypeAccomodation());
        //Clear sectors
        dispatch(clearSectors());

        const refresh = async() => {
            if(hospital){ //run only when params id is passed
                await dispatch(refreshToken()); //Update authentication tokens to fetch data from the backend
                dispatch(getDataHospital(hospital)); //Update data of hospital
                dispatch(listTypeAccomodation()); //Update data of list select the type accomodation
                dispatch(listSector(hospital)); //Update data of sectors
            }
        }

        refresh();

    }, [dispatch, hospital]);

    /**
     * Submit form Sectors
     */
    const { sectors } : { sectors: ISector[] } = useSelector((state: RootState) => state.sector);
    
    /**
     * Navigate first type accomodation default
     */
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!window.location.href.includes('editar') && !window.location.href.includes('leitos')) {
            if(sectors.length > 0){
                navigate(`configurar/${sectors[0].id}/leitos`);
            }
        } else {
            if(sectors.length === 0){
                navigate(`/hospitais/cadastrar/${hospital}`);
            }
        }

    }, [sectors]);
    
    return (
        <>
            <div className={`${styles.container}`} ref={pageAside}>
                <div className={`${styles.fade}`} onClick={handleShow}></div>
                <div className='d-flex h-100'>
                    <div className={`${styles.containerAside} shadow`}>
                        <div className={`${styles.aside}`}>
                            <div className={`p-4 pt-3 ${styles.contentAside}`}>
                                <div className={`${styles.navBarAside} px-0 d-flex justify-content-between align-items-center position-relative`}>
                                    <Link to='/hospitais'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
                                        </svg>
                                        <span>Hospitais</span>
                                    </Link>
                                    <div className='top-0 end-0 d-md-none d-xxl-none'>
                                        <button className='border-0 bg-transparent p-0' onClick={handleShow}>
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{'height': '2em'}} viewBox="0 0 384 512">
                                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center position-relative'>
                                    <div className={`${styles.title}`}>
                                        <span>{hospitalData?.cnes}</span>
                                        <h5 className='m-0'>{hospitalData?.acronym}</h5>
                                        <p>{hospitalData?.name}</p>
                                    </div>
                                </div>
                                <div className={`w-100 mt-3 mb-3 ${styles.addButton}`}>
                                    <button className='form-control' data-bs-toggle="modal" data-bs-target="#register-sector">
                                        <svg height="1em" viewBox="0 0 448 512" style={{'fill': '#fff'}}><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                        <span>Setores</span>
                                    </button>
                                </div>
                                <p className='pt-2 mb-0' style={{color: 'var(--secundary-color)', fontSize: '.86rem', fontWeight: '500'}}>SETORES</p>
                                <div className={`d-flex flex-column flex-shrink-0 pt-3 ${styles.navigate}`}>
                                    <ul className='nav nav-pills flex-column mb-auto'>
                                        {
                                            sectors.map((sector)=>(
                                                <li className='nav-item mb-2 sub-item' key={sector.id}>
                                                    <NavLink to={`configurar/${sector.id}`} className={`nav-link ${styles.navSector}`} onClick={handleNav}>
                                                        <div className={`${styles.label_navSector} ${!sector.is_active ? styles.desactive : ''}`}>
                                                            {
                                                                sector.is_active ? (
                                                                    <svg viewBox="0 0 576 512" width={'1em'} height={'1em'}>
                                                                        <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/>
                                                                    </svg>
                                                                ) : (
                                                                    <svg viewBox="0 0 448 512" width={'.86em'} height={'.86em'}>
                                                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                                                    </svg>
                                                                )
                                                            }
                                                            <span>{sector.name}</span>
                                                        </div>
                                                        <div className={`${styles.begde}`}>
                                                            00
                                                        </div>
                                                    </NavLink>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.containerBody}`}>
                        <div className={`${styles.menu} shadow`}>
                            <button className={`${styles.menuButton}`} onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
                                </svg>
                            </button>
                        </div>
                        <div className={`${styles.contentBody} p-2`}>
                            <Routes>
                                <Route path="configurar/:sector/*" element={<ConfigHospital/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
            <RegisterBed/>
            <RemoveSector/>
            <RemoveBed/>
            <RegisterSector hospital={hospitalData} typeAccommodation={typeAccommodation}/>
        </>
    )
}

export default Hospital;