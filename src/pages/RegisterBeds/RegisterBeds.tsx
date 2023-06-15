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
        <div className={`${styles.open} ${styles.area}`} ref={page}>
            <div className={`${styles.fade}`} onClick={handleShow}></div>
            <div className='d-flex'>
                <div className={`${styles.aside} shadow`}>
                    <div className='p-3'>
                        <div className={`${styles.navigate} px-0`}>
                            <Link to='/hospitais'>
                            <svg width="1.16em" height="1.16em" version="1.0" viewBox="0 0 148 130">
                                <g transform="translate(0 130) scale(.1 -.1)">
                                <path d="m338 962c-220-219-288-293-288-312 0-18 67-91 282-307 156-156 291-286 301-289 21-7 57 21 57 43 0 8-106 123-235 256l-235 242 600 5c638 5 620 4 620 50s18 45-620 50l-600 5 235 242c129 133 235 248 235 256 0 17-32 47-51 47-7 0-143-129-301-288z"/>
                                </g>
                            </svg>
                                Hospitais
                            </Link>
                        </div>
                        <div className='d-flex justify-content-between align-items-center position-relative'>
                            <div className={`${styles.title}`}>
                                <span>{hospitalData?.cnes}</span>
                                <h5 className='m-0'>{hospitalData?.acronym}</h5>
                                <p>{hospitalData?.name}</p>
                            </div>
                            <div className='position-absolute top-0 end-0'>
                                <button className='border-0 bg-transparent' onClick={handleShow}>
                                    <svg width="1.2em" height="1.2em" version="1.0" viewBox="0 0 108 108" style={{'fill':'var(--secundary-color)'}}>
                                        <g transform="translate(0 108) scale(.1 -.1)">
                                            <path d="m52 1028c-34-34-16-58 200-275l212-212-212-214c-170-170-212-218-212-240 0-26 23-47 51-47 7 0 110 97 229 215l215 215 205-206c113-113 213-210 223-215 25-14 67 14 67 43 0 15-66 88-212 234l-211 213 211 216c122 125 212 224 212 235 0 23-26 50-48 50-10 0-71-54-137-121-66-66-164-161-218-211l-98-91-212 211c-210 209-236 229-265 200z"/>
                                        </g>
                                    </svg>
                                </button>
                            </div>
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
    )
}

export default RegisterBeds;