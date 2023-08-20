import React, {FormEvent, useEffect} from 'react'
//Redux
import { useDispatch } from 'react-redux';
import { remove } from '../../slices/bedSlice';
import { RootState } from '../../store';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
//Hooks
import { useRef } from 'react';
//Context
import { useBedContext } from '../Context/BedContext';

const RemoveBed = () => {
    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Cancel button
    const cancelButton = useRef<HTMLButtonElement>(null);
    //Context
    const bedSelected = useBedContext();
    
    const handleRemoveBed = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(bedSelected?.bedSelected){
            await dispatch(refreshToken());
            await dispatch(remove(bedSelected?.bedSelected));
            cancelButton.current?.click();
        }
    };

    return (
        <>
            <div className='modal fade pb-5' id='exclude-bed-modal' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content border-0'>
                        <div className='modal-body pb-0 text-center'>
                            <h5>Deseja remover este leito?</h5>
                            <p>Cuidado. Ao deletar o leito essa ação será irreversível.</p>
                        </div>
                        <div className='modal-footer border-0 modal_footer_bg px-4'>
                            <button className='form-control cancel' data-bs-dismiss="modal" aria-label="Close" ref={cancelButton}>
                                Cancelar
                            </button>
                            <button className='form-control bg-danger' onClick={handleRemoveBed}>
                                Deletar
                            </button>
                        </div>
                    </div>
                </div>
            </div>    
        </>
  )
}

export default RemoveBed;