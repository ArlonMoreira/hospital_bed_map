import React, {useEffect, useRef, useState, ChangeEvent, FormEvent} from 'react'
//Interface
import { IStatus, IType, IBedErrors } from '../../interfaces/Bed';
import { IBedParams } from '../../interfaces/Bed';
//Redux
import { status, type } from '../../slices/formBedSlice';
import { register, resetAlertBed, reset } from '../../slices/bedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
//Context
import { useSectorContext } from '../../Context/SectorContext';
//Component
import Alert from '../Alert/Alert';

const RegisterBed = () => {

    //Setor selecionado
    const sectorSelected = useSectorContext();
    //Butão cancelar
    const cancelButtonRegisterBed = useRef<HTMLInputElement>(null);
    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

    /**
     * Cadastrar leito
    */
    useEffect(()=>{
        const updateForm = async () => {
            await dispatch(refreshToken()); //Update authentication tokens to fetch data from the backend
            dispatch(status());
            dispatch(type());
        }
        updateForm();

    }, [dispatch]);

    const { 
        statusData,
        typeData
    }: {
        statusData: IStatus[],
        typeData: IType[]
    } = useSelector((state: RootState) => state.formBed);

    const {
        registerSuccess,
        mensagemRegisterSuccess,
        errorsRegisterBed,
        registerError,
        mensagemRegisterError
    }: {
        registerSuccess: boolean,
        mensagemRegisterSuccess: string | null,
        errorsRegisterBed: IBedErrors,
        registerError: boolean,
        mensagemRegisterError: string | null,
    } = useSelector((state: RootState) => state.bed);

    /**
     * Submit form
     */
    const [nameBed, setNameBed] = useState<string>('');
    const [statusBed, setStatusBed] = useState<number>(1);
    const [typeBed, setTypeBed] = useState<number>(1);
    const [activeBed, setActiveBed] = useState<boolean>(true);
    const [extraBed, setExtraBed] = useState<boolean>(false);

    useEffect(()=>{
        //Selecionar por padrão o primeiro status
        if(statusData && statusData.length > 0){
            setStatusBed(statusData[0].id!);
        }
    }, [statusData]);

    useEffect(()=>{
        //Selecionar por padrão o primeiro status
        if(typeData && typeData.length > 0){
            setTypeBed(typeData[0].id!);
        }
    }, [typeData]);

    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const sector = sectorSelected?.sectorSelected && parseInt(sectorSelected?.sectorSelected);
    
        const data:IBedParams  = {
            sector: null,
            name: nameBed,
            type_occupation: statusBed,
            type: typeBed,
            is_active: activeBed,
            is_extra: extraBed
        }

        if(sector){
            data.sector = sector;
        }
        
        await dispatch(refreshToken()); //Update authentication tokens to fetch data from the backend
        await dispatch(register(data));

    };

    const [showRegisterBed, SetShowRegisterBed] = useState<boolean>(false);

    useEffect(()=>{
        if(registerSuccess){
            SetShowRegisterBed(true);

            const timeout = setTimeout(()=>{
                SetShowRegisterBed(false);
                dispatch(resetAlertBed());
            }, 2700);

            return () => {
                clearTimeout(timeout);
            }
        } else {
            SetShowRegisterBed(false);
        }
    }, [registerSuccess]);

    useEffect(()=>{
        if(registerSuccess) {
            cancelButtonRegisterBed.current?.click();
            setNameBed('');
            setActiveBed(true);
            setExtraBed(false);
            dispatch(reset());
        }
    }, [registerSuccess]);

    const [showRegisterBedError, setShowRegisterBedError] = useState<boolean>(false);

    useEffect(()=>{
        if(registerError){
            setShowRegisterBedError(true);

            const timeout = setTimeout(()=>{
                setShowRegisterBedError(false);
                dispatch(resetAlertBed());
            }, 2700);

            return () => {
                clearTimeout(timeout);
            }
        } else {
            setShowRegisterBedError(false);
        }
    }, [registerError]);

    return (
        <>
            {showRegisterBed && <Alert message={mensagemRegisterSuccess} type='success'/>}
            {showRegisterBedError && <Alert message={mensagemRegisterError} type='error'/>}
            <div className='modal fade pb-5' id='add-bed-modal' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg'>
                    <div className='modal-content border-0'>
                        <div className='modal-header border-0 modal_header_bg p-4'>
                            <div className='d-flex'>
                                <svg viewBox="0 0 168 166" width="1.5em" height="1.5em">
                                    <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                                </svg>
                                <h5 className='m-0 mx-1'>
                                    Cadastrar Leito
                                </h5>
                            </div>         
                        </div>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='modal-body p-4 row'>
                                <div className='col-md-4'>
                                    <label className='w-100'>
                                        <span>Nome</span>
                                        <input
                                            className={`form-control ${errorsRegisterBed?.name && 'border border-danger'}`}
                                            value={nameBed}
                                            placeholder='Nome de identificação do leito'
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNameBed(e.target.value)}
                                        />
                                        {
                                            errorsRegisterBed?.name && (
                                                <ul className='error-message'>
                                                    {
                                                        errorsRegisterBed?.name.map((error, i)=>(
                                                            <li key={i}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                                                </svg>
                                                                <p>{error}</p> 
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            )
                                        }
                                    </label>
                                </div>
                                <div className='col-md-4'>
                                    <label className='w-100'>
                                        <span>Status</span>
                                        <select
                                            className='form-select'
                                            value={statusBed}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusBed(parseInt(e.target.value))}>
                                            {
                                                statusData && statusData.map((status,i)=>(
                                                    <option key={i} value={status.id?.toString()}>{status.status}/{status.description}</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                </div>
                                <div className='col-md-4'>
                                    <label className='w-100'>
                                        <span>Tipo</span>
                                        <select
                                            className='form-select'
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeBed(parseInt(e.target.value))}>
                                            {
                                                typeData && typeData.map((type, i)=>(
                                                    <option key={i} value={type.id?.toString()}>{type.description}</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                </div>
                                <div className='col-6 col-md-4'>
                                    <label className='w-100 d-flex flex-column'>
                                        <span>Ativo:</span>
                                        <label className='switch mb-0'>
                                            <input  type='checkbox'
                                                    checked={activeBed}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setActiveBed(e.target.checked)}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </label>
                                </div>
                                <div className='col-6 col-md-4'>
                                    <label className='w-100 d-flex flex-column'>
                                        <span>Extra:</span>
                                        <label className='switch mb-0'>
                                            <input  type='checkbox'
                                                    checked={extraBed}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setExtraBed(e.target.checked)}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </label>
                                </div>
                            </div>
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                <input 
                                    className='cancel col-4'
                                    type='cancel'
                                    defaultValue='Cancelar'
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ref={cancelButtonRegisterBed}
                                />                                
                                <input type='submit' value='Cadastrar' className='col-4'/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterBed;