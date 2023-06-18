import React, { useEffect } from 'react'
//Styles
import styles from './RegisterBeds.module.css';
//Router
import { Link } from 'react-router-dom';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { hospital } from '../../slices/hospitalSlice';
//Hooks
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
//Interface
import { IHospital } from '../../interfaces/Hospital';

type Props = {}

const RegisterBeds = (props: Props) => {
    //Params
    const { id } = useParams();

    /**
     * Show sidebar
     */

    const page = useRef<HTMLDivElement>(null);

    const handleShow = ():void => {
        page.current?.classList.toggle(styles.open)
    };

    /**
     * Get data hospital
     */
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    const { hospital: hospitalData }: { hospital: IHospital | null } = useSelector((state: RootState) => state.hospital);

    useEffect(()=>{
        if(id){
            dispatch(hospital(id));
        }
    }, [dispatch]);
    
    return (
        <>
            <div className={`${styles.open} ${styles.area}`} ref={page}>
                <div className={`${styles.fade}`} onClick={handleShow}></div>
                <div className='d-flex'>
                    <div className={`${styles.aside} shadow`}>
                        <div className='p-3'>
                            <div className={`${styles.toolarea} px-0 d-flex justify-content-between align-items-center position-relative`}>
                                <Link to='/hospitais'>
                                    <svg width="1.16em" height="1.16em" version="1.0" viewBox="0 0 148 130">
                                        <g transform="translate(0 130) scale(.1 -.1)">
                                        <path d="m338 962c-220-219-288-293-288-312 0-18 67-91 282-307 156-156 291-286 301-289 21-7 57 21 57 43 0 8-106 123-235 256l-235 242 600 5c638 5 620 4 620 50s18 45-620 50l-600 5 235 242c129 133 235 248 235 256 0 17-32 47-51 47-7 0-143-129-301-288z"/>
                                        </g>
                                    </svg>
                                    Hospitais
                                </Link>
                                <div className='position-absolute top-0 end-0'>
                                    <button className='border-0 bg-transparent p-0' onClick={handleShow}>
                                        <svg width="1.2em" height="1.2em" version="1.0" viewBox="0 0 108 108" style={{'fill':'var(--secundary-color)'}}>
                                            <g transform="translate(0 108) scale(.1 -.1)">
                                                <path d="m52 1028c-34-34-16-58 200-275l212-212-212-214c-170-170-212-218-212-240 0-26 23-47 51-47 7 0 110 97 229 215l215 215 205-206c113-113 213-210 223-215 25-14 67 14 67 43 0 15-66 88-212 234l-211 213 211 216c122 125 212 224 212 235 0 23-26 50-48 50-10 0-71-54-137-121-66-66-164-161-218-211l-98-91-212 211c-210 209-236 229-265 200z"/>
                                            </g>
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
                            <div className={`w-100 mt-3 ${styles.add}`}>
                                <button className='form-control' data-bs-toggle="modal" data-bs-target="#register-sector">
                                    <svg height="1em" viewBox="0 0 448 512" style={{'fill': '#fff'}}><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                    <span>Setores</span>
                                </button>
                            </div>
                            <div className={`w-100 d-flex flex-column flex-shrink-0 pt-3 ${styles.navigate}`}>
                                <ul className='nav nav-pills flex-column mb-auto'>
                                    <li className='nav-item'>
                                        <a className='nav-link'>Teste testando</a>
                                    </li>
                                    <li className='nav-item'>
                                        <a className='nav-link'>Teste testando</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.main}`}>
                        <div className={`${styles.nav} shadow`}>
                            <button className={`${styles.closebtn}`} onClick={handleShow}>
                                <div className='nav_button'>
                                    <span></span>
                                    <span></span>
                                    <span></span> 
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal fade pb-5' id='register-sector' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg'>
                    <div className='modal-content border-0'>
                        <div className='modal-header border-0 modal_header_bg p-4'>
                            <div className='d-flex'>
                                <svg viewBox="0 0 168 166" width="1.5em" height="1.5em">
                                    <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                                </svg>
                                <h5 className='m-0 mx-1'>
                                    Cadastrar Setor
                                </h5>
                            </div>
                        </div>
                        <form className='register_form'>
                            <div className='modal-body p-4 row'>
                                <label className='col-3'>
                                    <span>Nome</span>
                                    <input
                                        className='form-control'
                                    />
                                </label>
                                <label className='col-9'>
                                    <span>Descrição</span>
                                    <input
                                        className='form-control'
                                    />
                                </label>
                                <label className='col-6'>
                                    <span>Tipo de acomodação</span>
                                    <select className='form-select'>
                                        <option>UTI ADULTO</option>
                                        <option>ENFERMARIA ADULTO</option>
                                    </select>
                                </label>
                                <label className='col-2 d-flex flex-column'>
                                    <span>Ativo:</span>
                                    <label className='switch mb-0'>
                                        <input  type='checkbox'/>
                                        <span className="slider round"></span>
                                    </label>                                    
                                </label>
                            </div>
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                <input type='submit' value='Cadastrar'/>
                                <input className='cancel' type='cancel' defaultValue='Cancelar' data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterBeds;

/*
                                                checked={is_active}
    onChange={(e: ChangeEvent<HTMLInputElement>) => setIs_active(e.target.checked)}

*/