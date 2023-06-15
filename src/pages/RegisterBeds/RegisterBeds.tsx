import React from 'react'
//Styles
import styles from './RegisterBeds.module.css';
//Hooks
import { useParams } from 'react-router-dom';
import { useRef } from 'react';

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
    
    return (
        <div className={`${styles.open} ${styles.area}`} ref={page}>
            <div className={`${styles.fade}`} onClick={handleShow}></div>
            <div className='d-flex'>
                <div className={`${styles.aside} shadow`}>
                    <div className='p-3'>
                        <div className='d-flex justify-content-between align-items-center position-relative'>
                            <div>
                                <h5 className='m-0'>XXX</h5>
                                <p>xxxxxxxx</p>
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