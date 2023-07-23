import React, { useEffect, useState } from 'react'
//components
import Alert from '../Alert/Alert';
//styles
import styles from './Logout.module.css';
//Redux
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { logout } from '../../slices/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {}

const Logout = (props: Props) => {

    const { successLogout }: {successLogout: boolean } = useSelector((state: RootState) => state.auth);
    /**
     * Start: Realiza o logout
     */
    const dispatch = useDispatch<ThunkDispatch<void, void, AnyAction>>();
    
    const handleLogout = ():void => {
        dispatch(logout());
    };

    return (
        <>
            {/* successLogout && <Alert message={'Sessão encerrada.'} trigger={successLogout} type={'success'}/>*/}
            <div className='modal fade pb-5' id='logout-modal' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className='modal-content modal_custom'>
                        <div className='modal-body text-center'>
                            <p>Deseja encerrar a sessão?</p>
                        </div>
                        <div className={`modal-footer ${styles.submit_logout}`}>
                            <button className={`form-control cancel`} data-bs-dismiss="modal" aria-label="Close">
                                <span>Cancelar</span>
                            </button>  
                            <button className='form-control' onClick={handleLogout} data-bs-dismiss="modal" aria-label="Close">
                                <span>Sim</span>
                            </button>                  
                        </div>
                    </div>
                </div>
            </div>        
        </>
    )
};

export default Logout;