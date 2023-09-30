import React, {FormEvent, useEffect, useState} from 'react'
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { remove, resetAlertBed } from '../../slices/bedSlice';
import { RootState } from '../../store';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
//Hooks
import { useRef } from 'react';
//Context
import { useBedContext } from '../Context/BedContext';
//Components
import Alert from '../Alert/Alert';

const RemoveBed = () => {
    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Cancel button
    const cancelButton = useRef<HTMLInputElement>(null);
    //Context
    const bedSelected = useBedContext();
    
    const handleRemoveBed = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(bedSelected?.bedSelected){
            await dispatch(refreshToken());
            await dispatch(remove(bedSelected?.bedSelected));
            cancelButton.current?.click();
        }
    };

    const {removeError, mensagemRemoverError}: {removeError:boolean, mensagemRemoverError:string | null} = useSelector((state:RootState) => state.bed);

    //Alert
    const [ showAlertRemoveBed, setShowAlertRemoveBed ] = useState<boolean>(false);

    useEffect(()=>{
        if(removeError){
            setShowAlertRemoveBed(true);

            const timeout = setTimeout(()=>{
                setShowAlertRemoveBed(false);
                dispatch(resetAlertBed());
            }, 2700);

            return () => {
                clearTimeout(timeout);
            };

        } else {
            setShowAlertRemoveBed(false);
        }

    }, [removeError]);

    return (
        <>
            { showAlertRemoveBed && <Alert message={mensagemRemoverError} type='error'/>}
            <div className='modal fade pb-5' id='exclude-bed-modal' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content border-0'>
                        <form onSubmit={handleRemoveBed}>
                            <div className='modal-body pb-0 text-center'>
                                <h5>Deseja remover este leito?</h5>
                                <p>Cuidado. Ao deletar o leito essa ação será irreversível.</p>
                            </div>
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                <input  className='cancel col-4'
                                        type='cancel'
                                        ref={cancelButton}
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        defaultValue='Cancelar'/>
                                <input className='bg-danger col-4' type='submit' defaultValue='Deletar'/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>    
        </>
  )
}

export default RemoveBed;